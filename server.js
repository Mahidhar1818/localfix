const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Server: SocketServer } = require('socket.io');

const User = require('./server/models/user');
const Job = require('./server/models/job');
const Review = require('./server/models/review');
const Message = require('./server/models/message');
const { requireAuth, requireRole, verifySocketToken } = require('./server/middleware/auth');
const { diagnoseWithGemini, CATEGORIES } = require('./server/services/gemini');
const { sendSmsOtp, sendEmailOtp, verifyOtp, normalizePhone } = require('./server/services/twilio');

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || true, credentials: true }
});

const PORT = Number(process.env.PORT || 3000);
const publicDir = __dirname;
const allowedOrigins = (process.env.CLIENT_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);

// ---------- MIDDLEWARE ----------
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('tiny'));

// ---------- HELPERS ----------
function authPayload(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    skills: user.skills,
    rating: user.rating
  };
}

function issueToken(user) {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured');
    error.status = 503;
    throw error;
  }
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    skills: user.skills,
    rating: user.rating,
    completedJobs: user.completedJobs,
    isVerified: user.isVerified,
    location: user.location
  };
}

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

function requireDatabase(req, res, next) {
  if (!isDatabaseReady()) {
    return res.status(503).json({ error: 'MongoDB is not connected. Set MONGODB_URI and restart the server.' });
  }
  next();
}

function cleanMessage(message) {
  return {
    id: message._id,
    jobId: message.jobId,
    senderId: message.senderId,
    body: message.body,
    createdAt: message.createdAt
  };
}

function generateBookingOtp() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

// ---------- HEALTH ----------
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'localfix-api',
    database: isDatabaseReady() ? 'connected' : 'not-configured',
    gemini: Boolean(process.env.GEMINI_API_KEY),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    timestamp: new Date().toISOString()
  });
});

// ---------- AUTH ----------
app.post('/api/auth/register', requireDatabase, async (req, res, next) => {
  try {
    const { name, email, password, role, skills = [], phone } = req.body;
    if (!name || !email || !password || !['customer', 'technician'].includes(role)) {
      return res.status(400).json({ error: 'name, email, password and a valid role are required' });
    }
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim(),
      password: await bcrypt.hash(password, 12),
      role,
      skills: Array.isArray(skills) ? skills.slice(0, 20) : []
    });

    const token = issueToken(user);
    res.status(201).json({ token, user: authPayload(user) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/login', requireDatabase, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ token: issueToken(user), user: authPayload(user) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireDatabase, requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// ---------- OTP (Twilio SMS + SMTP Email) ----------
app.post('/api/otp/mobile/send', requireDatabase, async (req, res, next) => {
  try {
    const { phone, purpose = 'verify' } = req.body;
    if (!phone) return res.status(400).json({ error: 'phone is required' });
    const result = await sendSmsOtp(phone, purpose);
    res.json({ ok: true, channel: 'sms', identifier: result.identifier, dev: Boolean(result.dev) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/otp/mobile/verify', requireDatabase, async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) return res.status(400).json({ error: 'phone and code are required' });
    const result = await verifyOtp({ identifier: phone, channel: 'sms', code });
    if (!result.ok) return res.status(400).json({ error: result.reason });

    await User.updateOne({ phone: phone.trim() }, { phoneVerified: true });
    res.json({ ok: true, phone: result.identifier });
  } catch (error) {
    next(error);
  }
});

app.post('/api/otp/email/send', requireDatabase, async (req, res, next) => {
  try {
    const { email, purpose = 'verify' } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });
    const result = await sendEmailOtp(email, purpose);
    res.json({ ok: true, channel: 'email', identifier: result.identifier, dev: Boolean(result.dev) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/otp/email/verify', requireDatabase, async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'email and code are required' });
    const result = await verifyOtp({ identifier: email, code, channel: 'email' });
    if (!result.ok) return res.status(400).json({ error: result.reason });

    await User.updateOne({ email: email.trim().toLowerCase() }, { emailVerified: true });
    res.json({ ok: true, email: result.identifier });
  } catch (error) {
    next(error);
  }
});

// ---------- LIVE LOCATION ----------
app.post('/api/location/update', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const { lat, lng, address } = req.body;
    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
      return res.status(400).json({ error: 'lat and lng are required numbers' });
    }

    req.user.liveLocation = {
      lat: Number(lat),
      lng: Number(lng),
      address: address ? String(address).slice(0, 300) : req.user.liveLocation?.address,
      updatedAt: new Date()
    };
    await req.user.save();

    const jobs = await Job.find({
      $or: [{ customerId: req.user._id }, { technicianId: req.user._id }]
    }).select('_id');

    const payload = {
      userId: req.user._id.toString(),
      role: req.user.role,
      name: req.user.name,
      lat: req.user.liveLocation.lat,
      lng: req.user.liveLocation.lng,
      address: req.user.liveLocation.address,
      updatedAt: req.user.liveLocation.updatedAt
    };

    jobs.forEach(job => io.to(`job:${job._id}`).emit('location:update', payload));
    res.json({ ok: true, liveLocation: req.user.liveLocation });
  } catch (error) {
    next(error);
  }
});

app.get('/api/location/:userId', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const target = await User.findById(req.params.userId).select('name role liveLocation location');
    if (!target) return res.status(404).json({ error: 'User not found' });
    res.json({
      user: {
        id: target._id,
        name: target.name,
        role: target.role,
        liveLocation: target.liveLocation || target.location || null
      }
    });
  } catch (error) {
    next(error);
  }
});

// ---------- AI DIAGNOSE (FixMatch) ----------
app.post('/api/ai/diagnose', requireDatabase, requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const problemDescription = String(req.body.problemDescription || '').trim();
    if (problemDescription.length < 5) {
      return res.status(400).json({ error: 'problemDescription must be at least 5 characters' });
    }

    const diagnosis = await diagnoseWithGemini(problemDescription);
    res.json({ diagnosis });
  } catch (error) {
    if (error.code === 'GEMINI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to enable FixMatch.' });
    }
    if (error instanceof SyntaxError) {
      return res.status(502).json({ error: 'Gemini returned an invalid diagnosis format' });
    }
    next(error);
  }
});

// ---------- TECHNICIANS ----------
app.get('/api/technicians', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const category = String(req.query.category || '').trim();
    if (!category) return res.status(400).json({ error: 'category is required' });

    const query = {
      role: 'technician',
      skills: { $regex: new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    };

    const technicians = await User.find(query)
      .select('name skills rating completedJobs isVerified location liveLocation')
      .sort({ rating: -1, completedJobs: -1 })
      .limit(50);

    res.json({ technicians: technicians.map(publicUser) });
  } catch (error) {
    next(error);
  }
});

// ---------- JOBS ----------
app.post('/api/jobs', requireDatabase, requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const { category, problemDescription, technicianId, scheduledAt, customerLocation, visitCost } = req.body;
    if (!category || !problemDescription) {
      return res.status(400).json({ error: 'category and problemDescription are required' });
    }

    if (technicianId) {
      const technician = await User.findOne({ _id: technicianId, role: 'technician' });
      if (!technician) return res.status(400).json({ error: 'Selected technician was not found' });
    }

    const bookingOtp = generateBookingOtp();

    const job = await Job.create({
      customerId: req.user._id,
      technicianId,
      category,
      problemDescription,
      scheduledAt,
      customerLocation,
      visitCost: Number.isFinite(Number(visitCost)) ? Number(visitCost) : 299,
      bookingOtp
    });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;

    res.status(201).json({ job: jobObj, bookingOtp });
  } catch (error) {
    next(error);
  }
});

app.get('/api/jobs', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const filter = req.user.role === 'customer' ? { customerId: req.user._id } : { technicianId: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const jobs = await Job.find(filter)
      .populate('customerId', 'name email phone liveLocation location')
      .populate('technicianId', 'name skills rating liveLocation location')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

app.get('/api/jobs/:id', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('customerId', 'name phone liveLocation location')
      .populate('technicianId', 'name skills rating liveLocation location');

    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = [job.customerId?._id, job.technicianId?._id]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'You cannot access this job' });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;
    res.json({ job: jobObj });
  } catch (error) {
    next(error);
  }
});

// Customer fetches their booking OTP
app.get('/api/jobs/:id/otp', requireDatabase, requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, customerId: req.user._id }).select('+bookingOtp');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ bookingOtp: job.bookingOtp, otpVerified: job.otpVerified });
  } catch (error) {
    next(error);
  }
});

// Technician submits OTP → job completes
app.post('/api/jobs/:id/verify-otp', requireDatabase, requireAuth, requireRole('technician'), async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ error: 'otp is required' });

    const job = await Job.findOne({ _id: req.params.id, technicianId: req.user._id }).select('+bookingOtp');
    if (!job) return res.status(404).json({ error: 'Assigned job not found' });
    if (job.otpVerified) return res.status(409).json({ error: 'OTP already verified for this job' });
    if ((job.otpAttempts || 0) >= 5) return res.status(429).json({ error: 'Too many OTP attempts. Contact support.' });

    if (String(otp).trim() !== String(job.bookingOtp)) {
      job.otpAttempts = (job.otpAttempts || 0) + 1;
      await job.save();
      return res.status(400).json({ error: 'Incorrect OTP' });
    }

    job.otpVerified = true;
    job.otpVerifiedAt = new Date();
    job.status = 'Completed';
    job.completedAt = new Date();
    await job.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { completedJobs: 1 } });
    io.to(`job:${job._id}`).emit('job:completed', { jobId: job._id, at: job.completedAt });

    const jobObj = job.toObject();
    delete jobObj.bookingOtp;
    res.json({ ok: true, job: jobObj });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/jobs/:id/status', requireDatabase, requireAuth, requireRole('technician'), async (req, res, next) => {
  try {
    const { status, partCost, laborCost, beforePhoto, afterPhoto } = req.body;
    const allowed = ['Accepted', 'In Progress', 'Completed'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status transition' });

    const job = await Job.findOne({ _id: req.params.id, technicianId: req.user._id });
    if (!job) return res.status(404).json({ error: 'Assigned job not found' });

    // Force OTP flow: cannot complete without OTP verification
    if (status === 'Completed' && !job.otpVerified) {
      return res.status(400).json({
        error: 'Ask the customer for their 6-digit completion OTP to finish this job.'
      });
    }

    const order = ['Pending', 'Accepted', 'In Progress', 'Completed'];
    if (order.indexOf(status) < order.indexOf(job.status)) {
      return res.status(409).json({ error: 'Job status cannot move backwards' });
    }

    job.status = status;
    if (partCost !== undefined) job.partCost = Math.max(0, Number(partCost) || 0);
    if (laborCost !== undefined) job.laborCost = Math.max(0, Number(laborCost) || 0);
    if (beforePhoto) job.beforePhoto = String(beforePhoto).slice(0, 500);
    if (afterPhoto) job.afterPhoto = String(afterPhoto).slice(0, 500);
    if (status === 'Completed') job.completedAt = new Date();

    await job.save();

    if (status === 'Completed') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { completedJobs: 1 } });
    }
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

// ---------- REVIEWS ----------
app.post('/api/jobs/:id/review', requireDatabase, requireAuth, requireRole('customer'), async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, customerId: req.user._id, status: 'Completed' });
    if (!job) return res.status(404).json({ error: 'Completed customer job not found' });
    if (!job.technicianId) return res.status(400).json({ error: 'This job has no technician to review' });
    if (job.reviewId) return res.status(409).json({ error: 'This job already has a review' });

    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be an integer from 1 to 5' });
    }

    const review = await Review.create({
      jobId: job._id,
      customerId: req.user._id,
      technicianId: job.technicianId,
      rating,
      comment: String(req.body.comment || '').slice(0, 1000),
      isAnonymous: Boolean(req.body.isAnonymous)
    });

    job.reviewId = review._id;
    await job.save();

    const reviews = await Review.find({ technicianId: job.technicianId });
    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
    await User.findByIdAndUpdate(job.technicianId, { rating: Math.round(average * 10) / 10 });

    res.status(201).json({
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        displayName: review.isAnonymous ? 'Verified Customer' : req.user.name
      }
    });
  } catch (error) {
    next(error);
  }
});

// ---------- REPAIR STATS (QuoteCompare) ----------
app.get('/api/repairs/stats', requireDatabase, async (req, res, next) => {
  try {
    const category = String(req.query.category || '').trim();
    if (!category) return res.status(400).json({ error: 'category is required' });

    const [stats] = await Job.aggregate([
      {
        $match: {
          category: { $regex: new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          status: 'Completed'
        }
      },
      {
        $project: {
          partCost: 1,
          laborCost: 1,
          total: { $add: ['$visitCost', '$partCost', '$laborCost'] }
        }
      },
      {
        $group: {
          _id: null,
          completedJobs: { $sum: 1 },
          averagePartCost: { $avg: '$partCost' },
          averageLaborCost: { $avg: '$laborCost' },
          averageTotalCost: { $avg: '$total' },
          minTotalCost: { $min: '$total' },
          maxTotalCost: { $max: '$total' }
        }
      }
    ]);

    if (!stats) {
      return res.json({
        category,
        completedJobs: 0,
        averagePartCost: 0,
        averageLaborCost: 0,
        averageTotalCost: 0,
        minTotalCost: 0,
        maxTotalCost: 0
      });
    }

    res.json({
      category,
      completedJobs: stats.completedJobs,
      averagePartCost: Math.round(stats.averagePartCost || 0),
      averageLaborCost: Math.round(stats.averageLaborCost || 0),
      averageTotalCost: Math.round(stats.averageTotalCost || 0),
      minTotalCost: Math.round(stats.minTotalCost || 0),
      maxTotalCost: Math.round(stats.maxTotalCost || 0)
    });
  } catch (error) {
    next(error);
  }
});

// ---------- MESSAGES (Chat + Phone Masking) ----------
app.get('/api/jobs/:id/messages', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = [job.customerId, job.technicianId]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'You cannot access these messages' });

    const messages = await Message.find({ jobId: job._id }).sort({ createdAt: 1 }).limit(500);
    res.json({ messages: messages.map(cleanMessage) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/jobs/:id/messages', requireDatabase, requireAuth, async (req, res, next) => {
  try {
    const body = String(req.body.body || '').trim();
    if (!body) return res.status(400).json({ error: 'Message body is required' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const ownsJob = [job.customerId, job.technicianId]
      .some(id => id && id.toString() === req.user._id.toString());
    if (!ownsJob) return res.status(403).json({ error: 'You cannot post to this job' });

    const message = await Message.create({
      jobId: job._id,
      senderId: req.user._id,
      body: body.slice(0, 2000)
    });

    const payload = cleanMessage(message);
    io.to(`job:${job._id}`).emit('message:new', payload);
    res.status(201).json({ message: payload });
  } catch (error) {
    next(error);
  }
});

// ---------- SOCKET.IO (Real-time chat + live location) ----------
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    const user = verifySocketToken(token); // returns { sub, role }
    socket.user = { id: user.sub, role: user.role };
    next();
  } catch (error) {
    next(new Error('Unauthorized socket connection'));
  }
});

io.on('connection', socket => {
  // Chat room join/leave
  socket.on('job:join', jobId => {
    if (jobId) socket.join(`job:${jobId}`);
  });

  socket.on('job:leave', jobId => {
    if (jobId) socket.leave(`job:${jobId}`);
  });

  // Live location relay (client emits { lat, lng, address? })
  socket.on('location:update', async payload => {
    try {
      const { lat, lng, address } = payload || {};
      if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) return;

      const user = await User.findById(socket.user.id);
      if (!user) return;

      user.liveLocation = {
        lat: Number(lat),
        lng: Number(lng),
        address: address ? String(address).slice(0, 300) : user.liveLocation?.address,
        updatedAt: new Date()
      };
      await user.save();

      const jobs = await Job.find({
        $or: [{ customerId: user._id }, { technicianId: user._id }]
      }).select('_id');

      const out = {
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
        lat: user.liveLocation.lat,
        lng: user.liveLocation.lng,
        address: user.liveLocation.address,
        updatedAt: user.liveLocation.updatedAt
      };

      jobs.forEach(job => io.to(`job:${job._id}`).emit('location:update', out));
    } catch (err) {
      socket.emit('location:error', { error: 'Could not update location' });
    }
  });

  // Chat message via socket
  socket.on('message:send', async payload => {
    try {
      const jobId = payload?.jobId;
      const body = String(payload?.body || '').trim();
      if (!jobId || !body) return;

      const job = await Job.findById(jobId);
      if (!job) return;

      const ownsJob = [job.customerId, job.technicianId]
        .some(id => id && id.toString() === socket.user.id);
      if (!ownsJob) return;

      const message = await Message.create({
        jobId: job._id,
        senderId: socket.user.id,
        body: body.slice(0, 2000)
      });

      io.to(`job:${job._id}`).emit('message:new', cleanMessage(message));
    } catch (error) {
      socket.emit('message:error', { error: 'Could not send message' });
    }
  });

  socket.on('disconnect', () => {});
});

// ---------- STATIC FRONTEND ----------
app.use(express.static(publicDir, { extensions: ['html'] }));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

// ---------- DATABASE + SERVER START ----------
async function start() {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI is not set. Database routes will return 503.');
  } else {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        dbName: 'localfix'
      });
      console.log('✅ MongoDB connected');
    } catch (error) {
      if (error.code === 8000 || /bad auth/i.test(error.message)) {
        console.error('❌ MongoDB authentication failed. Check MONGODB_URI credentials in Atlas.');
      } else {
        console.error('❌ MongoDB connection failed:', error.message);
      }
    }
  }

  httpServer.listen(PORT, () => {
    console.log(`🚀 LocalFix running on http://localhost:${PORT}`);
    console.log(`   Socket.IO ready. Client script auto-served at /socket.io/socket.io.js`);
  });
}

start();
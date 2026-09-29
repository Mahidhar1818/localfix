const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, maxlength: 30 },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['customer', 'technician'], required: true },
  skills: [{ type: String, trim: true }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  completedJobs: { type: Number, min: 0, default: 0 },
  isVerified: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  location: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 }
  },
  // NEW: Real-time GPS tracking
  liveLocation: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    address: { type: String, maxlength: 300 },
    updatedAt: Date
  }
}, { timestamps: true });

userSchema.index({ role: 1, skills: 1, rating: -1 });
userSchema.index({ 'liveLocation.updatedAt': -1 });

module.exports = mongoose.model('User', userSchema);
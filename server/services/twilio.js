const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Otp = require('../models/otp');

const OTP_TTL_MIN = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_LENGTH = 6;

let twilioClient = null;
let mailer = null;

function getTwilio() {
  if (twilioClient !== null) return twilioClient;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    twilioClient = false;
    return twilioClient;
  }
  try {
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.warn('Twilio init failed:', err.message);
    twilioClient = false;
  }
  return twilioClient;
}

function getMailer() {
  if (mailer !== null) return mailer;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    mailer = false;
    return mailer;
  }
  try {
    mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
  } catch (err) {
    console.warn('Mailer init failed:', err.message);
    mailer = false;
  }
  return mailer;
}

function generateCode() {
  return String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');
}

function normalizePhone(phone) {
  if (!phone) return '';
  const digits = String(phone).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.length === 10) return '+91' + digits; // Default to India
  return '+' + digits;
}

async function createOtp({ identifier, channel, purpose = 'verify' }) {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
  await Otp.create({ identifier, channel, codeHash, purpose, expiresAt });
  return { code, expiresAt };
}

async function sendSmsOtp(phone, purpose = 'verify') {
  const identifier = normalizePhone(phone);
  if (!identifier) throw Object.assign(new Error('Invalid phone number'), { status: 400 });

  const { code, expiresAt } = await createOtp({ identifier, channel: 'sms', purpose });
  const client = getTwilio();

  if (!client) {
    console.log(`📱 [DEV] SMS OTP for ${identifier}: ${code} (expires ${expiresAt.toISOString()})`);
    return { sent: false, dev: true, identifier };
  }

  try {
    await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: identifier,
      body: `Your LocalFix verification code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`
    });
    return { sent: true, identifier };
  } catch (err) {
    console.error('Twilio send error:', err.message);
    console.log(`📱 [DEV-FALLBACK] SMS OTP for ${identifier}: ${code}`);
    return { sent: false, dev: true, identifier };
  }
}

async function sendEmailOtp(email, purpose = 'verify') {
  const identifier = String(email || '').trim().toLowerCase();
  if (!identifier) throw Object.assign(new Error('Invalid email'), { status: 400 });

  const { code, expiresAt } = await createOtp({ identifier, channel: 'email', purpose });
  const transport = getMailer();

  if (!transport) {
    console.log(`✉️  [DEV] Email OTP for ${identifier}: ${code} (expires ${expiresAt.toISOString()})`);
    return { sent: false, dev: true, identifier };
  }

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: identifier,
      subject: 'LocalFix verification code',
      text: `Your LocalFix verification code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`,
      html: `<p>Your <b>LocalFix</b> verification code is:</p>
             <p style="font-size:24px;letter-spacing:4px"><b>${code}</b></p>
             <p>It expires in ${OTP_TTL_MIN} minutes.</p>`
    });
    return { sent: true, identifier };
  } catch (err) {
    console.error('SMTP send error:', err.message);
    console.log(`✉️  [DEV-FALLBACK] Email OTP for ${identifier}: ${code}`);
    return { sent: false, dev: true, identifier };
  }
}

async function verifyOtp({ identifier, channel, code }) {
  const norm = channel === 'sms' ? normalizePhone(identifier) : String(identifier).trim().toLowerCase();
  const record = await Otp.findOne({
    identifier: norm,
    channel,
    consumed: false,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });

  if (!record) return { ok: false, reason: 'OTP expired or not found' };
  if (record.attempts >= 5) return { ok: false, reason: 'Too many attempts. Request a new OTP.' };

  const match = await bcrypt.compare(String(code), record.codeHash);
  record.attempts += 1;
  if (!match) {
    await record.save();
    return { ok: false, reason: 'Incorrect OTP' };
  }

  record.consumed = true;
  await record.save();
  return { ok: true, identifier: norm };
}

module.exports = { sendSmsOtp, sendEmailOtp, verifyOtp, normalizePhone };
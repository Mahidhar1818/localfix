const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: { type: String, required: true, lowercase: true, trim: true },
  channel: { type: String, enum: ['email', 'sms'], required: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'login', 'verify'], default: 'verify' },
  attempts: { type: Number, default: 0 },
  consumed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ identifier: 1, channel: 1, createdAt: -1 });

module.exports = mongoose.model('Otp', otpSchema);
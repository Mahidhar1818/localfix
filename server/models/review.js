const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000 },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true, trim: true },
  problemDescription: { type: String, required: true, trim: true, maxlength: 3000 },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  visitCost: { type: Number, min: 0, default: 299 },
  partCost: { type: Number, min: 0, default: 0 },
  laborCost: { type: Number, min: 0, default: 0 },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  beforePhoto: { type: String, maxlength: 500 },
  afterPhoto: { type: String, maxlength: 500 },
  customerLocation: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    address: { type: String, maxlength: 300 }
  },
  scheduledAt: Date,
  completedAt: Date
}, { timestamps: true });
jobSchema.virtual('totalCost').get(function totalCost() {
  return this.visitCost + this.partCost + this.laborCost;
});
jobSchema.set('toJSON', { virtuals: true });
jobSchema.index({ customerId: 1, createdAt: -1 });
jobSchema.index({ technicianId: 1, status: 1, createdAt: -1 });
jobSchema.index({ category: 1, status: 1 });
module.exports = mongoose.model('Job', jobSchema);
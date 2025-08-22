import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  siloId: { type: mongoose.Schema.Types.ObjectId, ref: 'Silo', required: true, index: true },
  type: { type: String, enum: ['TEMPERATURE', 'HUMIDITY', 'CO2'], required: true },
  value: { type: Number, required: true },
  threshold: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE', index: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
}, { timestamps: false });

export default mongoose.model('Alert', alertSchema);

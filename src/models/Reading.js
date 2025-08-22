import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
  siloId: { type: mongoose.Schema.Types.ObjectId, ref: 'Silo', required: true, index: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  co2: { type: Number, required: true },
  level: { type: Number, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: false });

export default mongoose.model('Reading', readingSchema);

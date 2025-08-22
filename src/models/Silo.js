import mongoose from 'mongoose';

const thresholdsSchema = new mongoose.Schema({
  tempMax: { type: Number, default: Number(process.env.TEMP_MAX) || 35 },
  humMax: { type: Number, default: Number(process.env.HUM_MAX) || 70 },
  co2Max: { type: Number, default: Number(process.env.CO2_MAX) || 2000 },
}, { _id: false });

const siloSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  capacityTons: { type: Number, default: 0 },
  thresholds: { type: thresholdsSchema, default: () => ({}) },
}, { timestamps: true });

export default mongoose.model('Silo', siloSchema);

import Joi from 'joi';
import Reading from '../models/Reading.js';
import Silo from '../models/Silo.js';
import Alert from '../models/Alert.js';

const createSchema = Joi.object({
  siloId: Joi.string().required(),
  temperature: Joi.number().required(),
  humidity: Joi.number().required(),
  co2: Joi.number().required(),
  level: Joi.number().min(0).max(100).optional()
});

async function evaluateAlerts(silo, reading) {
  const t = silo.thresholds || {};
  const alerts = [];
  if (reading.temperature > (t.tempMax ?? 35)) {
    alerts.push({ type: 'TEMPERATURE', threshold: t.tempMax ?? 35, value: reading.temperature, message: `Temperatura alta: ${reading.temperature}°C` });
  }
  if (reading.humidity > (t.humMax ?? 70)) {
    alerts.push({ type: 'HUMIDITY', threshold: t.humMax ?? 70, value: reading.humidity, message: `Umidade alta: ${reading.humidity}%` });
  }
  if (reading.co2 > (t.co2Max ?? 2000)) {
    alerts.push({ type: 'CO2', threshold: t.co2Max ?? 2000, value: reading.co2, message: `CO₂ elevado: ${reading.co2} ppm` });
  }
  if (alerts.length) {
    await Alert.insertMany(alerts.map(a => ({ ...a, siloId: silo._id })));
  }
}

export async function list(req, res, next) {
  try {
    const { siloId, from, to, page = 1, limit = 50 } = req.query;
    const q = {};
    if (siloId) q.siloId = siloId;
    if (from || to) q.createdAt = {};
    if (from) q.createdAt.$gte = new Date(from);
    if (to) q.createdAt.$lte = new Date(to);

    const skip = (Number(page)-1) * Number(limit);
    const data = await Reading.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Reading.countDocuments(q);
    res.json({ data, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const silo = await Silo.findById(value.siloId);
    if (!silo) return res.status(404).json({ message: 'Silo não encontrado' });
    const created = await Reading.create(value);
    await evaluateAlerts(silo, value);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

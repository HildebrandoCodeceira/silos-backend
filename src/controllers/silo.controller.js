import Joi from 'joi';
import Silo from '../models/Silo.js';

const createSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().allow('', null),
  capacityTons: Joi.number().min(0).default(0),
  thresholds: Joi.object({
    tempMax: Joi.number().min(0),
    humMax: Joi.number().min(0),
    co2Max: Joi.number().min(0)
  }).optional()
});

export async function list(req, res, next) {
  try {
    const items = await Silo.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
}

export async function getOne(req, res, next) {
  try {
    const item = await Silo.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Silo não encontrado' });
    res.json(item);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const created = await Silo.create(value);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const { value, error } = createSchema.min(1).validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const updated = await Silo.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: 'Silo não encontrado' });
    res.json(updated);
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const deleted = await Silo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Silo não encontrado' });
    res.json({ message: 'Silo removido' });
  } catch (e) { next(e); }
}

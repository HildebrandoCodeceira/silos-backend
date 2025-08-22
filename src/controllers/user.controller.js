import Joi from 'joi';
import User from '../models/User.js';

const userSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('admin', 'operator')
});

export async function me(req, res, next) {
  res.json(req.user);
}

export async function list(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { next(e); }
}

export async function create(req, res, next) {
  try {
    const { value, error } = userSchema.fork(['name','email','password'], (f)=>f.required()).validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(409).json({ message: 'E-mail já cadastrado' });
    const user = await User.create(value);
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

export async function update(req, res, next) {
  try {
    const { value, error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    Object.assign(user, value);
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { next(e); }
}

export async function remove(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ message: 'Usuário removido' });
  } catch (e) { next(e); }
}

import Alert from '../models/Alert.js';

export async function list(req, res, next) {
  try {
    const { status, type, siloId, page = 1, limit = 50 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (type) q.type = type;
    if (siloId) q.siloId = siloId;

    const skip = (Number(page)-1) * Number(limit);
    const data = await Alert.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Alert.countDocuments(q);
    res.json({ data, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
  } catch (e) { next(e); }
}

export async function resolve(req, res, next) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alerta não encontrado' });
    if (alert.status === 'RESOLVED') return res.json(alert);
    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date();
    await alert.save();
    res.json(alert);
  } catch (e) { next(e); }
}

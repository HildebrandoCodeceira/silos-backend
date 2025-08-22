import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function auth(requiredRole = null) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Token ausente' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');
      if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Sem permissão' });
      }
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
}

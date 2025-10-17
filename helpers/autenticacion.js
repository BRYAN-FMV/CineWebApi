import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../schemas/usuarios.js';
dotenv.config();

export function generarToken(usuario) {
  return jwt.sign({ id: usuario._id, nombre: usuario.nombre }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

export async function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No autenticado' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Usuario.findById(payload.id).select('-clave');
    if (!user) return res.status(401).json({ error: 'No autenticado' });

    req.usuario = user;
    return next();
  } catch (err) {
    console.error('auth error:', err.message);
    return res.status(401).json({ error: 'No autenticado' });
  }
}
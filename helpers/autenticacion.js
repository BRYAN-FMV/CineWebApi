import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export function generarToken(usuario) {
    return jwt.sign(
        { id: usuario._id, nombre: usuario.nombre },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

export function verificarToken(res, req, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No se proporcionó token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ error: 'Token inválido' });
    }

    req.usuario = decoded;
    next();
}
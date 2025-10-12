import Usuario from '../schemas/usuarios.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generarToken } from '../helpers/autenticacion.js';

class UsuarioController {
  constructor() {}

  async registerUsuario(req, res) {
    try {
      const { nombre, email, clave } = req.body;
      const userExists = await Usuario.findOne({ email });

      if (userExists) {
        return res.status(409).json({ error: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(clave, 10);

      const newUsuario = await Usuario.create({
        nombre,
        email,
        clave: hashedPassword,
      });

      res.status(201).json(newUsuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
  async loginUsuario(req, res) {
    const { nombre, clave } = req.body;
    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(clave, usuario.clave);

    if (!isMatch) {
      return res.status(401).json({ error: 'Clave incorrecta' });
    
    }
    const token = generarToken({ _id: usuario._id, nombre: usuario.nombre });
    res.status(200).json({ message: 'Login exitoso', token });
  }
}

export default new UsuarioController();


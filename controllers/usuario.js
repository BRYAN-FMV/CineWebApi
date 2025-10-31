import Usuario from '../schemas/usuarios.js';
import bcrypt from 'bcryptjs';
import { generarToken } from '../helpers/autenticacion.js';

class UsuarioController {
  constructor() {}

  async registerUsuario(req, res) {
    try {
      // Aceptar tanto name como nombre para compatibilidad con el frontend
      const nombre = req.body.nombre || req.body.name;
      const { email } = req.body;
      const clave = req.body.clave || req.body.password;

      if (!nombre || !email || !clave) {
        return res.status(400).json({ error: 'nombre, email y contraseña son requeridos' });
      }

      // comprobar existencia por email o nombre
      const userExists = await Usuario.findOne({ $or: [{ email }, { nombre }] });
      if (userExists) {
        return res.status(409).json({ error: 'El nombre o el email ya están en uso' });
      }

      const hashedPassword = await bcrypt.hash(clave, 10);

      const newUsuario = await Usuario.create({
        nombre,
        email,
        clave: hashedPassword,
      });

      const userObj = newUsuario.toObject();
      delete userObj.clave; // no devolver la contraseña ni siquiera hasheada

      // generar token para facilitar login inmediato desde el frontend
      const token = generarToken({ _id: newUsuario._id, nombre: newUsuario.nombre });

      // devolver ambos nombres de campo para compatibilidad con distintos frontends
      res.status(201).json({ usuario: userObj, user: userObj, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }

  async loginUsuario(req, res) {
    try {
      const { email, nombre } = req.body;
      const clave = req.body.clave || req.body.password;

      if ((!email && !nombre) || !clave) {
        return res.status(400).json({ error: 'email o nombre y clave son requeridos' });
      }

      const usuario = email ? await Usuario.findOne({ email }) : await Usuario.findOne({ nombre });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(clave, usuario.clave);
      if (!isMatch) {
        return res.status(401).json({ error: 'Clave incorrecta' });
      }

      const token = generarToken({ _id: usuario._id, nombre: usuario.nombre });
      const userObj = usuario.toObject();
      delete userObj.clave;

      // devolver ambos campos para compatibilidad con frontends que esperan 'user' o 'usuario'
      res.status(200).json({ message: 'Login exitoso', token, usuario: userObj, user: userObj });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al realizar login' });
    }
  }
}

export default new UsuarioController();


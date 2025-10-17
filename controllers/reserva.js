import mongoose from 'mongoose';
import reservaModel from '../model/reserva.js';
import Funcion from '../schemas/funcion.js';
import Asiento from '../schemas/asientos.js';
import Usuario from '../schemas/usuarios.js';

class ReservaController {
  // Crear reserva: intenta marcar asiento 'reservado' y crear documento de reserva
  async create(req, res) {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

      const { funcion, asientoId, minutos = 15 } = req.body;
      if (!mongoose.Types.ObjectId.isValid(funcion) || !mongoose.Types.ObjectId.isValid(asientoId)) {
        return res.status(400).json({ error: 'IDs inválidos' });
      }

      const funcionDoc = await Funcion.findById(funcion).select('sala');
      if (!funcionDoc) return res.status(404).json({ error: 'Función no encontrada' });

      // intentar marcar asiento como reservado solo si pertenece a la misma sala y está disponible
      const marcado = await Asiento.findOneAndUpdate(
        { _id: asientoId, salaId: funcionDoc.sala, estado: 'disponible' },
        { $set: { estado: 'reservado' } },
        { new: true }
      );

      if (!marcado) return res.status(409).json({ error: 'Asiento no disponible' });

      const expiracion = new Date(Date.now() + minutos * 60 * 1000);
      try {
        const reserva = await reservaModel.createReserva({
          funcion,
          asientoId,
          usuarioId,
          expiracion
        });
        return res.status(201).json(reserva);
      } catch (err) {
        // rollback: liberar asiento si la creación de reserva falla (p. ej. duplicado)
        await Asiento.findByIdAndUpdate(asientoId, { $set: { estado: 'disponible' } });
        if (err.code === 11000) return res.status(409).json({ error: 'Reserva ya existente' });
        throw err;
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Cancelar reserva: sólo el dueño (o admin si lo implementas) puede cancelar
  async cancel(req, res) {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const reserva = await reservaModel.getReservaById(id);
      if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

      // verificar propietario
      if (reserva.usuarioId.toString() !== usuarioId.toString()) {
        return res.status(403).json({ error: 'No autorizado para cancelar esta reserva' });
      }

      await reservaModel.deleteReserva(id);
      // liberar asiento (silencioso si ya fue liberado por TTL/job)
      await Asiento.findByIdAndUpdate(reserva.asientoId, { $set: { estado: 'disponible' } });

      return res.status(200).json({ message: 'Reserva cancelada' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // opcional: listar reservas del usuario
  async listByUser(req, res) {
    try {
      const usuarioId = req.usuario?.id;
      if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });

      const list = await reservaModel.findByUsuario(usuarioId);
      return res.status(200).json(list);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new ReservaController();
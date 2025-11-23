import mongoose from 'mongoose';
import ventaDetModel from '../model/ventaDet.js';
import Funcion from '../schemas/funcion.js';
import Asiento from '../schemas/asientos.js';
import reservaModel from '../model/reserva.js';

class VentaDetController {
  // Crear detalle (entrada o producto)
  async create(req, res) {
    try {
      const usuarioId = req.usuario?.id; // viene del middleware de auth
      const { ventaEnc, tipo, funcion, asientoId, producto, precio, total, cantidad } = req.body;

      if (!ventaEnc || !mongoose.Types.ObjectId.isValid(ventaEnc)) {
        return res.status(400).json({ error: 'ventaEnc inválida' });
      }
      if (!tipo) return res.status(400).json({ error: 'tipo requerido' });

      // Si es entrada validar funcion y asiento y ocupar asiento (usando reserva si existe)
      if (tipo === 'entrada') {
        if (!funcion || !mongoose.Types.ObjectId.isValid(funcion)) {
          return res.status(400).json({ error: 'funcion inválida' });
        }
        if (!asientoId || !mongoose.Types.ObjectId.isValid(asientoId)) {
          return res.status(400).json({ error: 'asientoId inválido' });
        }

        const funcionDoc = await Funcion.findById(funcion).select('sala');
        if (!funcionDoc) return res.status(404).json({ error: 'Función no encontrada' });

        // Si la función ya terminó, liberar asientos y rechazar venta
        if (funcionDoc.horario < new Date()) {
            // Liberar asientos ocupados de esta función
            const detalles = await ventaDetModel.findByFuncion(funcion);
            for (const det of detalles) {
                if (det.asientoId && det.tipo === 'entrada') {
                    await Asiento.findByIdAndUpdate(det.asientoId, { $set: { estado: 'disponible' } });
                }
            }
            return res.status(400).json({ error: 'La función ya terminó, asientos liberados' });
        }

        // Verificar si existe reserva previa para esta funcion+asiento
        const reserva = await reservaModel.findByFuncionAndAsiento(funcion, asientoId);

        if (reserva) {
          // si hay reserva y no hay usuario autenticado o no es del mismo usuario -> conflict
          if (!usuarioId || reserva.usuarioId.toString() !== usuarioId.toString()) {
            return res.status(409).json({ error: 'Asiento reservado por otro usuario' });
          }

          // reclamar reserva: marcar asiento ocupado y eliminar reserva
          const marcado = await Asiento.findByIdAndUpdate(asientoId, { $set: { estado: 'ocupado' } }, { new: true });
          if (!marcado) {
            return res.status(409).json({ error: 'No se pudo ocupar el asiento (estado inesperado)' });
          }

          // eliminar la reserva (si falla la creación del detalle haremos rollback)
          try {
            await reservaModel.deleteReserva(reserva._id);
          } catch (err) {
            // si no se puede eliminar reserva, revertimos el asiento y fallamos
            await Asiento.findByIdAndUpdate(asientoId, { $set: { estado: 'disponible' } });
            throw err;
          }

          // crear detalle
          try {
            const detalle = await ventaDetModel.createVentaDet({
              ventaEnc,
              tipo,
              funcion,
              asientoId,
              precio,
              total,
              producto,
              cantidad
            });
            return res.status(201).json(detalle);
          } catch (err) {
            // rollback: liberar asiento y (opcional) recrear reserva -> simplificamos liberando asiento
            await Asiento.findByIdAndUpdate(asientoId, { $set: { estado: 'disponible' } });
            throw err;
          }
        } else {
          // No hay reserva: intentar ocupar asiento atómicamente (solo si está disponible y pertenece a la sala)
          const asiento = await Asiento.findById(asientoId);
          if (!asiento) {
            return res.status(404).json({ error: 'Asiento no encontrado' });
          }
          if (asiento.estado !== 'disponible') {
            return res.status(409).json({ error: `Asiento en estado: ${asiento.estado}` });
          }
          if (asiento.salaId.toString() !== funcionDoc.sala.toString()) {
            return res.status(400).json({ error: 'Asiento no pertenece a la sala de la función' });
          }

          const ocupado = await Asiento.findOneAndUpdate(
            { _id: asientoId, salaId: funcionDoc.sala, estado: 'disponible' },
            { $set: { estado: 'ocupado' } },
            { new: true }
          );

          if (!ocupado) {
            return res.status(409).json({ error: 'Asiento no disponible (posible concurrencia)' });
          }

          // crear detalle; si falla, liberar asiento
          try {
            const detalle = await ventaDetModel.createVentaDet({
              ventaEnc,
              tipo,
              funcion,
              asientoId,
              precio,
              total,
              producto,
              cantidad
            });
            return res.status(201).json(detalle);
          } catch (err) {
            await Asiento.findByIdAndUpdate(asientoId, { $set: { estado: 'disponible' } });
            throw err;
          }
        }
      }

      // Si no es entrada, sólo crear el detalle
      const detalle = await ventaDetModel.createVentaDet({
        ventaEnc,
        tipo,
        funcion,
        asientoId,
        precio,
        total,
        producto,
        cantidad
      });
      return res.status(201).json(detalle);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Obtener todos
  async getAll(req, res) {
    try {
      const list = await ventaDetModel.getAllVentaDet();
      return res.status(200).json(list);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Obtener por id
  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const doc = await ventaDetModel.getVentaDetById(id);
      if (!doc) return res.status(404).json({ error: 'Detalle no encontrado' });
      return res.status(200).json(doc);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Actualizar detalle
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const existing = await ventaDetModel.getVentaDetById(id);
      if (!existing) return res.status(404).json({ error: 'Detalle no encontrado' });

      // Si es entrada y cambia asiento, intentar ocupar nuevo y liberar anterior
      if (existing.tipo === 'entrada' || updates.tipo === 'entrada') {
        const newAsientoId = updates.asientoId ?? existing.asientoId;
        const funcionId = updates.funcion ?? existing.funcion;

        if (!mongoose.Types.ObjectId.isValid(funcionId) || !mongoose.Types.ObjectId.isValid(newAsientoId)) {
          return res.status(400).json({ error: 'funcion o asientoId inválidos' });
        }

        const funcionDoc = await Funcion.findById(funcionId).select('sala');
        if (!funcionDoc) return res.status(404).json({ error: 'Función no encontrada' });

        // Si asiento cambia
        if (!existing.asientoId || existing.asientoId.toString() !== newAsientoId.toString()) {
          // intentar ocupar nuevo asiento
          const ocupado = await Asiento.findOneAndUpdate(
            { _id: newAsientoId, salaId: funcionDoc.sala, estado: 'disponible' },
            { $set: { estado: 'ocupado' } },
            { new: true }
          );
          if (!ocupado) return res.status(409).json({ error: 'Nuevo asiento no disponible' });

          // liberar previo asiento (si existía)
          if (existing.asientoId) {
            await Asiento.findByIdAndUpdate(existing.asientoId, { $set: { estado: 'disponible' } });
          }
        }
      }

      const updated = await ventaDetModel.updateVentaDet(id, updates);
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Eliminar detalle y liberar asiento si aplica
  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

      const existing = await ventaDetModel.getVentaDetById(id);
      if (!existing) return res.status(404).json({ error: 'Detalle no encontrado' });

      // si era una entrada, liberar asiento
      if (existing.tipo === 'entrada' && existing.asientoId) {
        await Asiento.findByIdAndUpdate(existing.asientoId, { $set: { estado: 'disponible' } });
      }

      await ventaDetModel.deleteVentaDet(id);
      return res.status(200).json({ message: 'Detalle eliminado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new VentaDetController();
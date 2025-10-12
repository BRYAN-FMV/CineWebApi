import mongoose from 'mongoose';
import Asiento from '../schemas/asientos.js';
import Sala from '../schemas/sala.js';

class asientoController {
    // Obtener todos los asientos (con sala poblada)
    async obtenerAsientos(req, res) {
        try {
            const asientos = await Asiento.find().populate('sala');
            res.status(200).json(asientos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener un asiento por ID (con sala poblada)
    async obtenerAsientoPorId(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

            const asiento = await Asiento.findById(id).populate('sala');
            if (!asiento) return res.status(404).json({ error: "Asiento no encontrado" });

            res.status(200).json(asiento);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Crear un asiento (valida que la sala exista)
    async crearAsiento(req, res) {
        try {
            const { sala: salaId, ...rest } = req.body;

            if (!salaId || !mongoose.Types.ObjectId.isValid(salaId)) {
                return res.status(400).json({ error: 'Se requiere una sala válida (ObjectId)' });
            }

            const salaExists = await Sala.findById(salaId);
            if (!salaExists) return res.status(400).json({ error: 'La sala indicada no existe' });

            const nuevoAsiento = await Asiento.create({ sala: salaId, ...rest });
            const populated = await Asiento.findById(nuevoAsiento._id).populate('sala');

            res.status(201).json(populated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Actualizar asiento (si cambia la sala, validar existencia)
    async actualizarAsiento(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

            if (updates.sala) {
                if (!mongoose.Types.ObjectId.isValid(updates.sala)) {
                    return res.status(400).json({ error: 'Sala inválida' });
                }
                const salaExists = await Sala.findById(updates.sala);
                if (!salaExists) return res.status(400).json({ error: 'La sala indicada no existe' });
            }

            const asientoActualizado = await Asiento.findByIdAndUpdate(id, updates, { new: true }).populate('sala');
            if (!asientoActualizado) return res.status(404).json({ error: "Asiento no encontrado" });

            res.status(200).json(asientoActualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Eliminar asiento
    async eliminarAsiento(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

            const asientoEliminado = await Asiento.findByIdAndDelete(id);
            if (!asientoEliminado) return res.status(404).json({ error: "Asiento no encontrado" });

            res.status(200).json({ message: "Asiento eliminado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default new asientoController();

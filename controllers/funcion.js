import Funcion from '../schemas/funcion.js';
import Pelicula from '../schemas/peliculas.js';
import Sala from '../schemas/sala.js';

class funcionController {
    // Crear una nueva funcion
    async create(req, res) {
        try {
            const { pelicula, sala, horario, idioma } = req.body;

            // Validar existencia de referencias
            const pel = await Pelicula.findById(pelicula);
            if (!pel) return res.status(400).json({ error: 'Pelicula no existe' });

            const sal = await Sala.findById(sala);
            if (!sal) return res.status(400).json({ error: 'Sala no existe' });

            const nueva = await Funcion.create({ pelicula, sala, horario, idioma });
            const populated = await Funcion.findById(nueva._id).populate('pelicula sala');

            res.status(201).json(populated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la función' });
        }
    }

    // Obtener todas las funciones
    async getAll(req, res) {
        try {
            const data = await Funcion.find().populate('pelicula sala');
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las funciones' });
        }
    }

    // Obtener una funcion por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await Funcion.findById(id).populate('pelicula sala');
            if (!data) return res.status(404).json({ error: 'Función no encontrada' });
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la función' });
        }
    }

    // Actualizar una funcion
    async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Si vienen referencias nuevas, validar existencia
            if (updates.pelicula) {
                const pel = await Pelicula.findById(updates.pelicula);
                if (!pel) return res.status(400).json({ error: 'Pelicula no existe' });
            }
            if (updates.sala) {
                const sal = await Sala.findById(updates.sala);
                if (!sal) return res.status(400).json({ error: 'Sala no existe' });
            }

            const data = await Funcion.findByIdAndUpdate(id, updates, { new: true }).populate('pelicula sala');
            if (!data) return res.status(404).json({ error: 'Función no encontrada' });
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la función' });
        }
    }

    // Eliminar una funcion
    async delete(req, res) {
        try {
            const { id } = req.params;
            const data = await Funcion.findByIdAndDelete(id);
            if (!data) return res.status(404).json({ error: 'Función no encontrada' });
            res.status(200).json({ message: 'Función eliminada', data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la función' });
        }
    }
}

export default new funcionController();
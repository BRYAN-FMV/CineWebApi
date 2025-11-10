import funcionModel from '../model/funcion.js';
import Funcion from '../schemas/funcion.js';
import Asiento from '../schemas/asientos.js';
import VentaDet from '../schemas/ventaDet.js';
import Reserva from '../schemas/reserva.js';
import mongoose from 'mongoose';

class FuncionController {
  // Crear función
  async create(req, res) {
    try {
      const { pelicula, sala, horario, precio, idioma } = req.body;
      
      // Validar campos obligatorios
      if (!pelicula || !sala || !horario || !precio || !idioma) {
        return res.status(400).json({ 
          error: 'Todos los campos son obligatorios: pelicula, sala, horario, precio, idioma' 
        });
      }
      
      const created = await funcionModel.create(req.body);
      return res.status(201).json(created);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Obtener todas las funciones con filtros
  async getAll(req, res) {
    try {
      const { pelicula, sala, fecha, disponibles } = req.query;
      let filter = {};
      
      // Filtro por película
      if (pelicula) {
        if (!mongoose.Types.ObjectId.isValid(pelicula)) {
          return res.status(400).json({ error: 'ID de película inválido' });
        }
        filter.pelicula = pelicula;
      }
      
      // Filtro por sala
      if (sala) {
        if (!mongoose.Types.ObjectId.isValid(sala)) {
          return res.status(400).json({ error: 'ID de sala inválido' });
        }
        filter.sala = sala;
      }
      
      // Filtro por fecha
      if (fecha) {
        const fechaInicio = new Date(fecha);
        const fechaFin = new Date(fecha);
        fechaFin.setDate(fechaFin.getDate() + 1);
        filter.horario = { $gte: fechaInicio, $lt: fechaFin };
      }
      
      // Solo funciones futuras
      if (disponibles === 'true') {
        filter.horario = { $gte: new Date() };
      }
      
      const funciones = await funcionModel.getAll(filter);
      return res.status(200).json(funciones);
      
    } catch (error) {
      console.error('Error en getFunciones:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Obtener función por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de función inválido' });
      }
      
      const funcion = await funcionModel.getById(id);
      
      if (!funcion) {
        return res.status(404).json({ error: 'Función no encontrada' });
      }
      
      return res.status(200).json(funcion);
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Obtener mapa de asientos para una función específica
  async obtenerMapaAsientos(req, res) {
    try {
      const { id } = req.params; // funcionId
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de función inválido' });
      }

      // Obtener función con sala y película pobladas
      const funcion = await Funcion.findById(id).populate('sala pelicula');
      if (!funcion) {
        return res.status(404).json({ error: 'Función no encontrada' });
      }

      // Obtener todos los asientos de la sala
      const asientosSala = await Asiento.find({ salaId: funcion.sala._id })
        .sort({ fila: 1, numero: 1 });

      // Asientos ya vendidos para ESTA función específica
      const vendidos = await VentaDet.find({ 
        funcion: id,
        tipo: 'entrada' 
      }).distinct('asientoId');

      // Reservas activas para ESTA función
      const reservados = await Reserva.find({ 
        funcion: id,
        expiracion: { $gt: new Date() }
      }).distinct('asientoId');

      // Marcar estado de cada asiento para esta función
      const mapaAsientos = asientosSala.map(asiento => {
        let estadoFuncion = 'disponible';
        
        if (vendidos.some(v => v.toString() === asiento._id.toString())) {
          estadoFuncion = 'vendido';
        } else if (reservados.some(r => r.toString() === asiento._id.toString())) {
          estadoFuncion = 'reservado';
        }

        return {
          _id: asiento._id,
          fila: asiento.fila,
          numero: asiento.numero,
          codigo: asiento.codigo,
          estadoFuncion,
          salaId: asiento.salaId
        };
      });

      // Agrupar por fila para facilitar el renderizado
      const asientosPorFila = mapaAsientos.reduce((acc, asiento) => {
        if (!acc[asiento.fila]) {
          acc[asiento.fila] = [];
        }
        acc[asiento.fila].push(asiento);
        return acc;
      }, {});

      return res.status(200).json({
        funcion: {
          _id: funcion._id,
          pelicula: funcion.pelicula,
          sala: funcion.sala,
          horario: funcion.horario,
          idioma: funcion.idioma,
          precio: funcion.precio
        },
        mapa: asientosPorFila,
        resumen: {
          total: asientosSala.length,
          disponibles: mapaAsientos.filter(a => a.estadoFuncion === 'disponible').length,
          reservados: mapaAsientos.filter(a => a.estadoFuncion === 'reservado').length,
          vendidos: mapaAsientos.filter(a => a.estadoFuncion === 'vendido').length
        }
      });

    } catch (error) {
      console.error('Error al obtener mapa de asientos:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // Actualizar función
  async update(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de función inválido' });
      }
      
      const updated = await funcionModel.update(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ error: 'Función no encontrada' });
      }
      
      return res.status(200).json(updated);
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Eliminar función
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de función inválido' });
      }
      
      // Verificar si tiene ventas asociadas
      const tieneVentas = await VentaDet.findOne({ funcion: id });
      if (tieneVentas) {
        return res.status(400).json({ 
          error: 'No se puede eliminar función con ventas asociadas' 
        });
      }
      
      const deleted = await funcionModel.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Función no encontrada' });
      }
      
      return res.status(200).json({ message: 'Función eliminada exitosamente' });
      
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new FuncionController();
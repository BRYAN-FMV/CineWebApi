import salaModel from '../model/sala.js';

class salaController {
    constructor() { 
    }

    // Controlador para obtener todas las salas
    async getAllSalas(req, res) {
        try {
            const data = await salaModel.getAllSalas();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las salas' });
        }
    }
    // Controlador para obtener una sala por ID
    async getSalaById(req, res) {
        try {
            const { id } = req.params;  
            const data = await salaModel.getSalaById(id);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener la sala' });
        }
    }
    // Controlador para crear una nueva sala
    async addSala(req, res) {
        try {
            const data = await salaModel.createSala(req.body);
            res.status(201).json(data);
        } catch (error) {
            console.error(error); // <-- Agrega este log
            res.status(500).json({ error: 'Error al crear la sala' });
        }
    }
    // Controlador para actualizar una sala
    async updateSala(req, res) {
        try {
            const { id } = req.params;
            const data = await salaModel.updateSala(id, req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la sala' });
        }
    }
    // Controlador para eliminar una sala
    async deleteSala(req, res) {
        try {   
            const { id } = req.params;
            const data = await salaModel.deleteSala(id);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la sala' });
        }   
    }
}

export default new salaController();
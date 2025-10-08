import peliculaModel from '../model/peliculas.js';

class peliculasController {
    constructor() {

    }
    // Controlador para obtener todas las películas
    async getAllPeliculas(req, res) {
        try {
            const data = await peliculaModel.getAllPeliculas();
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las películas' });
        }
    }
    // Controlador para obtener una película por ID
    async getPeliculaById(req, res) {
        try {
            const { id } = req.params;
            const data = await peliculaModel.getPeliculaById(id);
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la película' });
        }
    }
    // Controlador para crear una nueva película
    async addPelicula(req, res) {
        try {
            const data = peliculaModel.createPelicula(req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la película' });
        }
    }
    // Controlador para actualizar una película
    async updatePelicula(req, res) {
        try {
            const { id } = req.params;
            const data = await peliculaModel.updatePelicula(id, req.body);
            res.status(201).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la película' });
        }
    }

    // Controlador para eliminar una película
    async deletePelicula(req, res) {
        try {
            const { id } = req.params;
            const data = await peliculaModel.deletePelicula(id);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la película' });
        }
    }
}

export default new peliculasController();
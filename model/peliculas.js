import Peliculas from "../schemas/peliculas.js";

class peliculasModel {
    async createPelicula(data) {
        return await Peliculas.create(data);
    }

    async getAllPeliculas() {
        return await Peliculas.find();
    }

    async getPeliculaById(id) {
        return await Peliculas.findOne({ _id: id });
    }   

    async updatePelicula(id, data) {
        return await Peliculas.findOneAndUpdate({ _id: id }, data, { new: true });
    }

    async deletePelicula(id) {
        return await Peliculas.findOneAndDelete({ _id: id });     
    }
}

export default new peliculasModel();
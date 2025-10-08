import Sala from '../schemas/sala.js';

class salaModel {
    
    //Metodo para crear salas
    async createSala(data) {
        return await Sala.create(data);
    }   

    //Metodo para obtener todas las salas
    async getAllSalas() {
        return await Sala.find();
    }  
    
    //Metodo para obtener una sala por ID
    async getSalaById(id) {
        return await Sala.findOne({_id: id});
    }   

    //Metodo para eliminar una sala
    async deleteSala(id) {
        return await Sala.findOneAndDelete({ _id: id });     
    }

    //Metodo para actualizar una sala
    async updateSala(id, data) {
        return await Sala.findOneAndUpdate({ _id: id }, data, { new: true });
    }
}         

export default new salaModel();
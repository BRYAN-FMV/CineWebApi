import Reserva from '../schemas/reserva.js';

class ReservaModel {
  async createReserva(data) {
    return await Reserva.create(data);
  }

  async getReservaById(id) {
    return await Reserva.findById(id);
  }

  async deleteReserva(id) {
    return await Reserva.findByIdAndDelete(id);
  }

  async findByFuncionAndAsiento(funcionId, asientoId) {
    return await Reserva.findOne({ funcion: funcionId, asientoId });
  }

  async findByUsuario(usuarioId) {
    return await Reserva.find({ usuarioId });
  }
}

export default new ReservaModel();
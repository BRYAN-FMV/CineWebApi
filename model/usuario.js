import mongoose from "mongoose";
import Usuario from "../schemas/usuarios";

class UsuarioModel {
async createUsuario(data) {
    const usuario = new Usuario(data);
    return await usuario.save();
  }

  async getUsuarioById(id) {
    return await Usuario.findById(id);
  }
  async getAllUsuarios() {
    return await Usuario.find();
  }
  async getOneUsuario(filter) {
    return await Usuario.findOne(filter);
  }

  async updateUsuario(id, data) {
    return await Usuario.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
  }
}

export default UsuarioModel;
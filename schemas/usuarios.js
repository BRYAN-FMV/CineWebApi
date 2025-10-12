import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  clave: { type: String, required: true, trim: true }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;

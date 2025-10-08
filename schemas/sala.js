import mongoose from "mongoose";

const generoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    capacidad: { type: Number, required: true }
},{ timestamps: true }
);  

export default mongoose.model('Genero', generoSchema);
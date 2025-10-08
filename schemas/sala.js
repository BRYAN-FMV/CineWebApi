import mongoose from "mongoose";

const salaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    capacidad: { type: Number, required: true }
},{ timestamps: true }
);  

export default mongoose.model('Sala', salaSchema);
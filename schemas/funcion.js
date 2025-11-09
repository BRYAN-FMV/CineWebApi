import mongoose from "mongoose";

const funcionSchema = new mongoose.Schema({
    pelicula: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true },
    sala: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
    horario: { type: Date, required: true },
    precio: { type: Number, required: true },
    idioma: { type: String, required: true },
},{ timestamps: true }
);  

export default mongoose.model('Funcion', funcionSchema);
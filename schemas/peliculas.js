import mongoose from "mongoose";
import 'dotenv/config';

const peliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    director: { type: String, required: true },
    genero: { type: String, required: true },
    sinopsis: { type: String, required: true },
    duracion: { type: Number, required: true },
    clasificacion: { type: String, required: true }
},{ timestamps: true }
);

export default mongoose.model('Pelicula', peliculaSchema);
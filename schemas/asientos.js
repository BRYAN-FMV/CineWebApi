import mongoose from "mongoose";

const asientoSchema = new mongoose.Schema({
  fila: { type: String, required: true },
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
  numero: { type: Number, required: true },
  estado: { type: String, required: true, enum: ['disponible', 'reservado', 'ocupado'], default: 'disponible' },
}, { timestamps: true }
);

const Asiento = mongoose.model("Asiento", asientoSchema);

export default Asiento;
import mongoose from 'mongoose';

const asientoSchema = new mongoose.Schema({
  fila: { type: String, required: true, trim: true },
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
  numero: { type: Number, required: true },
  estado: { type: String, enum: ['disponible', 'reservado', 'ocupado'], default: 'disponible' },
  codigo: { type: String } // opcional: solo crear índice único cuando exista
}, { timestamps: true });

// índice único parcial: solo se aplica cuando `codigo` existe y no es null
asientoSchema.index(
  { codigo: 1 },
  { unique: true, partialFilterExpression: { codigo: { $exists: true, $ne: null } } }
);

export default mongoose.model('Asiento', asientoSchema);
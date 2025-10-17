import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  funcion: { type: mongoose.Schema.Types.ObjectId, ref: 'Funcion', required: true },
  asientoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asiento', required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  expiracion: { type: Date, required: true }
}, { timestamps: true });

// evitar duplicados para la misma funcion+asiento
reservaSchema.index({ funcion: 1, asientoId: 1 }, { unique: true });

// TTL: eliminar doc cuando expiracion < now
reservaSchema.index({ expiracion: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Reserva', reservaSchema);
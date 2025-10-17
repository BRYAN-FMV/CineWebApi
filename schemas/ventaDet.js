import mongoose from "mongoose";

const ventaDetSchema = new mongoose.Schema({
  ventaEnc: { type: mongoose.Schema.Types.ObjectId, ref: 'VentaEnc', required: true },
  tipo: { type: String, required: true, enum: ['entrada', 'producto'] },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: false },
  funcion: { type: mongoose.Schema.Types.ObjectId, ref: 'Funcion', required: false },
  asientoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asiento', required: false },
  precio: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true });

ventaDetSchema.index({ ventaEnc: 1 });
export default mongoose.model('VentaDet', ventaDetSchema);  
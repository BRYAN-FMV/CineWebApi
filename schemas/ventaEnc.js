import mongoose from "mongoose";

const ventaEncSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, default: Date.now },
  total: { type: Number, required: false }
}, { timestamps: true }
);

const VentaEnc = mongoose.model("VentaEnc", ventaEncSchema);
export default VentaEnc;

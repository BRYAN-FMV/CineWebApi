import mongoose from 'mongoose';
import ventaEnc from '../model/ventaEnc.js';

class VentaEncController {
    async createVentaEnc(req, res) {
        try {
            const usuarioId = req.usuario?.id;
            if (!usuarioId) return res.status(401).json({ error: 'No autenticado' });
            if (!mongoose.Types.ObjectId.isValid(usuarioId)) return res.status(400).json({ error: 'Id de usuario inválido' });

            const payload = { ...req.body, usuario: usuarioId };
            const nuevaVenta = await ventaEnc.createVentaEnc(payload);
            return res.status(201).json(nuevaVenta);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async getAllVentaEnc(req, res) {
        try {
            const ventas = await ventaEnc.getAllVentaEnc();
            return res.status(200).json(ventas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async getVentaEncById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });   
            const venta = await ventaEnc.getVentaEncById(id);
            if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
            return res.status(200).json(venta);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async updateVentaEnc(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

            const updatedVenta = await ventaEnc.updateVentaEnc(id, req.body);
            if (!updatedVenta) return res.status(404).json({ error: 'Venta no encontrada' });
            return res.status(200).json(updatedVenta);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    
    }
    async deleteVentaEnc(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

            const deletedVenta = await ventaEnc.deleteVentaEnc(id);
            if (!deletedVenta) return res.status(404).json({ error: 'Venta no encontrada' });
            return res.status(200).json({ message: 'Venta eliminada con éxito' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new VentaEncController();
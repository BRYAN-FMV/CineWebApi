import express from "express";
import UsuarioController from "../controllers/usuario.js";
const router = express.Router();

router.post("/register", UsuarioController.registerUsuario);
router.post("/login", UsuarioController.loginUsuario);

export default router;

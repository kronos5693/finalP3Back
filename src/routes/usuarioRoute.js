const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/', usuarioController.crearUsuario);

// Rutas protegidas (específicas PRIMERO)
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);
router.put('/cambiar-password', verificarToken, usuarioController.cambiarPassword);
router.get('/buscar/:nombre', usuarioController.buscarUsuarioPorNombre);

// Rutas generales
router.get('/', usuarioController.obtenerUsuarios);

// Rutas con parámetros genéricos (AL FINAL)
router.put('/:id', usuarioController.editarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
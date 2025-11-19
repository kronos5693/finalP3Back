const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

//Rutas publicas
router.post('/', usuarioController.crearUsuario);


router.get('/', usuarioController.obtenerUsuarios);
router.put('/:id', usuarioController.editarUsuario);
router.get('/buscar/:nombre', usuarioController.buscarUsuarioPorNombre);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;

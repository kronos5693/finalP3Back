const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { verificarToken } = require('../middleware/authMiddleware');

router.get('/', verificarToken, carritoController.obtenerCarrito);
router.post('/agregar', verificarToken, carritoController.agregarAlCarrito);
router.put('/actualizar', verificarToken, carritoController.actualizarItem);
router.delete('/eliminar/:idSalida', verificarToken, carritoController.eliminarItem);
router.delete('/vaciar', verificarToken, carritoController.vaciarCarrito);
router.post('/checkout', verificarToken, carritoController.procesarCheckout);

module.exports = router;
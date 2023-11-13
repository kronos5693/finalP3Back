
const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

router.post('/', compraController.comprarExcursion);
router.get('/:idUsuario', compraController.obtenerComprasPorUsuario);
router.put('/editar/:idCompra', compraController.editarCompra);
router.delete('/:idCompra', compraController.eliminarCompra);

module.exports = router;

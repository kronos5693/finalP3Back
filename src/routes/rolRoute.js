const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

router.get('/', rolController.obtenerRoles);
router.post('/', rolController.crearRol);
router.put('/:id', rolController.editarRol);
router.delete('/:id', rolController.eliminarRol);

module.exports = router;

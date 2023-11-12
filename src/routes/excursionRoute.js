const express = require('express');
const router = express.Router();
const excursionController = require('../controllers/excursionController');

router.get('/', excursionController.obtenerExcursiones);
router.get('/:nombre', excursionController.obtenerExcursionPorNombre);
router.get('/id/:id', excursionController.obtenerExcursionPorId);
router.get('/provincia/:provincia', excursionController.obtenerExcursionesPorProvincia); 
router.delete('/:id', excursionController.eliminarExcursionPorId);
router.post('/', excursionController.crearExcursion);
router.put('/id/:id', excursionController.modificarExcursionPorId);
router.put('/:nombre', excursionController.modificarExcursionPorNombre);
router.get('/precio/desc', excursionController.obtenerExcursionesPorPrecioDesc); // Ruta para obtener por precio de mayor a menor
router.get('/precio/asc', excursionController.obtenerExcursionesPorPrecioAsc);  // Ruta para obtener por precio de menor a mayor
module.exports = router;

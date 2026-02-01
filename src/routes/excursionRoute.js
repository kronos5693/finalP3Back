const express = require('express');
const router = express.Router();
const excursionController = require('../controllers/excursionController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Rutas específicas primero (para evitar conflictos con :id y :nombre)
router.get('/precio/desc', excursionController.obtenerExcursionesPorPrecioDesc);
router.get('/precio/asc', excursionController.obtenerExcursionesPorPrecioAsc);
router.get('/provincia/:provincia', excursionController.obtenerExcursionesPorProvincia);

// Obtener todas las excursiones
router.get('/', excursionController.obtenerExcursiones);

// Rutas con parámetros al final
router.get('/nombre/:nombre', excursionController.obtenerExcursionPorNombre);
router.get('/:id', excursionController.obtenerExcursionPorId);

// ==========================================
// RUTAS PROTEGIDAS (solo admin)
// ==========================================

// Crear excursión
router.post('/', verificarToken, verificarRol(['admin']), excursionController.crearExcursion);

// Editar excursión
router.put('/:id', verificarToken, verificarRol(['admin']), excursionController.editarExcursion);

// Toggle habilitación
router.patch('/:id/toggle', verificarToken, verificarRol(['admin']), excursionController.toggleHabilitacion);

// Eliminar excursión
router.delete('/:id', verificarToken, verificarRol(['admin']), excursionController.eliminarExcursion);

module.exports = router;
const express = require('express');
const router = express.Router();
const salidaController = require('../controllers/salidaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PÚBLICAS
// ==========================================

// Obtener salidas (públicas con filtros)
router.get('/', salidaController.obtenerSalidas);

// Obtener salida por ID
router.get('/:id', salidaController.obtenerSalidaPorId);

// Obtener salidas por excursión
router.get('/excursion/:idExcursion', salidaController.obtenerSalidasPorExcursion);

// Verificar disponibilidad
router.get('/:id/disponibilidad', salidaController.verificarDisponibilidad);

// ==========================================
// RUTAS ADMIN (protegidas)
// ==========================================

// Crear salida (solo admin)
router.post('/', verificarToken, verificarRol(['admin']), salidaController.crearSalida);

// Editar salida (solo admin)
router.put('/:id', verificarToken, verificarRol(['admin']), salidaController.editarSalida);

// Eliminar salida (solo admin)
router.delete('/:id', verificarToken, verificarRol(['admin']), salidaController.eliminarSalida);

module.exports = router;
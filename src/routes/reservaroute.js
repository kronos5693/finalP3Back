const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');

// ==========================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ==========================================

// Crear reserva (cualquier usuario autenticado)
router.post('/', verificarToken, reservaController.crearReserva);

// Obtener mis reservas (usuario autenticado)
router.get('/mis-reservas', verificarToken, reservaController.obtenerMisReservas);

// Obtener reserva por ID
router.get('/:id', verificarToken, reservaController.obtenerReservaPorId);

// Cancelar reserva
router.put('/:id/cancelar', verificarToken, reservaController.cancelarReserva);

// ==========================================
// RUTAS ADMIN (solo administradores)
// ==========================================

// Obtener todas las reservas
router.get('/', verificarToken, verificarRol(['admin']), reservaController.obtenerTodasReservas);

// Obtener reservas por salida
router.get('/salida/:idSalida', verificarToken, verificarRol(['admin']), reservaController.obtenerReservasPorSalida);

// Completar reserva
router.put('/:id/completar', verificarToken, verificarRol(['admin']), reservaController.completarReserva);

module.exports = router;

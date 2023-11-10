// personajeRoute.js
const express = require('express');
const router = express.Router();
const personajeController = require('../controllers/personajeController');

// Rutas
router.get('/', personajeController.obtenerPersonajes);
router.post('/', personajeController.crearPersonaje);

module.exports = router;

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

// Ruta de login
router.post('/login', authController.login);

// Ruta para verificar autenticación actual
router.get('/verificar', verificarToken, authController.verificarAuth);

module.exports = router;
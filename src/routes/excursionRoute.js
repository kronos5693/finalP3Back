const express = require('express');
const router = express.Router();
const excursionController = require('../controllers/excursionController');

router.get('/', excursionController.obtenerExcursiones);
router.post('/', excursionController.crearExcursion); // Nueva ruta para crear excursiones

module.exports = router;

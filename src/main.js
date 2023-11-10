const express = require('express');
const connectDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoute');
const excursionesRoutes = require('./routes/excursionRoute');
const personajeRoutes= require('./routes/personajeRoute')

const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');


const initDB = require('./utils/initDB');

const app = express();

// Configuración de variables de entorno
require('dotenv').config();

// Conexión a la base de datos
connectDB();
initDB();
// Middleware
app.use(express.json());

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/excursiones', excursionesRoutes);
app.use('/personajes', personajeRoutes);


// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  logger.info(`Servidor escuchando en el puerto: ${PORT}`)
);

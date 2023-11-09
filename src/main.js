const express = require('express');
const connectDB = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoute');
const errorHandler = require('./utils/errorHandler');
const { info } = require("./utils/logger");
const app = express();

// Configuración de variables de entorno
require('dotenv').config();
const logger = require("./utils/logger");
// Conexión a la base de datos
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/usuarios', usuarioRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;



app.listen(PORT, () =>
  logger.info(`Servidor escuchando en el puerto: ${PORT}`)
);



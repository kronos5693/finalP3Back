const express = require("express");
const mongoose = require("mongoose");
const { info } = require("./utils/logger");
// Permite acceder a las variables de entorno
require("dotenv").config();
const logger = require("./utils/logger");

const app = express();
// Toma por defecto un puerto u el otro si no está activo process.env.PORT busca el puerto del servidor
// donde se desplegó la app
const port = process.env.PORT || 9000;

// Conexion a MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => logger.info("Conectado a la base de datos"));

app.listen(port, () => logger.info(`Servidor escuchando en el puerto: ${port}`));

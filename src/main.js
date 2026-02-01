const express = require("express");
const connectDB = require("./config/db");
const usuarioRoutes = require("./routes/usuarioRoute");
const excursionesRoutes = require("./routes/excursionRoute");
const personajeRoutes = require("./routes/personajeRoute");
const rolRoutes = require("./routes/rolRoute");
const salidaRoutes = require("./routes/salidaRoute");
const reservaRoutes = require("./routes/reservaRoute");
const carritoRoutes = require("./routes/carritoRoute");
const authRoutes = require("./routes/authRoute");

const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const initDB = require("./utils/initDB");

const app = express();

// Configuración de variables de entorno
require("dotenv").config();

// Conexión a la base de datos
connectDB();
initDB();

// Middleware CORS
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/excursiones", excursionesRoutes);
app.use("/personajes", personajeRoutes);
app.use("/roles", rolRoutes);
app.use("/salidas", salidaRoutes);
app.use("/reservas", reservaRoutes);
app.use("/carrito", carritoRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Proxy inverso para redirigir las solicitudes al servidor de desarrollo de frontend
app.use(
    "/api",
    createProxyMiddleware({ target: "http://localhost:5173", changeOrigin: true })
);

app.listen(PORT, () => {
  logger.info(`════════════════════════════════════════`);
  logger.info(` Servidor corriendo en puerto: ${PORT}`);
  logger.info(`════════════════════════════════════════`);
});
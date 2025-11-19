const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Usar variable de entorno para el secreto
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_secreto';

const verificarToken = (req, res, next) => {
    // Obtener el token del header Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    // Extraer el token (formato: "Bearer TOKEN")
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        logger.error('Error al verificar token:', error.message);
        res.status(401).json({ mensaje: 'Token no válido o expirado.' });
    }
};

// Middleware para verificar roles
const verificarRol = (roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        if (roles.includes(req.usuario.rol)) {
            next();
        } else {
            res.status(403).json({ mensaje: 'No tienes permiso para acceder a este recurso' });
        }
    };
};

module.exports = { verificarToken, verificarRol };
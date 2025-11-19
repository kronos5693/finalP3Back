const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Configuración del JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_secreto'; // Mejor usar variable de entorno
const JWT_EXPIRES_IN = '24h';

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ email }).populate('rol');
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar la contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol?.nombre || 'usuario'
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        logger.info(`Usuario ${usuario.email} ha iniciado sesión`);

        // Responder con el token y datos básicos del usuario
        res.json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol?.nombre || 'usuario'
            }
        });
    } catch (error) {
        logger.error('Error en login:', error.message);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Verificar el estado de autenticación actual
exports.verificarAuth = async (req, res) => {
    try {
        // El middleware verificarToken ya validó el token
        // y agregó la información del usuario a req.usuario
        const usuario = await Usuario.findById(req.usuario.id).populate('rol');
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({
            autenticado: true,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol?.nombre || 'usuario'
            }
        });
    } catch (error) {
        logger.error('Error al verificar autenticación:', error.message);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};
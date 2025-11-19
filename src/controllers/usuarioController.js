const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find()
            .select('-contraseña')
            .populate('rol', 'nombre');
        res.json(usuarios);
    } catch (error) {
        logger.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña, rol } = req.body;

        if (!nombre || !apellido || !email || !contraseña) {
            return res.status(400).json({ 
                mensaje: 'Todos los campos son requeridos: nombre, apellido, email, contraseña' 
            });
        }

        if (contraseña.length < 6) {
            return res.status(400).json({ 
                mensaje: 'La contraseña debe tener al menos 6 caracteres' 
            });
        }

        const existeUsuario = await Usuario.findOne({ email: email.toLowerCase() });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        const nuevoUsuario = new Usuario({ 
            nombre, 
            apellido, 
            email, 
            contraseña, 
            rol
        });
        
        await nuevoUsuario.save();
        logger.info(`Se creó correctamente el usuario ${email} en la base`);
        
        res.status(201).json({ 
            mensaje: 'Usuario creado con éxito',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        logger.error('Error al registrar usuario en la base de datos', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                mensaje: 'Error de validación',
                errores: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};

exports.editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, contraseña } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (req.usuario && req.usuario.rol !== 'admin' && req.usuario.id !== id) {
            return res.status(403).json({ mensaje: 'No tienes permiso para editar este usuario' });
        }

        if (email && email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ email: email.toLowerCase() });
            if (existeEmail) {
                return res.status(400).json({ mensaje: 'El email ya está en uso' });
            }
        }

        if (nombre) usuario.nombre = nombre;
        if (apellido) usuario.apellido = apellido;
        if (email) usuario.email = email;
        
        if (contraseña) {
            if (contraseña.length < 6) {
                return res.status(400).json({ 
                    mensaje: 'La contraseña debe tener al menos 6 caracteres' 
                });
            }
            usuario.contraseña = contraseña;
        }

        await usuario.save();

        logger.info(`Usuario ${usuario.email} actualizado exitosamente`);

        res.json({ 
            mensaje: 'Usuario actualizado con éxito',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
            }
        });
    } catch (error) {
        logger.error('Error al editar usuario:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                mensaje: 'Error de validación',
                errores: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({ mensaje: 'Error al editar usuario' });
    }
};

exports.buscarUsuarioPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        const usuarios = await Usuario.find({ 
            nombre: new RegExp(nombre, 'i') 
        })
        .select('-contraseña')
        .populate('rol', 'nombre');
        
        res.json(usuarios);
    } catch (error) {
        logger.error('Error al buscar usuario por nombre:', error);
        res.status(500).json({ mensaje: 'Error al buscar usuario por nombre' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (req.usuario && req.usuario.id === id) {
            return res.status(400).json({ mensaje: 'No puedes eliminar tu propia cuenta' });
        }

        await Usuario.findByIdAndDelete(id);

        logger.info(`Usuario ${usuario.email} eliminado`);

        res.json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        logger.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id)
            .select('-contraseña')
            .populate('rol', 'nombre');
        
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        logger.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
};
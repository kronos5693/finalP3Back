const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, contraseña } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, contraseña });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};

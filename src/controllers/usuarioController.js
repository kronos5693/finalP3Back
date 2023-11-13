const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre,apellido, email, contraseña,roles } = req.body;

        // Verificar si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = new Usuario({ nombre,apellido, email, contraseña, roles });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};

// Editar usuario por ID
exports.editarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, contraseña } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Actualizar los campos del usuario
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.contraseña = contraseña;

        // Guardar los cambios
        await usuario.save();

        res.json({ mensaje: 'Usuario actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar usuario' });
    }
};

// Buscar usuario por nombre
exports.buscarUsuarioPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;

        // Buscar usuarios por nombre
        const usuarios = await Usuario.find({ nombre });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar usuario por nombre' });
    }
};

// Eliminar usuario por ID
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar usuario por ID
        await Usuario.findByIdAndDelete(id);

        res.json({ mensaje: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
};

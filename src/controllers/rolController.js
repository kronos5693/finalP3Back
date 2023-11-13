const Rol = require('../models/rolModel');

exports.obtenerRoles = async (req, res) => {
    try {
        const roles = await Rol.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener roles' });
    }
};

exports.crearRol = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Verificar si el rol ya existe
        const existeRol = await Rol.findOne({ nombre });
        if (existeRol) {
            return res.status(400).json({ mensaje: 'El rol ya existe' });
        }

        // Crear el nuevo rol
        const nuevoRol = new Rol({ nombre });
        await nuevoRol.save();

        res.status(201).json({ mensaje: 'Rol creado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear rol' });
    }
};

exports.editarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        // Verificar si el rol existe
        const rol = await Rol.findById(id);
        if (!rol) {
            return res.status(404).json({ mensaje: 'Rol no encontrado' });
        }

        // Actualizar el nombre del rol
        rol.nombre = nombre;
        await rol.save();

        res.json({ mensaje: 'Rol actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar rol' });
    }
};

exports.eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el rol por ID
        await Rol.findByIdAndRemove(id);

        res.json({ mensaje: 'Rol eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar rol' });
    }
};

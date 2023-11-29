const Excursion = require('../models/excursionModel');

exports.obtenerExcursiones = async (req, res) => {
    try {
        const excursiones = await Excursion.find().populate('horarios');
        res.json(excursiones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};


exports.obtenerExcursionPorNombre = async (req, res) => {
    try {
        const nombreExcursion = req.params.nombre;
        const excursion = await Excursion.findOne({ excursion: nombreExcursion });

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json(excursion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursión por nombre' });
    }
};

exports.obtenerExcursionPorId = async (req, res) => {
    try {
        const idExcursion = req.params.id;
        const excursion = await Excursion.findById(idExcursion);

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json(excursion);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursión por ID' });
    }
};

exports.obtenerExcursionesPorProvincia = async (req, res) => {
    try {
        const provincia = req.params.provincia;
        const excursiones = await Excursion.find({ provincia });

        res.json(excursiones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursiones por provincia' });
    }
};

exports.eliminarExcursionPorId = async (req, res) => {
    try {
        const idExcursion = req.params.id;
        const excursion = await Excursion.findByIdAndDelete(idExcursion);

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json({ mensaje: 'Excursión eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar excursión por ID' });
    }
};

exports.crearExcursion = async (req, res) => {
    try {
        const { excursion, provincia, localidad, descripcion, precio, img, horarios } = req.body;

        // Verificar si la excursión ya existe
        const existeExcursion = await Excursion.findOne({ excursion });
        if (existeExcursion) {
            return res.status(400).json({ mensaje: 'La excursión ya existe' });
        }

        // Crear la nueva excursión con horarios
        const nuevaExcursion = new Excursion({
            excursion,
            provincia,
            localidad,
            descripcion,
            precio,
            img,
            horarios  
        });

        await nuevaExcursion.save();

        res.status(201).json({ mensaje: 'Excursión creada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear excursión' });
    }
};



exports.modificarExcursionPorId = async (req, res) => {
    try {
        const idExcursion = req.params.id;
        const { provincia, localidad, descripcion, precio, img } = req.body;

        // Verificar si la excursión existe
        const excursion = await Excursion.findByIdAndUpdate(idExcursion, {
            provincia,
            localidad,
            descripcion,
            precio,
            img
        }, { new: true });

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json({ mensaje: 'Excursión modificada con éxito', excursion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al modificar excursión por ID' });
    }
};

exports.modificarExcursionPorNombre = async (req, res) => {
    try {
        const nombreExcursion = req.params.nombre;
        const { provincia, localidad, descripcion, precio, img } = req.body;

        // Verificar si la excursión existe
        const excursion = await Excursion.findOneAndUpdate({ excursion: nombreExcursion }, {
            provincia,
            localidad,
            descripcion,
            precio,
            img
        }, { new: true });

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json({ mensaje: 'Excursión modificada con éxito', excursion });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al modificar excursión por nombre' });
    }
};


exports.obtenerExcursionesPorPrecioDesc = async (req, res) => {
    try {
        const excursiones = await Excursion.find().sort({ precio: 'desc' });
        res.json(excursiones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursiones por precio (descendente)' });
    }
};

exports.obtenerExcursionesPorPrecioAsc = async (req, res) => {
    try {
        const excursiones = await Excursion.find().sort({ precio: 'asc' });
        res.json(excursiones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursiones por precio (ascendente)' });
    }
};

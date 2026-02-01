const Excursion = require('../models/excursionModel');
const Salida = require('../models/salidaModel');
const logger = require('../utils/logger');

exports.obtenerExcursiones = async (req, res) => {
    try {
        const { habilitadas, provincia } = req.query;

        let filtro = {};
        if (habilitadas === 'true') filtro.habilitadaPorTemporada = true;
        if (provincia) filtro.provincia = provincia;

        const excursiones = await Excursion.find(filtro).sort({ excursion: 1 });
        res.json(excursiones);
    } catch (error) {
        logger.error('Error al obtener excursiones:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};

exports.obtenerExcursionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const excursion = await Excursion.findById(id);

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json(excursion);
    } catch (error) {
        logger.error('Error al obtener excursión:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursión' });
    }
};

exports.obtenerExcursionPorNombre = async (req, res) => {
    try {
        const { nombre } = req.params;
        const excursion = await Excursion.findOne({ excursion: nombre });

        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        res.json(excursion);
    } catch (error) {
        logger.error('Error al obtener excursión:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursión' });
    }
};

exports.obtenerExcursionesPorProvincia = async (req, res) => {
    try {
        const { provincia } = req.params;
        const excursiones = await Excursion.find({ provincia });
        res.json(excursiones);
    } catch (error) {
        logger.error('Error al obtener excursiones:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};

exports.crearExcursion = async (req, res) => {
    try {
        const { excursion, provincia, localidad, descripcion, precio, img, habilitadaPorTemporada, duracion, dificultad, incluye, noIncluye, requisitos } = req.body;


        if (!excursion || !provincia || !localidad || !descripcion || !img) {
            return res.status(400).json({ mensaje: 'Todos los campos obligatorios son requeridos (excepto precio)' });
        }

        const existeExcursion = await Excursion.findOne({ excursion });
        if (existeExcursion) {
            return res.status(400).json({ mensaje: 'La excursión ya existe' });
        }

        const nuevaExcursion = new Excursion({
            excursion,
            provincia,
            localidad,
            descripcion,
            //  Precio opcional, default 0
            precio: precio || 0,
            img,
            habilitadaPorTemporada: habilitadaPorTemporada !== undefined ? habilitadaPorTemporada : true,
            duracion,
            dificultad,
            incluye,
            noIncluye,
            requisitos
        });

        await nuevaExcursion.save();
        logger.info(`Excursión creada: ${excursion}`);

        res.status(201).json({
            mensaje: 'Excursión creada con éxito',
            excursion: nuevaExcursion
        });
    } catch (error) {
        logger.error('Error al crear excursión:', error);
        res.status(500).json({ mensaje: 'Error al crear excursión' });
    }
};

exports.editarExcursion = async (req, res) => {
    try {
        const { id } = req.params;
        const { excursion, provincia, localidad, descripcion, precio, img, habilitadaPorTemporada, duracion, dificultad, incluye, noIncluye, requisitos } = req.body;

        const excursionExistente = await Excursion.findById(id);
        if (!excursionExistente) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        if (excursion) excursionExistente.excursion = excursion;
        if (provincia) excursionExistente.provincia = provincia;
        if (localidad) excursionExistente.localidad = localidad;
        if (descripcion) excursionExistente.descripcion = descripcion;
        if (precio !== undefined) excursionExistente.precio = precio;
        if (img) excursionExistente.img = img;
        if (habilitadaPorTemporada !== undefined) excursionExistente.habilitadaPorTemporada = habilitadaPorTemporada;
        if (duracion !== undefined) excursionExistente.duracion = duracion;
        if (dificultad) excursionExistente.dificultad = dificultad;
        if (incluye) excursionExistente.incluye = incluye;
        if (noIncluye) excursionExistente.noIncluye = noIncluye;
        if (requisitos) excursionExistente.requisitos = requisitos;

        await excursionExistente.save();
        logger.info(`Excursión actualizada: ${id}`);

        res.json({
            mensaje: 'Excursión actualizada con éxito',
            excursion: excursionExistente
        });
    } catch (error) {
        logger.error('Error al editar excursión:', error);
        res.status(500).json({ mensaje: 'Error al editar excursión' });
    }
};

exports.eliminarExcursion = async (req, res) => {
    try {
        const { id } = req.params;

        const salidasAsociadas = await Salida.countDocuments({ excursion: id });
        if (salidasAsociadas > 0) {
            return res.status(400).json({
                mensaje: `No se puede eliminar. Hay ${salidasAsociadas} salida(s) asociada(s)`
            });
        }

        const excursion = await Excursion.findByIdAndDelete(id);
        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        logger.info(`Excursión eliminada: ${id}`);
        res.json({ mensaje: 'Excursión eliminada con éxito' });
    } catch (error) {
        logger.error('Error al eliminar excursión:', error);
        res.status(500).json({ mensaje: 'Error al eliminar excursión' });
    }
};

exports.toggleHabilitacion = async (req, res) => {
    try {
        const { id } = req.params;

        const excursion = await Excursion.findById(id);
        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        excursion.habilitadaPorTemporada = !excursion.habilitadaPorTemporada;
        await excursion.save();

        logger.info(`Excursión ${excursion.habilitadaPorTemporada ? 'habilitada' : 'deshabilitada'}: ${id}`);

        res.json({
            mensaje: `Excursión ${excursion.habilitadaPorTemporada ? 'habilitada' : 'deshabilitada'}`,
            excursion
        });
    } catch (error) {
        logger.error('Error al cambiar habilitación:', error);
        res.status(500).json({ mensaje: 'Error al cambiar habilitación' });
    }
};

exports.obtenerExcursionesPorPrecioAsc = async (req, res) => {
    try {
        const excursiones = await Excursion.find().sort({ precio: 1 });
        res.json(excursiones);
    } catch (error) {
        logger.error('Error al obtener excursiones:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};

exports.obtenerExcursionesPorPrecioDesc = async (req, res) => {
    try {
        const excursiones = await Excursion.find().sort({ precio: -1 });
        res.json(excursiones);
    } catch (error) {
        logger.error('Error al obtener excursiones:', error);
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};
const Salida = require('../models/salidaModel');
const Excursion = require('../models/excursionModel');
const logger = require('../utils/logger');

exports.crearSalida = async (req, res) => {
    try {
        const { excursion, fecha, horario, capacidadMaxima, precioPersona, guia, observaciones } = req.body;

        logger.info('=== CREAR SALIDA ===');
        logger.info(`Fecha recibida del frontend: ${fecha}`);

        if (!excursion) {
            return res.status(400).json({ mensaje: 'La excursión es requerida' });
        }

        if (!fecha) {
            return res.status(400).json({ mensaje: 'La fecha es requerida' });
        }

        if (!horario) {
            return res.status(400).json({ mensaje: 'El horario es requerido' });
        }

        // ⭐ VALIDACIÓN ESTRICTA: precioPersona OBLIGATORIO
        if (precioPersona === undefined || precioPersona === null || precioPersona === '') {
            return res.status(400).json({
                mensaje: 'El precio por persona es obligatorio. Debe especificar un precio para esta salida.'
            });
        }

        const excursionExiste = await Excursion.findById(excursion);
        if (!excursionExiste) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        const fechaSalida = new Date(fecha + 'T12:00:00.000Z');
        logger.info(`Fecha procesada en backend: ${fechaSalida.toISOString()}`);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSalida < hoy) {
            return res.status(400).json({ mensaje: 'La fecha debe ser futura' });
        }

        const salidaExistente = await Salida.findOne({
            excursion,
            fecha: fechaSalida,
            horario
        });

        if (salidaExistente) {
            return res.status(400).json({
                mensaje: `Ya existe una salida el ${new Date(fechaSalida).toLocaleDateString('es-AR', { timeZone: 'UTC' })} a las ${horario}`
            });
        }

        const capacidadFinal = capacidadMaxima ? parseInt(capacidadMaxima) : 15;

        // ⭐ CAMBIO: No hay fallback, usamos directamente el precio enviado
        const precioFinal = parseFloat(precioPersona);

        const nuevaSalida = new Salida({
            excursion,
            fecha: fechaSalida,
            horario,
            capacidadMaxima: capacidadFinal,
            disponibilidad: capacidadFinal,
            precioPersona: precioFinal,
            guia,
            observaciones
        });

        await nuevaSalida.save();
        await nuevaSalida.populate('excursion');

        logger.info(` Salida creada exitosamente: ${nuevaSalida._id}`);

        res.status(201).json({
            mensaje: 'Salida creada con éxito',
            salida: nuevaSalida
        });

    } catch (error) {
        logger.error(' Error al crear salida:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                mensaje: 'Ya existe esta salida (duplicado en excursión, fecha y horario)'
            });
        }

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                mensaje: 'Error de validación',
                errores
            });
        }

        res.status(500).json({
            mensaje: 'Error al crear salida',
            error: error.message
        });
    }
};

exports.obtenerSalidas = async (req, res) => {
    try {
        const { futuras, habilitadas, excursion } = req.query;

        let filtro = {};

        if (futuras === 'true') {
            filtro.fecha = { $gte: new Date() };
        }

        if (habilitadas === 'true') {
            filtro.habilitada = true;
        }

        if (excursion) {
            filtro.excursion = excursion;
        }

        const salidas = await Salida.find(filtro)
            .populate('excursion')
            .sort({ fecha: 1, horario: 1 });

        res.json(salidas);

    } catch (error) {
        logger.error('Error al obtener salidas:', error);
        res.status(500).json({ mensaje: 'Error al obtener salidas' });
    }
};

exports.obtenerSalidaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const salida = await Salida.findById(id).populate('excursion');

        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        res.json(salida);

    } catch (error) {
        logger.error('Error al obtener salida:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de salida inválido' });
        }

        res.status(500).json({ mensaje: 'Error al obtener salida' });
    }
};

exports.obtenerSalidasPorExcursion = async (req, res) => {
    try {
        const { idExcursion } = req.params;
        const { futuras } = req.query;

        let filtro = { excursion: idExcursion };

        if (futuras === 'true') {
            filtro.fecha = { $gte: new Date() };
            filtro.habilitada = true;
        }

        const salidas = await Salida.find(filtro)
            .populate('excursion')
            .sort({ fecha: 1, horario: 1 });

        res.json(salidas);

    } catch (error) {
        logger.error('Error al obtener salidas por excursión:', error);
        res.status(500).json({ mensaje: 'Error al obtener salidas' });
    }
};

exports.editarSalida = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, horario, capacidadMaxima, precioPersona, habilitada, guia, observaciones } = req.body;

        const salida = await Salida.findById(id);
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        if (capacidadMaxima && capacidadMaxima < salida.capacidadMaxima) {
            const lugaresOcupados = salida.capacidadMaxima - salida.disponibilidad;
            if (capacidadMaxima < lugaresOcupados) {
                return res.status(400).json({
                    mensaje: `No se puede reducir la capacidad. Hay ${lugaresOcupados} lugares ocupados`
                });
            }
        }

        if (fecha !== undefined) {
            const fechaSalida = new Date(fecha + 'T12:00:00.000Z');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaSalida < hoy) {
                return res.status(400).json({ mensaje: 'La fecha debe ser futura' });
            }
            salida.fecha = fechaSalida;
        }

        if (horario !== undefined) salida.horario = horario;

        if (capacidadMaxima !== undefined) {
            const nuevaCapacidad = parseInt(capacidadMaxima);
            const diferencia = nuevaCapacidad - salida.capacidadMaxima;
            salida.capacidadMaxima = nuevaCapacidad;
            salida.disponibilidad += diferencia;
        }

        // ⭐ CAMBIO: Actualizar precioPersona sin fallback
        if (precioPersona !== undefined) {
            salida.precioPersona = parseFloat(precioPersona);
        }

        if (habilitada !== undefined) salida.habilitada = habilitada;
        if (guia !== undefined) salida.guia = guia;
        if (observaciones !== undefined) salida.observaciones = observaciones;

        await salida.save();
        await salida.populate('excursion');

        logger.info(`Salida actualizada: ${salida._id}`);

        res.json({
            mensaje: 'Salida actualizada con éxito',
            salida
        });

    } catch (error) {
        logger.error('Error al editar salida:', error);
        res.status(500).json({ mensaje: 'Error al editar salida' });
    }
};

exports.eliminarSalida = async (req, res) => {
    try {
        const { id } = req.params;

        const salida = await Salida.findById(id);
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        const Reserva = require('../models/reservaModel');
        const reservas = await Reserva.countDocuments({
            salida: id,
            estado: { $in: ['confirmada', 'pendiente'] }
        });

        if (reservas > 0) {
            return res.status(400).json({
                mensaje: `No se puede eliminar. Hay ${reservas} reserva(s) para esta salida`
            });
        }

        await Salida.findByIdAndDelete(id);
        logger.info(`Salida eliminada: ${id}`);

        res.json({ mensaje: 'Salida eliminada con éxito' });

    } catch (error) {
        logger.error('Error al eliminar salida:', error);
        res.status(500).json({ mensaje: 'Error al eliminar salida' });
    }
};

exports.verificarDisponibilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidadPersonas } = req.query;

        const salida = await Salida.findById(id);
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        const cantidad = parseInt(cantidadPersonas) || 1;
        const disponible = salida.verificarDisponibilidad(cantidad);

        res.json({
            disponible,
            disponibilidad: salida.disponibilidad,
            capacidadMaxima: salida.capacidadMaxima,
            mensaje: disponible
                ? `Hay ${salida.disponibilidad} lugares disponibles`
                : 'No hay suficiente disponibilidad'
        });

    } catch (error) {
        logger.error('Error al verificar disponibilidad:', error);
        res.status(500).json({ mensaje: 'Error al verificar disponibilidad' });
    }
};
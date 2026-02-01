const Reserva = require('../models/reservaModel');
const Salida = require('../models/salidaModel');
const Usuario = require('../models/usuarioModel');
const logger = require('../utils/logger');

// ==========================================
// CREAR RESERVA (antes comprarExcursion)
// ==========================================
exports.crearReserva = async (req, res) => {
    try {
        const {
            idSalida,
            cantidadPersonas,
            metodoPago,
            observaciones
        } = req.body;

        // El cliente es el usuario autenticado
        const idCliente = req.usuario.id;

        logger.info('=== CREAR RESERVA ===');
        logger.info(`Cliente: ${idCliente}, Salida: ${idSalida}, Personas: ${cantidadPersonas}`);

        // Verificar que el cliente existe
        const cliente = await Usuario.findById(idCliente);
        if (!cliente) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar que la salida existe
        const salida = await Salida.findById(idSalida).populate('excursion');
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        // Verificar que la salida está habilitada
        if (!salida.habilitada) {
            return res.status(400).json({ mensaje: 'Esta salida no está habilitada' });
        }

        // Verificar que la fecha es futura
        if (salida.fecha < new Date()) {
            return res.status(400).json({ mensaje: 'No se pueden hacer reservas para fechas pasadas' });
        }

        // Verificar disponibilidad
        if (!salida.verificarDisponibilidad(cantidadPersonas)) {
            return res.status(400).json({
                mensaje: `No hay suficiente disponibilidad. Solo quedan ${salida.disponibilidad} lugares`
            });
        }

        // Calcular total
        const totalPagado = salida.excursion.precio * cantidadPersonas;

        // Crear la reserva
        const nuevaReserva = new Reserva({
            cliente: idCliente,
            salida: idSalida,
            cantidadPersonas,
            totalPagado,
            metodoPago: metodoPago || 'efectivo',
            observaciones,
            // Guardar datos del cliente por si cambian después
            nombreCliente: `${cliente.nombre} ${cliente.apellido}`,
            emailCliente: cliente.email,
            telefonoCliente: cliente.telefono
        });

        // Guardar la reserva
        await nuevaReserva.save();

        // Actualizar disponibilidad de la salida
        await salida.reservarCupos(cantidadPersonas);

        // Agregar la reserva al usuario
        cliente.excursionesCompradas.push(nuevaReserva._id);
        await cliente.save();

        // Populate para devolver datos completos
        await nuevaReserva.populate([
            { path: 'salida', populate: { path: 'excursion' } },
            { path: 'cliente', select: 'nombre apellido email' }
        ]);

        logger.info(`Reserva creada exitosamente: ${nuevaReserva._id}`);

        res.status(201).json({
            mensaje: 'Reserva creada con éxito',
            reserva: nuevaReserva
        });

    } catch (error) {
        logger.error('Error al crear reserva:', error);
        res.status(500).json({
            mensaje: 'Error al crear reserva',
            error: error.message
        });
    }
};

// ==========================================
// OBTENER RESERVAS DEL USUARIO AUTENTICADO
// ==========================================
exports.obtenerMisReservas = async (req, res) => {
    try {
        const idCliente = req.usuario.id;
        const { estado, futuras } = req.query;

        logger.info(`=== OBTENER MIS RESERVAS ===`);
        logger.info(`Cliente: ${idCliente}`);

        let filtro = { cliente: idCliente };

        // Filtrar por estado
        if (estado) {
            filtro.estado = estado;
        }

        const reservas = await Reserva.find(filtro)
            .populate({
                path: 'salida',
                populate: { path: 'excursion' }
            })
            .sort({ fechaReserva: -1 });

        // Filtrar futuras si se solicita
        let reservasFiltradas = reservas;
        if (futuras === 'true') {
            reservasFiltradas = reservas.filter(r =>
                r.salida && r.salida.fecha >= new Date()
            );
        }

        res.json(reservasFiltradas);

    } catch (error) {
        logger.error('Error al obtener mis reservas:', error);
        res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
};

// ==========================================
// OBTENER TODAS LAS RESERVAS (ADMIN)
// ==========================================
exports.obtenerTodasReservas = async (req, res) => {
    try {
        const { estado, salida, cliente } = req.query;

        let filtro = {};

        if (estado) filtro.estado = estado;
        if (salida) filtro.salida = salida;
        if (cliente) filtro.cliente = cliente;

        const reservas = await Reserva.find(filtro)
            .populate('cliente', 'nombre apellido email')
            .populate({
                path: 'salida',
                populate: { path: 'excursion' }
            })
            .sort({ fechaReserva: -1 });

        res.json(reservas);

    } catch (error) {
        logger.error('Error al obtener todas las reservas:', error);
        res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
};

// ==========================================
// OBTENER RESERVA POR ID
// ==========================================
exports.obtenerReservaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const reserva = await Reserva.findById(id)
            .populate('cliente', 'nombre apellido email telefono')
            .populate({
                path: 'salida',
                populate: { path: 'excursion' }
            });

        if (!reserva) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }

        // Verificar permisos (solo el cliente o admin)
        if (req.usuario.rol !== 'admin' && req.usuario.id !== reserva.cliente._id.toString()) {
            return res.status(403).json({ mensaje: 'No tienes permiso para ver esta reserva' });
        }

        res.json(reserva);

    } catch (error) {
        logger.error('Error al obtener reserva:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de reserva inválido' });
        }

        res.status(500).json({ mensaje: 'Error al obtener reserva' });
    }
};

// ==========================================
// CANCELAR RESERVA
// ==========================================
exports.cancelarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        logger.info(`=== CANCELAR RESERVA ===`);
        logger.info(`Reserva ID: ${id}`);

        const reserva = await Reserva.findById(id).populate('salida');

        if (!reserva) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }

        // Verificar permisos
        if (req.usuario.rol !== 'admin' && req.usuario.id !== reserva.cliente.toString()) {
            return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta reserva' });
        }

        // Intentar cancelar (el método verifica si se puede)
        await reserva.cancelar();

        logger.info(`Reserva cancelada: ${id}`);

        res.json({
            mensaje: 'Reserva cancelada con éxito',
            reserva
        });

    } catch (error) {
        logger.error('Error al cancelar reserva:', error);
        res.status(400).json({
            mensaje: error.message || 'Error al cancelar reserva'
        });
    }
};

// ==========================================
// COMPLETAR RESERVA (ADMIN)
// ==========================================
exports.completarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }

        await reserva.completar();

        logger.info(`Reserva completada: ${id}`);

        res.json({
            mensaje: 'Reserva marcada como completada',
            reserva
        });

    } catch (error) {
        logger.error('Error al completar reserva:', error);
        res.status(400).json({
            mensaje: error.message || 'Error al completar reserva'
        });
    }
};

// ==========================================
// OBTENER RESERVAS POR SALIDA (ADMIN)
// ==========================================
exports.obtenerReservasPorSalida = async (req, res) => {
    try {
        const { idSalida } = req.params;

        const reservas = await Reserva.find({
            salida: idSalida,
            estado: { $in: ['confirmada', 'completada'] }
        })
            .populate('cliente', 'nombre apellido email telefono')
            .sort({ fechaReserva: 1 });

        const totalPersonas = reservas.reduce((sum, r) => sum + r.cantidadPersonas, 0);
        const totalRecaudado = reservas.reduce((sum, r) => sum + r.totalPagado, 0);

        res.json({
            reservas,
            estadisticas: {
                totalReservas: reservas.length,
                totalPersonas,
                totalRecaudado
            }
        });

    } catch (error) {
        logger.error('Error al obtener reservas por salida:', error);
        res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
};
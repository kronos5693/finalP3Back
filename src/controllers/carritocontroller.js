const Carrito = require('../models/carritomodel');
const Salida = require('../models/salidaModel');
const Reserva = require('../models/reservaModel');
const Usuario = require('../models/usuarioModel');
const logger = require('../utils/logger');

exports.obtenerCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        let carrito = await Carrito.findOne({ usuario: usuarioId })
            .populate({
                path: 'items.salida',
                populate: { path: 'excursion' }
            });

        if (!carrito) {
            carrito = new Carrito({
                usuario: usuarioId,
                items: []
            });
            await carrito.save();
        }

        const itemsValidos = carrito.items.filter(item => item.salida && item.salida._id);

        if (itemsValidos.length !== carrito.items.length) {
            carrito.items = itemsValidos;
            await carrito.save();
        }

        res.json(carrito);
    } catch (error) {
        logger.error('Error al obtener carrito:', error);
        res.status(500).json({ mensaje: 'Error al obtener carrito' });
    }
};

exports.agregarAlCarrito = async (req, res) => {
    try {
        const { idSalida, cantidadPersonas } = req.body;
        const usuarioId = req.usuario.id;

        logger.info('=== AGREGAR AL CARRITO ===');
        logger.info(`Usuario: ${usuarioId}, Salida: ${idSalida}, Personas: ${cantidadPersonas}`);

        if (!idSalida || !cantidadPersonas || cantidadPersonas < 1) {
            return res.status(400).json({ mensaje: 'Datos inválidos' });
        }

        const salida = await Salida.findById(idSalida).populate('excursion');
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        if (!salida.verificarDisponibilidad(cantidadPersonas)) {
            return res.status(400).json({
                mensaje: `Solo hay ${salida.disponibilidad} lugares disponibles`
            });
        }

        let carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            carrito = new Carrito({
                usuario: usuarioId,
                items: []
            });
        }

        const itemExistente = carrito.items.find(
            item => item.salida && item.salida.toString() === idSalida
        );

        if (itemExistente) {
            const nuevaCantidad = itemExistente.cantidadPersonas + cantidadPersonas;

            if (!salida.verificarDisponibilidad(nuevaCantidad - itemExistente.cantidadPersonas)) {
                return res.status(400).json({
                    mensaje: 'No hay suficiente disponibilidad'
                });
            }

            itemExistente.cantidadPersonas = nuevaCantidad;
            //  Usar salida.precioPersona directamente
            itemExistente.precioUnitario = salida.precioPersona;
        } else {
            carrito.items.push({
                salida: idSalida,
                cantidadPersonas,
                //  Usar salida.precioPersona directamente
                precioUnitario: salida.precioPersona
            });
        }

        await carrito.save();

        await carrito.populate({
            path: 'items.salida',
            populate: { path: 'excursion' }
        });

        logger.info(`Item agregado al carrito del usuario ${usuarioId}`);

        res.json({
            mensaje: 'Agregado al carrito',
            carrito
        });
    } catch (error) {
        logger.error('Error al agregar al carrito:', error);
        res.status(500).json({ mensaje: 'Error al agregar al carrito' });
    }
};

exports.actualizarItem = async (req, res) => {
    try {
        const { idSalida, cantidadPersonas } = req.body;
        const usuarioId = req.usuario.id;

        if (!idSalida || cantidadPersonas < 1) {
            return res.status(400).json({ mensaje: 'Datos inválidos' });
        }

        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        const item = carrito.items.find(
            item => item.salida && item.salida.toString() === idSalida
        );

        if (!item) {
            return res.status(404).json({ mensaje: 'Item no encontrado en el carrito' });
        }

        const salida = await Salida.findById(idSalida).populate('excursion');
        if (!salida) {
            return res.status(404).json({ mensaje: 'Salida no encontrada' });
        }

        const diferencia = cantidadPersonas - item.cantidadPersonas;

        if (diferencia > 0 && !salida.verificarDisponibilidad(diferencia)) {
            return res.status(400).json({
                mensaje: 'No hay suficiente disponibilidad'
            });
        }

        item.cantidadPersonas = cantidadPersonas;

        item.precioUnitario = salida.precioPersona;

        await carrito.save();

        await carrito.populate({
            path: 'items.salida',
            populate: { path: 'excursion' }
        });

        res.json({
            mensaje: 'Carrito actualizado',
            carrito
        });
    } catch (error) {
        logger.error('Error al actualizar item:', error);
        res.status(500).json({ mensaje: 'Error al actualizar item' });
    }
};

exports.eliminarItem = async (req, res) => {
    try {
        const { idSalida } = req.params;
        const usuarioId = req.usuario.id;

        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        carrito.items = carrito.items.filter(
            item => item.salida && item.salida.toString() !== idSalida
        );

        await carrito.save();

        await carrito.populate({
            path: 'items.salida',
            populate: { path: 'excursion' }
        });

        res.json({
            mensaje: 'Item eliminado',
            carrito
        });
    } catch (error) {
        logger.error('Error al eliminar item:', error);
        res.status(500).json({ mensaje: 'Error al eliminar item' });
    }
};

exports.vaciarCarrito = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const carrito = await Carrito.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ mensaje: 'Carrito no encontrado' });
        }

        carrito.items = [];
        await carrito.save();

        res.json({
            mensaje: 'Carrito vaciado',
            carrito
        });
    } catch (error) {
        logger.error('Error al vaciar carrito:', error);
        res.status(500).json({ mensaje: 'Error al vaciar carrito' });
    }
};

exports.procesarCheckout = async (req, res) => {
    try {
        const { metodoPago, observaciones } = req.body;
        const usuarioId = req.usuario.id;

        logger.info('=== PROCESAR CHECKOUT ===');
        logger.info(`Usuario: ${usuarioId}`);

        const carrito = await Carrito.findOne({ usuario: usuarioId })
            .populate({
                path: 'items.salida',
                populate: { path: 'excursion' }
            });

        if (!carrito || carrito.items.length === 0) {
            return res.status(400).json({ mensaje: 'El carrito está vacío' });
        }

        const usuario = await Usuario.findById(usuarioId);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const reservasCreadas = [];
        const errores = [];

        for (const item of carrito.items) {
            try {
                if (!item.salida || !item.salida._id) {
                    errores.push('Salida inválida en el carrito');
                    continue;
                }

                const salida = await Salida.findById(item.salida._id).populate('excursion');

                if (!salida) {
                    errores.push(`Salida ${item.salida._id} no encontrada`);
                    continue;
                }

                if (!salida.verificarDisponibilidad(item.cantidadPersonas)) {
                    errores.push(`No hay disponibilidad para ${salida.excursion.excursion}`);
                    continue;
                }

                // ⭐ CAMBIO: Usar salida.precioPersona directamente
                const totalPagado = salida.precioPersona * item.cantidadPersonas;

                const reserva = new Reserva({
                    cliente: usuarioId,
                    salida: salida._id,
                    cantidadPersonas: item.cantidadPersonas,
                    totalPagado,
                    metodoPago: metodoPago || 'efectivo',
                    observaciones,
                    nombreCliente: `${usuario.nombre} ${usuario.apellido}`,
                    emailCliente: usuario.email,
                    telefonoCliente: usuario.telefono
                });

                await reserva.save();
                await salida.reservarCupos(item.cantidadPersonas);

                usuario.excursionesCompradas.push(reserva._id);

                reservasCreadas.push(reserva);

                logger.info(`Reserva creada: ${reserva._id}`);
            } catch (error) {
                logger.error('Error al procesar item del carrito:', error);
                errores.push(`Error en item: ${error.message}`);
            }
        }

        await usuario.save();

        carrito.items = [];
        await carrito.save();

        if (reservasCreadas.length === 0) {
            return res.status(400).json({
                mensaje: 'No se pudo crear ninguna reserva',
                errores
            });
        }

        logger.info(`Checkout completado: ${reservasCreadas.length} reserva(s) creada(s)`);

        res.json({
            mensaje: 'Checkout completado',
            reservasCreadas: reservasCreadas.length,
            errores: errores.length > 0 ? errores : undefined
        });
    } catch (error) {
        logger.error('Error en checkout:', error);
        res.status(500).json({ mensaje: 'Error al procesar checkout' });
    }
};
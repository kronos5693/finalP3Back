// En compraController.js

const Compra = require('../models/compraModel');
const Usuario = require('../models/usuarioModel');
const Excursion = require('../models/excursionModel');

exports.comprarExcursion = async (req, res) => {
    try {
        const { idUsuario, idExcursion, cantidadPersonas, totalPagado, fechaExcursion } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar si la excursión existe
        const excursion = await Excursion.findById(idExcursion);
        if (!excursion) {
            return res.status(404).json({ mensaje: 'Excursión no encontrada' });
        }

        // Crear una nueva compra
        const nuevaCompra = new Compra({
            excursion: excursion,
            cantidadPersonas: cantidadPersonas,
            fechaExcursion: new Date(fechaExcursion), // Convertir la cadena de fecha a objeto Date
            totalPagado: totalPagado,
        });

        // Guardar la compra en el usuario
        usuario.excursionesCompradas.push(nuevaCompra);
        await usuario.save();

        res.json({ mensaje: 'Excursión comprada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al comprar excursión' });
    }
};


exports.obtenerComprasPorUsuario = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        // Verificar si el usuario existe
        const usuario = await Usuario.findById(idUsuario).populate('excursionesCompradas');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario.excursionesCompradas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener compras del usuario' });
    }
};
// En compraController.js

exports.eliminarCompra = async (req, res) => {
    try {
        const { idCompra } = req.params;

        // Verificar si la compra existe
        const compra = await Compra.findById(idCompra);
        if (!compra) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        // Eliminar la compra
        await compra.remove();

        res.json({ mensaje: 'Compra eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar compra' });
    }
};
exports.editarCompra = async (req, res) => {
    try {
        const { idCompra, cantidadPersonas, totalPagado, fechaExcursion } = req.body;

        // Verificar si la compra existe
        const compra = await Compra.findById(idCompra);
        if (!compra) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        // Actualizar la información de la compra
        compra.cantidadPersonas = cantidadPersonas;
        compra.totalPagado = totalPagado;
        compra.fechaExcursion = new Date(fechaExcursion);

        // Guardar los cambios
        await compra.save();

        res.json({ mensaje: 'Compra actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al editar compra' });
    }
};
// compraController.js
const Compra = require('../models/compraModel');
const Usuario = require('../models/usuarioModel');
const Excursion = require('../models/excursionModel');

const respuestaError = (res, mensaje, error) => {
  console.error(error);
  res.status(500).json({ mensaje: `Error: ${mensaje}`, error: error.message });
};

exports.comprarExcursion = async (req, res) => {
    try {
        const { idUsuario, idExcursion, cantidadPersonas, totalPagado, fechaExcursion, turnoExcursion } = req.body;

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

        // Verificar disponibilidad en el turno seleccionado
        const horarioSeleccionado = excursion.horarios.find((horario) => horario.turno === turnoExcursion);
        if (!horarioSeleccionado) {
            return res.status(400).json({ mensaje: 'Turno de excursión no válido' });
        }

        if (horarioSeleccionado.disponibilidad >= cantidadPersonas) {
            // Crear una nueva compra
            const nuevaCompra = new Compra({
                excursion: excursion,
                cantidadPersonas: cantidadPersonas,
                fechaExcursion: new Date(fechaExcursion), // Convertir la cadena de fecha a objeto Date
                turnoExcursion: turnoExcursion,
                totalPagado: totalPagado,
            });

            // Guardar la compra en el usuario
            usuario.excursionesCompradas.push(nuevaCompra);
            await usuario.save();

            // Actualizar la disponibilidad
            horarioSeleccionado.disponibilidad -= cantidadPersonas;
            await excursion.save(); // Asegúrate de guardar la excursión después de actualizar la disponibilidad

            res.json({ mensaje: 'Excursión comprada con éxito' });
        } else {
            return res.status(400).json({ mensaje: 'No hay suficiente disponibilidad para esa cantidad de personas en ese horario.' });
        }
    } catch (error) {
        respuestaError(res, 'Error al comprar excursión', error);
    }
};


exports.obtenerComprasPorUsuario = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const usuario = await Usuario.findById(idUsuario).populate('excursionesCompradas');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario.excursionesCompradas);
  } catch (error) {
    respuestaError(res, 'Error al obtener compras del usuario', error);
  }
};

exports.eliminarCompra = async (req, res) => {
  try {
    const { idCompra } = req.params;

    const compra = await Compra.findById(idCompra);
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }

    await compra.remove();

    res.json({ mensaje: 'Compra eliminada con éxito' });
  } catch (error) {
    respuestaError(res, 'Error al eliminar compra', error);
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
      respuestaError(res, 'Error al editar compra', error);
    }
  };
  

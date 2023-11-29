const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  excursion: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: true },
  cantidadPersonas: { type: Number, required: true },
  fechaCompra: { type: Date, default: Date.now },
  fechaExcursion: { type: Date, required: true },
  turnoExcursion: { type: String, enum: ['9hs', '11hs', '14hs', '16hs'], required: true },
  totalPagado: { type: Number, required: true },
});

compraSchema.pre('save', async function (next) {
  try {
    const excursion = await mongoose.model('Excursion').findById(this.excursion);
    const horarioSeleccionado = excursion.horarios.find(
      (horario) => horario.turno === this.turnoExcursion
    );

    if (horarioSeleccionado.cupos_disponibles >= this.cantidadPersonas) {
      horarioSeleccionado.cupos_disponibles -= this.cantidadPersonas;
      await excursion.save();
      next();
    } else {
      throw new Error('No hay suficiente disponibilidad para esa cantidad de personas en ese horario.');
    }
  } catch (error) {
    next(error);
  }
});

const Compra = mongoose.model('Compra', compraSchema);

module.exports = Compra;

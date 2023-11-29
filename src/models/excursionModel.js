const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  turno: { type: String, enum: ['9hs', '11hs', '14hs', '16hs'], required: true },
  disponibilidad: { type: Number, default: 15 },
});

const excursionSchema = new mongoose.Schema({
  excursion: { type: String, required: true },
  provincia: { type: String, required: true },
  localidad: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  img: { type: String, required: true },
  horarios: [horarioSchema],
});

const Excursion = mongoose.model('Excursion', excursionSchema);

module.exports = Excursion;

const mongoose = require('mongoose');

const personajeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  img: { type: String, required: true }
});

const Personaje = mongoose.model('Personaje', personajeSchema);

module.exports = Personaje;

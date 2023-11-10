const mongoose = require('mongoose');

const excursionSchema = new mongoose.Schema({
    excursion: { type: String, required: true },
    provincia: { type: String, required: true },
    localidad: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    img: { type: String, required: true },
});

const Excursion = mongoose.model('Excursion', excursionSchema);

module.exports = Excursion;

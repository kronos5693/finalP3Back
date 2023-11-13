// En compraModel.js

const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    excursion: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: true },
    cantidadPersonas: { type: Number, required: true },
    fechaCompra: { type: Date, default: Date.now },
    fechaExcursion: { type: Date, required: true },
    totalPagado: { type: Number, required: true },
});

const Compra = mongoose.model('Compra', compraSchema);

module.exports = Compra;

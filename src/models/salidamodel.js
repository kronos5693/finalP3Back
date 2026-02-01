const mongoose = require('mongoose');

const salidaSchema = new mongoose.Schema({
    excursion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Excursion',
        required: [true, 'La excursión es requerida']
    },

    fecha: {
        type: Date,
        required: [true, 'La fecha es requerida']
    },

    horario: {
        type: String,
        required: [true, 'El horario es requerido'],
        enum: ['9hs', '11hs', '14hs', '16hs'],
        trim: true
    },

    capacidadMaxima: {
        type: Number,
        required: true,
        default: 15,
        min: [1, 'La capacidad mínima es 1 persona']
    },

    disponibilidad: {
        type: Number,
        required: true,
        default: 15,
        min: [0, 'La disponibilidad no puede ser negativa']
    },

    // ⭐ CAMBIO CRÍTICO: precioPersona ahora es OBLIGATORIO
    precioPersona: {
        type: Number,
        required: [true, 'El precio por persona es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },

    habilitada: {
        type: Boolean,
        default: true
    },

    guia: {
        type: String,
        trim: true
    },

    observaciones: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

salidaSchema.index({ excursion: 1, fecha: 1, horario: 1 }, { unique: true });
salidaSchema.index({ fecha: 1, habilitada: 1 });

salidaSchema.virtual('disponible').get(function() {
    return this.disponibilidad > 0 && this.habilitada;
});

salidaSchema.methods.verificarDisponibilidad = function(cantidadPersonas) {
    return this.disponibilidad >= cantidadPersonas && this.habilitada;
};

salidaSchema.methods.reservarCupos = async function(cantidadPersonas) {
    if (!this.verificarDisponibilidad(cantidadPersonas)) {
        throw new Error('No hay suficiente disponibilidad');
    }

    this.disponibilidad -= cantidadPersonas;
    await this.save();
    return this;
};

salidaSchema.methods.liberarCupos = async function(cantidadPersonas) {
    this.disponibilidad = Math.min(
        this.disponibilidad + cantidadPersonas,
        this.capacidadMaxima
    );
    await this.save();
    return this;
};

salidaSchema.set('toJSON', { virtuals: true });
salidaSchema.set('toObject', { virtuals: true });

const Salida = mongoose.model('Salida', salidaSchema);

module.exports = Salida;
const mongoose = require('mongoose');



const reservaSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El cliente es requerido']
    },

    salida: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salida',
        required: [true, 'La salida es requerida']
    },

    cantidadPersonas: {
        type: Number,
        required: [true, 'La cantidad de personas es requerida'],
        min: [1, 'Debe reservar al menos 1 persona']
    },

    totalPagado: {
        type: Number,
        required: [true, 'El total pagado es requerido'],
        min: [0, 'El total no puede ser negativo']
    },

    fechaReserva: {
        type: Date,
        default: Date.now
    },

    estado: {
        type: String,
        enum: ['confirmada', 'cancelada', 'completada'],
        default: 'confirmada'
    },

    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta', 'transferencia'],
        default: 'efectivo'
    },

    observaciones: {
        type: String,
        trim: true
    },

    // Datos adicionales del cliente (por si cambia su info)
    nombreCliente: String,
    emailCliente: String,
    telefonoCliente: String
}, {
    timestamps: true
});

// Índice para búsquedas frecuentes
reservaSchema.index({ cliente: 1, estado: 1 });
reservaSchema.index({ salida: 1 });
reservaSchema.index({ fechaReserva: -1 });

// Virtual para verificar si es futura
reservaSchema.virtual('esFutura').get(function() {
    return this.salida && this.salida.fecha > new Date();
});

// Virtual para verificar si se puede cancelar
reservaSchema.virtual('puedeCancelar').get(function() {
    if (this.estado !== 'confirmada') return false;
    if (!this.salida || !this.salida.fecha) return false;

    // Permitir cancelación hasta 24 horas antes
    const horasHastaSalida = (this.salida.fecha - new Date()) / (1000 * 60 * 60);
    return horasHastaSalida > 24;
});

// Método para cancelar reserva
reservaSchema.methods.cancelar = async function() {
    if (this.estado === 'cancelada') {
        throw new Error('La reserva ya está cancelada');
    }

    if (!this.puedeCancelar) {
        throw new Error('No se puede cancelar esta reserva (menos de 24hs antes de la salida)');
    }

    this.estado = 'cancelada';
    await this.save();

    // Liberar cupos en la salida
    const Salida = mongoose.model('Salida');
    const salida = await Salida.findById(this.salida);
    if (salida) {
        await salida.liberarCupos(this.cantidadPersonas);
    }
};

// Método para completar reserva
reservaSchema.methods.completar = async function() {
    if (this.estado === 'completada') {
        throw new Error('La reserva ya está completada');
    }

    this.estado = 'completada';
    await this.save();
};

// Configurar virtuals en JSON
reservaSchema.set('toJSON', { virtuals: true });
reservaSchema.set('toObject', { virtuals: true });

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
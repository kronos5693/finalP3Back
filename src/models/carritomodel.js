const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        unique: true
    },

    items: [{
        salida: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Salida',
            required: true
        },
        cantidadPersonas: {
            type: Number,
            required: true,
            min: 1
        },
        precioUnitario: {
            type: Number,
            required: true
        },
        fechaAgregado: {
            type: Date,
            default: Date.now
        }
    }],

    fechaCreacion: {
        type: Date,
        default: Date.now
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

carritoSchema.index({ usuario: 1 });
carritoSchema.index({ 'items.salida': 1 });


carritoSchema.virtual('total').get(function() {
    return this.items.reduce((total, item) => {
        const precioReal = item.salida?.precioPersona || item.precioUnitario;
        const subtotal = item.cantidadPersonas * precioReal;
        return total + subtotal;
    }, 0);
});

carritoSchema.virtual('cantidadItems').get(function() {
    return this.items.length;
});

carritoSchema.pre('save', function(next) {
    this.fechaActualizacion = Date.now();
    next();
});

// ⭐ CAMBIO: Transform usa salida.precioPersona
carritoSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret) {
        ret.items = ret.items.map(item => {
            const precioReal = item.salida?.precioPersona || item.precioUnitario;
            return {
                ...item,
                subtotal: item.cantidadPersonas * precioReal
            };
        });

        ret.total = ret.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

        return ret;
    }
});

carritoSchema.set('toObject', {
    virtuals: true,
    transform: function(doc, ret) {
        ret.items = ret.items.map(item => {
            const precioReal = item.salida?.precioPersona || item.precioUnitario;
            return {
                ...item,
                subtotal: item.cantidadPersonas * precioReal
            };
        });

        ret.total = ret.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

        return ret;
    }
});

const Carrito = mongoose.model('Carrito', carritoSchema);

module.exports = Carrito;
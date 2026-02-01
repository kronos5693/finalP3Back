const mongoose = require('mongoose');



const excursionSchema = new mongoose.Schema({
  excursion: {
    type: String,
    required: [true, 'El nombre de la excursión es requerido'],
    trim: true
  },

  provincia: {
    type: String,
    required: [true, 'La provincia es requerida'],
    trim: true
  },

  localidad: {
    type: String,
    required: [true, 'La localidad es requerida'],
    trim: true
  },

  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },

  // ⭐ CAMBIO: Precio ahora es OPCIONAL (solo referencial)
  precio: {
    type: Number,
    required: false,
    default: 0,
    min: [0, 'El precio no puede ser negativo']
  },

  img: {
    type: String,
    required: [true, 'La imagen es requerida'],
    trim: true
  },

  habilitadaPorTemporada: {
    type: Boolean,
    default: true
  },

  duracion: {
    type: String,
    trim: true
  },

  dificultad: {
    type: String,
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },

  incluye: [{
    type: String,
    trim: true
  }],

  noIncluye: [{
    type: String,
    trim: true
  }],

  requisitos: [{
    type: String,
    trim: true
  }],

}, {
  timestamps: true
});

// Índice para búsquedas
excursionSchema.index({ provincia: 1 });
excursionSchema.index({ localidad: 1 });
excursionSchema.index({ habilitadaPorTemporada: 1 });

// Virtual para obtener salidas futuras
excursionSchema.virtual('salidasFuturas', {
  ref: 'Salida',
  localField: '_id',
  foreignField: 'excursion',
  match: {
    fecha: { $gte: new Date() },
    habilitada: true
  }
});

// Método para verificar si está habilitada
excursionSchema.methods.estaHabilitada = function() {
  return this.habilitadaPorTemporada;
};

// Configurar virtuals en JSON
excursionSchema.set('toJSON', { virtuals: true });
excursionSchema.set('toObject', { virtuals: true });

const Excursion = mongoose.model('Excursion', excursionSchema);

module.exports = Excursion;
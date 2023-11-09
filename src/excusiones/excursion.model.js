const mongoose = require("mongoose");

const excurionSchema = mongoose.Schema({
    excursion: {
    type: String,
    required: true,
  },
  provincia: {
    type: String,
    required: true
  },
  localidad: {
    type: String,
    required: true

  }
  ,
  descripcion: {
    type: String,
    required: true

  }
  ,
  precio: {
    type: Number,
    required: false

  },

img: {
    type: String,
    required: false

  }
});

module.exports = mongoose.model('Excursion', excurionSchema);
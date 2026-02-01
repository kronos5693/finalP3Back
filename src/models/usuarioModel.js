const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    contraseña: {
        type: String,
        required: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    telefono: { type: String, trim: true },
    edad: { type: Number, min: 0, max: 150 },
    direccion: {
        calle: { type: String, trim: true },
        ciudad: { type: String, trim: true },
        provincia: { type: String, trim: true },
        codigoPostal: { type: String, trim: true },
        pais: { type: String, trim: true, default: 'Argentina' }
    },
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' },
    excursionesCompradas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }],
}, {
    timestamps: true
});

usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('contraseña')) return next();

    try {
        const hash = await bcrypt.hash(this.contraseña, 10);
        this.contraseña = hash;
        next();
    } catch (error) {
        next(error);
    }
});

usuarioSchema.methods.compararContraseña = async function(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
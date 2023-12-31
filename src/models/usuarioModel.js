const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' },
    excursionesCompradas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compra' }],
});

// Cifrar la contraseña antes de guardarla
usuarioSchema.pre('save', async function (next) {
    const usuario = this;
    const hash = await bcrypt.hash(usuario.contraseña, 10);
    usuario.contraseña = hash;
    next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

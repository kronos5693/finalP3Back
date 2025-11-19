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
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' },
    excursionesCompradas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compra' }],
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Cifrar la contraseña antes de guardarla
usuarioSchema.pre('save', async function (next) {
    // Solo cifrar la contraseña si ha sido modificada (o es nueva)
    if (!this.isModified('contraseña')) return next();
    
    try {
        const hash = await bcrypt.hash(this.contraseña, 10);
        this.contraseña = hash;
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContraseña = async function(contraseña) {
    return await bcrypt.compare(contraseña, this.contraseña);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
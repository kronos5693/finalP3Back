const mongoose = require('mongoose');
const Usuario = require('../models/usuarioModel');
const Rol = require('../models/rolModel');
require('dotenv').config();

async function createAdmin() {
    try {
        console.log('=== CREANDO USUARIO ADMINISTRADOR ===\n');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Conectado a MongoDB\n');
        
        // Buscar el rol admin
        const rolAdmin = await Rol.findOne({ nombre: 'admin' });
        if (!rolAdmin) {
            console.error(' Rol "admin" no encontrado en la base de datos');
            console.log('   Por favor ejecuta primero: npm start');
            process.exit(1);
        }
        
        console.log(`✓ Rol admin encontrado (ID: ${rolAdmin._id})\n`);
        
        // Datos del administrador
        const adminData = {
            nombre: 'Admin',
            apellido: 'Sistema',
            email: 'admin@ejemplo.com',
            contraseña: 'Admin123!',  // Será hasheada automáticamente
            rol: rolAdmin._id
        };
        
        // Verificar si ya existe
        const existeAdmin = await Usuario.findOne({ email: adminData.email });
        if (existeAdmin) {
            console.log('⚠️  El usuario admin ya existe\n');
            console.log('📧 Email:', existeAdmin.email);
            console.log('👤 Nombre:', existeAdmin.nombre, existeAdmin.apellido);
            console.log('\n💡 Si olvidaste la contraseña, puedes:');
            console.log('   1. Eliminar este usuario desde MongoDB');
            console.log('   2. Ejecutar este script de nuevo');
            process.exit(0);
        }
        
        // Crear el administrador
        const admin = new Usuario(adminData);
        await admin.save();
        
        console.log('✅ Usuario administrador creado exitosamente\n');
        console.log('╔═══════════════════════════════════════╗');
        console.log('║   CREDENCIALES DE ADMINISTRADOR      ║');
        console.log('╠═══════════════════════════════════════╣');
        console.log('║ 📧 Email:    ', adminData.email.padEnd(21), '║');
        console.log('║ 🔑 Contraseña:', adminData.contraseña.padEnd(21), '║');
        console.log('╚═══════════════════════════════════════╝');
        console.log('\n⚠️  IMPORTANTE:');
        console.log('   - Guarda estas credenciales en un lugar seguro');
        console.log('   - Cambia la contraseña después del primer login');
        console.log('   - Puedes crear más administradores desde el panel');
        console.log('\n🚀 Ahora puedes:');
        console.log('   1. Ir a http://localhost:5173/login');
        console.log('   2. Iniciar sesión con estas credenciales');
        console.log('   3. Acceder al Panel de Administración');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.code === 11000) {
            console.log('\n💡 El email ya está en uso. Intenta con otro email.');
        }
        process.exit(1);
    }
}

// Verificar que se proporcione la URI de MongoDB
if (!process.env.MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está configurado en .env');
    console.log('\n📝 Por favor:');
    console.log('   1. Crea un archivo .env en la raíz del proyecto');
    console.log('   2. Agrega: MONGODB_URI=mongodb://localhost:27017/tu_base_datos');
    process.exit(1);
}

createAdmin();
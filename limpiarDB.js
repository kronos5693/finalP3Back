const mongoose = require('mongoose');
require('dotenv').config();

const limpiarTodo = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        console.log('\n════════════════════════════════════════');
        console.log('🔧 INICIANDO LIMPIEZA DE BASE DE DATOS');
        console.log('════════════════════════════════════════\n');

        console.log('Conectando a MongoDB...');
        await mongoose.connect(uri);
        console.log('✅ Conectado a MongoDB\n');

        // Verificar qué colecciones existen
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('📋 Colecciones en la base de datos:');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });
        console.log('');

        // LIMPIAR SALIDAS
        console.log('🗑️  Eliminando SALIDAS...');
        const resultSalidas = await db.collection('salidas').deleteMany({});
        console.log(`   ✅ Salidas eliminadas: ${resultSalidas.deletedCount}\n`);

        // LIMPIAR CARRITOS
        console.log('🗑️  Eliminando CARRITOS...');
        const resultCarritos = await db.collection('carritos').deleteMany({});
        console.log(`   ✅ Carritos eliminados: ${resultCarritos.deletedCount}\n`);

        // LIMPIAR RESERVAS
        console.log('🗑️  Eliminando RESERVAS...');
        const resultReservas = await db.collection('reservas').deleteMany({});
        console.log(`   ✅ Reservas eliminadas: ${resultReservas.deletedCount}\n`);

        // VERIFICAR QUÉ QUEDA
        console.log('════════════════════════════════════════');
        console.log('📊 VERIFICANDO DATOS RESTANTES:');
        console.log('════════════════════════════════════════\n');

        const excursionesCount = await db.collection('excursions').countDocuments();
        console.log(`✅ Excursiones conservadas: ${excursionesCount}`);

        const usuariosCount = await db.collection('usuarios').countDocuments();
        console.log(`✅ Usuarios conservados: ${usuariosCount}`);

        const rolesCount = await db.collection('roles').countDocuments();
        console.log(`✅ Roles conservados: ${rolesCount}`);

        const personajesCount = await db.collection('personajes').countDocuments();
        console.log(`✅ Personajes conservados: ${personajesCount}`);

        const salidasCount = await db.collection('salidas').countDocuments();
        console.log(`✅ Salidas restantes: ${salidasCount} (debe ser 0)`);

        const carritosCount = await db.collection('carritos').countDocuments();
        console.log(`✅ Carritos restantes: ${carritosCount} (debe ser 0)`);

        const reservasCount = await db.collection('reservas').countDocuments();
        console.log(`✅ Reservas restantes: ${reservasCount} (debe ser 0)`);

        console.log('\n════════════════════════════════════════');
        console.log('✅ LIMPIEZA COMPLETADA EXITOSAMENTE');
        console.log('════════════════════════════════════════\n');

        console.log('🎯 Próximos pasos:');
        console.log('   1. Reinicia el backend (npm start)');
        console.log('   2. Login como admin');
        console.log('   3. Panel Admin → Gestionar Salidas');
        console.log('   4. Crea nuevas salidas manualmente\n');

        await mongoose.disconnect();
        console.log('Desconectado de MongoDB\n');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

limpiarTodo();
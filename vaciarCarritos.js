const mongoose = require('mongoose');
require('dotenv').config();

const vaciarCarritos = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);

        console.log('\n🗑️  Vaciando carritos...\n');

        const db = mongoose.connection.db;
        
        // Mostrar carritos antes
        const carritosBefore = await db.collection('carritos').find({}).toArray();
        console.log(`📊 Carritos encontrados: ${carritosBefore.length}`);
        
        if (carritosBefore.length > 0) {
            carritosBefore.forEach((carrito, index) => {
                console.log(`\nCarrito ${index + 1}:`);
                console.log(`  ID: ${carrito._id}`);
                console.log(`  Usuario: ${carrito.usuario}`);
                console.log(`  Items: ${carrito.items ? carrito.items.length : 0}`);
                console.log(`  Total: $${carrito.totalGeneral || 0}`);
            });
        }

        // ELIMINAR TODOS
        const result = await db.collection('carritos').deleteMany({});
        
        console.log(`\n✅ Carritos eliminados: ${result.deletedCount}\n`);

        // Verificar
        const carritosAfter = await db.collection('carritos').countDocuments();
        console.log(`📊 Carritos restantes: ${carritosAfter} (debe ser 0)\n`);

        if (carritosAfter === 0) {
            console.log('✅ ÉXITO: Todos los carritos eliminados\n');
            console.log('🎯 Ahora:');
            console.log('   1. Recarga el frontend (F5)');
            console.log('   2. El carrito debe mostrar 0\n');
        } else {
            console.log('⚠️  Aún quedan carritos. Intenta de nuevo.\n');
        }

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

vaciarCarritos();

const Excursion = require('./../models/excursionModel');
const Personaje = require('./../models/personajeModel');
const Rol = require('./../models/rolModel');
const Usuario = require('./../models/usuarioModel');

const excursionData = require('./../data/DataLugares.json');
const personajeData = require('./../data/DataPersona.json');

const logger = require('./logger');

async function initDB() {
  try {
    logger.info('═══════════════════════════════════════');
    logger.info(' Inicializando Base de Datos');
    logger.info('═══════════════════════════════════════');

    // ==========================================
    // 1. ROLES
    // ==========================================
    const rolesCount = await Rol.countDocuments();

    if (rolesCount === 0) {
      logger.info(' Creando roles...');

      await Rol.create([
        { nombre: 'usuario' },
        { nombre: 'admin' }
      ]);

      logger.info(' Roles creados: usuario, admin');
    } else {
      logger.info(` Roles ya existen (${rolesCount})`);
    }

    // ==========================================
    // 2. USUARIO ADMIN
    // ==========================================
    const adminExiste = await Usuario.findOne({ email: 'admin@turismo.com' });

    if (!adminExiste) {
      logger.info(' Creando usuario admin...');

      const rolAdmin = await Rol.findOne({ nombre: 'admin' });

      await Usuario.create({
        nombre: 'Admin',
        apellido: 'Sistema',
        email: 'admin@turismo.com',
        contraseña: 'admin123',
        rol: rolAdmin._id
      });

      logger.info(' Usuario admin creado: admin@turismo.com / admin123');
    } else {
      logger.info(' Usuario admin ya existe');
    }

    // ==========================================
    // 3. PERSONAJES
    // ==========================================
    const personajesCount = await Personaje.countDocuments();

    if (personajesCount === 0) {
      logger.info(' Cargando personajes...');
      await Personaje.insertMany(personajeData);
      logger.info(` Personajes cargados: ${personajeData.length}`);
    } else {
      logger.info(` Personajes ya existen (${personajesCount})`);
    }

    // ==========================================
    // 4. EXCURSIONES
    // ==========================================
    const excursionesCount = await Excursion.countDocuments();

    if (excursionesCount === 0) {
      logger.info(' Cargando excursiones...');

      // Limpiar los horarios del JSON (ya no se usan en el modelo)
      const excursionesLimpias = excursionData.map(exc => {
        const { horarios, ...excursionSinHorarios } = exc;
        return excursionSinHorarios;
      });

      await Excursion.insertMany(excursionesLimpias);
      logger.info(` Excursiones cargadas: ${excursionesLimpias.length}`);
    } else {
      logger.info(` Excursiones ya existen (${excursionesCount})`);
    }



    logger.info('═══════════════════════════════════════');
    logger.info(' Inicialización completada');
    logger.info('═══════════════════════════════════════');

  } catch (error) {
    logger.error(' Error al inicializar la base de datos:', error);
  }
}

module.exports = initDB;
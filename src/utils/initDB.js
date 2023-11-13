
const Excursion = require('./../models/excursionModel');
const Personaje = require ('./../models/personajeModel');
const Usuario = require ('./../models/usuarioModel');


const excursionData = require('./../data/DataLugares.json');  
const personajeData = require('./../data/DataPersona.json');  

const logger = require('./logger');

async function initDB() {
  try {
  
    // Borrar todos los documentos existentes en la colección de excursiones
    await Excursion.deleteMany({});
    await Personaje.deleteMany({});
  // await Usuario.deleteMany({});

    // Insertar las nuevas excursiones desde el JSON
    await Excursion.insertMany(excursionData);
await Personaje.insertMany(personajeData);
    logger.info('Se cargaron los datos correctamente.');
  } catch (error) {
    logger.error('Error al inicializar la base de datos:', error);
  } 
}

module.exports = initDB;
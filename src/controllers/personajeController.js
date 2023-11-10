const Personaje = require('../models/personajeModel');

async function obtenerPersonajes(req, res) {
  try {
    const personajes = await Personaje.find();
    res.json(personajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personajes' });
  }
}

async function crearPersonaje(req, res) {
  const { nombre, descripcion, img } = req.body;

  try {
    const nuevoPersonaje = new Personaje({ nombre, descripcion, img });
    await nuevoPersonaje.save();
    res.json(nuevoPersonaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear un nuevo personaje' });
  }
}

module.exports = {
  obtenerPersonajes,
  crearPersonaje
};

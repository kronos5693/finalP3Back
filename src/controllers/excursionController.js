const Excursion = require('../models/excursionModel');

exports.obtenerExcursiones = async (req, res) => {
    try {
        const excursiones = await Excursion.find();
        res.json(excursiones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener excursiones' });
    }
};

exports.crearExcursion = async (req, res) => {
    try {
        const { excursion, provincia, localidad, descripcion, precio, img } = req.body;

        // Verificar si la excursión ya existe
        const existeExcursion = await Excursion.findOne({ excursion });
        if (existeExcursion) {
            return res.status(400).json({ mensaje: 'La excursión ya existe' });
        }

        // Crear la nueva excursión
        const nuevaExcursion = new Excursion({ excursion, provincia, localidad, descripcion, precio, img });
        await nuevaExcursion.save();

        res.status(201).json({ mensaje: 'Excursión creada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear excursión' });
    }
};

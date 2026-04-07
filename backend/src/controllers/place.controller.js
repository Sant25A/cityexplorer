const Place = require('../models/Place');

exports.createPlace = async (req, res) => {
    try {
        const { name, description, category, location } = req.body;

        // 1. Validación básica
        if (!name || !description || !category || !location) {
            return res.status(400).json({
                message: 'Nombre, descripción, categoría y ubicación son obligatorios'
            });
        }

        // 2. Crear objeto
        const newPlace = new Place({
            name,
            description,
            category,
            location,
            user: req.user.id
        });

        // 3. Guardar en DB
        const savedPlace = await newPlace.save();

        // 4. Respuesta
        res.status(201).json({
            message: 'Lugar creado correctamente',
            place: savedPlace
        });

    } catch (error) {
        console.error('Error al crear lugar:', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

exports.getPlaces = async (req, res) => {
    try {
        const { category } = req.query;

        let filter = {};

        if (category) {
            filter.category = category;
        }

        const places = await Place.find(filter)
            .populate('user', 'username');


        res.status(200).json({
            count: places.length,
            places
        })
    } catch (error) {
        console.error('Error al obtener lugares: ', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
}
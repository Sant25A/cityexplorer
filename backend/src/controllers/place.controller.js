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

exports.getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;

        const place = await Place.findById(id)
        .populate('user', 'username');

        // Si no se encuentra el lugar
        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // Respuesta
        res.status(200).json({
            place
        });
    } catch (error) {
        console.error('Error al obtener lugar: ', error);

        // ID inválido
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'ID inválido'
            });
        }

        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};
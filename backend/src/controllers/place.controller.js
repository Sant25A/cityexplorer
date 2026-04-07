const Place = require('../models/Place');

// Crear nuevo lugar
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

// Obtener lugares (con filtro opcional por categoría)
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

// Buscar lugar por ID
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

// Actualización de lugar
exports.updatePlace = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar el lugar
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // 2. Verificar que el usuario sea el dueño
        if (place.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para actualizar este lugar'
            });
        }

        // 3. Actualizar campos permitidos
        const { name, description, category, location } = req.body;

        if (name) place.name = name;
        if (description) place.description = description;
        if (category) place.category = category;
        if (location) place.location = location;

        // 4. Guardar cambios
        const updatedPlace = await place.save();

        res.status(200).json({
            message: 'Lugar actualizado correctamente',
            place: updatedPlace
        });
    } catch (error) {
        console.error('Error al actualizar lugar: ', error);

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

// Eliminar lugar
exports.deletePlace = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar lugar
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // 2. Validar dueño
        if (place.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar este lugar'
            });
        }

        // 3. Eliminar
        await place.deleteOne();

        res.status(200).json({
            message: 'Lugar eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar lugar: ', error);

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
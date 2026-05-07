const Place = require('../models/Place');
const { VALID_CATEGORIES } = require('../utils/constants');
const cloudinary = require('../config/cloudinary');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');

// Crear nuevo lugar
exports.createPlace = async (req, res) => {
    console.log('Body recibidos:', req.body); 
    console.log('Archivos recibidos:', req.files); 

    try {
        const { name, description, category, address, city, lat, lng } = req.body;

        // Validaciones
        if (!name?.trim() || !description.trim() || !category || !address?.trim() || !city?.trim()) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        if (name.length > 100) {
            return res.status(400).json({
                message: 'El nombre no puede exceder los 100 caracteres'
            });
        }

        if (description.length > 1000) {
            return res.status(400).json({
                message: 'La descripción es demasiado larga (máximo 1000 caracteres)'
            });
        }

        if (!address || !city || !lat || !lng) {
            return res.status(400).json({
                message: 'Ubicación incompleta'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'Debes subir al menos una imagen'
            });
        }

        // Límite de lugares por usuario
        const count = await Place.countDocuments({ user: req.user.id });

        if (count >= 10) {
            return res.status(400).json({
                message: 'Has alcanzado el límite de 10 lugares. Elimina algunos para crear nuevos.'
            });
        }

        let images = [];

        // Subir imágenes si existen
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'cityexplorer',

                            // Optimización de imágenes
                            transformation: [
                                { width: 800, height: 600, crop: 'limit' },
                                { quality: 'auto', fetch_format: 'auto' }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve({
                                url: result.secure_url,
                                public_id: result.public_id
                            });
                        }
                    );

                    stream.end(file.buffer);
                });
            });

            images = await Promise.all(uploadPromises);
        }

        // 2. Crear objeto
        const newPlace = new Place({
            name,
            description,
            category,
            location: {
                address,
                city,
                lat,
                lng
            },
            user: req.user.id,
            images
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
        const { category, page = 1, limit = 10, sort, search } = req.query;

        let filter = {};

        // Filtro por categoría
        if (category) {
            if (!VALID_CATEGORIES.includes(category)) {
                return res.status(400).json({
                    message: 'Categoría no válida'
                });
            }
            filter.category = category;
        }

        // Filtro por ubicación (búsqueda parcial, insensible a mayúsculas)
        if (req.query.location) {
            filter.location = { $regex: req.query.location, $options: 'i' };
        }

        // Busqueda por texto
        if (search) {
            filter.$text = { $search: search };
        }

        // Paginación
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Ordenamiento
        let sortOption = {};

        if (sort === 'rating') {
            sortOption = { averageRating: -1 }; // Mejores primero
        } else if (sort === 'newest') {
            sortOption = { createdAt: -1 }; // Más recientes
        } else if (sort === 'oldest') {
            sortOption = { createdAt: 1 }; // Más antiguos
        } else {
            sortOption = { createdAt: -1 }; // Por defecto, más recientes
        }

        const places = await Place.find(filter)
            .select('name description category location averageRating createdAt images')
            .populate('user', 'username')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const total = await Place.countDocuments(filter);

        res.status(200).json({
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / limitNumber),
            count: places.length,
            places
        });

    } catch (error) {
        console.error('Error al obtener lugares: ', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

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

// Obtener lugares por usuario autenticado
exports.getMyPlaces = async (req, res) => {
    try {
        const places = await Place.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: places.length,
            places
        });
    } catch (error) {
        console.error('Error al obtener mis lugares:', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

// Actualización de lugar
exports.updatePlace = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, category, location } = req.body;

        // 1. Buscar el lugar
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // 2. Validaciones 
        if (category && !VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                message: 'Categoría inválida'
            });
        }

        if (name && name.length > 100) {
            return res.status(400).json({
                message: 'Nombre demasiado largo'
            });
        }

        if (description && description.length > 1000) {
            return res.status(400).json({
                message: 'Descripción demasiado larga'
            });
        }

        // 3. Verificar que el usuario sea el dueño
        if (place.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para actualizar este lugar'
            });
        }

        // 4. Actualizar campos permitidos luego de validar
        if (name) place.name = name;
        if (description) place.description = description;
        if (category) place.category = category;
        if (location) place.location = location;

        // 5. Guardar cambios
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

// Eliminación de lugar
exports.deletePlace = async (req, res) => {
    try {
        const { id } = req.params;

        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // Validar dueño
        if (place.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar este lugar'
            });
        }

        // 1. Eliminar imágenes de Cloudinary
        const deleteImages = place.images.map(img =>
            cloudinary.uploader.destroy(img.public_id)
        );

        await Promise.all(deleteImages);

        // 2. Eliminar reviews
        await Review.deleteMany({ place: id });

        // 3. Eliminar favoritos
        await Favorite.deleteMany({ place: id });

        // 4. Eliminar lugar
        await place.deleteOne();

        res.status(200).json({
            message: 'Lugar eliminado completamente'
        });

    } catch (error) {
        console.error('Error al eliminar lugar:', error);

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
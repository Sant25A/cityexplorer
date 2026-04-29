const Favorite = require('../models/Favorite');
const Place = require('../models/Place');

// Toggle favorito (agregar / quitar)
exports.toggleFavorite = async (req, res) => {
    try {
        const { placeId } = req.body;

        if (!placeId) {
            return res.status(400).json({
                message: 'placeId es obligatorio'
            });
        }

        // Verificar que el lugar exista
        const place = await Place.findById(placeId);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // Buscar si ya existe
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            place: placeId
        });

        // Toggle
        if (existingFavorite) {
            await existingFavorite.deleteOne();

            return res.status(200).json({
                message: 'Favorito eliminado',
                isFavorite: false
            });
        }

        // Crear favorito
        const favorite = new Favorite({
            user: req.user.id,
            place: placeId
        });

        await favorite.save();

        res.status(201).json({
            message: 'Favorito agregado',
            isFavorite: true,
            favorite
        });

    } catch (error) {
        console.error('Error en favoritos:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Ya existe este favorito'
            });
        }

        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

// Listar favoritos del usuario
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .populate({
                path: 'place',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            });

        res.status(200).json({
            count: favorites.length,
            favorites
        });

    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};
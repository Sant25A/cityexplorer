const User = require('../models/User');
const Place = require('../models/Place');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const cloudinary = require('../config/cloudinary');

// Listar a todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error admin al obtener usuarios:', error);
        res.status(500).json({ message: 'Error del servidor al obtener usuarios' });
    }
};

// Listar a todos los lugares
exports.getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(places);
    } catch (error) {
        console.error('Error admin al obtener lugares:', error);
        res.status(500).json({ message: 'Error del servidor al obtener lugares' });
    }
};

// Borrado de lugar en cascada (reviews, favoritos, imágenes)
exports.deletePlaceByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar primero el lugar para extraer la información de las imágenes
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({ 
                message: 'El lugar no existe o ya fue eliminado' 
            });
        }

        // 2. Limpiar imágenes de Cloudinary (Usa la estructura segura del public_id)
        if (place.images && place.images.length > 0) {
            const deleteImagesPromises = place.images.map(img =>
                cloudinary.uploader.destroy(img.public_id)
            );
            await Promise.all(deleteImagesPromises);
        }

        // 3. Eliminar todas las reviews asociadas a este destino
        await Review.deleteMany({ place: id });

        // 4. Limpiar los favoritos de todos los usuarios que guardaron este lugar
        await Favorite.deleteMany({ place: id });

        // 5. Eliminar el registro del lugar de la base de datos
        await place.deleteOne();

        res.status(200).json({ 
            message: 'Destino y todos sus elementos asociados eliminados en cascada correctamente' 
        });

    } catch (error) {
        console.error('Error de administrador al eliminar lugar en cascada:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'El ID proporcionado no tiene un formato válido'
            });
        }

        res.status(500).json({ 
            message: 'Error del servidor al procesar la eliminación en cascada' 
        });
    }
};
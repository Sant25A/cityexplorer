const Review = require('../models/Review');
const Place = require('../models/Place');

// Crear reseña
exports.createReview = async (req, res) => {
    try {
        const { placeId, rating, comment } = req.body;

        // 1. Validaciones básicas
        if (!placeId || !rating || !comment?.trim()) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'La calificación debe estar entre 1 y 5'
            });
        }

        // 2. Verificar que el lugar exista
        const place = await Place.findById(placeId);

        if (!place) {
            return res.status(404).json({
                message: 'Lugar no encontrado'
            });
        }

        // 3. Verificar si ya existe review
        const existingReview = await Review.findOne({
            user: req.user.id,
            place: placeId
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'Ya has dejado una reseña para este lugar'
            });
        }

        // 4. Crear review
        const review = new Review({
            user: req.user.id,
            place: placeId,
            rating,
            comment
        });

        await review.save();

        // 5. Actualizar promedio
        const reviews = await Review.find({ place: placeId });

        const avg =
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

        place.averageRating = avg;
        await place.save();

        res.status(201).json({
            message: 'Reseña creada correctamente',
            review
        });

    } catch (error) {
        console.error('Error al crear review:', error);

        // Error por índice único
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Ya existe una reseña para este lugar'
            });
        }

        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};

exports.getReviewsByPlace = async (req, res) => {
    try {
        const { placeId } = req.params;

        const reviews = await Review.find({ place: placeId })
            .populate('user', 'username');

        res.status(200).json({
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error('Error al obtener reviews:', error);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
};
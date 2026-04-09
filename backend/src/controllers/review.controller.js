const Review = require('../models/Review');
const Place = require('../models/Place');

// Calculo de promedio de calificaciones
const calculateAverageRating = async (placeId) => {
    const reviews = await Review.find({ place: placeId });
    if (reviews.length === 0) {
        return 0;
    }

    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    return avg;
}

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
        place.averageRating = await calculateAverageRating(placeId);
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

// Obtener reviews por lugar
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

// Editar reseña
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: 'Reseña no encontrada'
            });
        }

        // Verificar que el usuario sea el autor
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para editar esta reseña'
            });
        }

        // Validaciones
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                message: 'Rating inválido'
            });
        }

        if (comment && comment.length > 500) {
            return res.status(400).json({
                message: 'Comentario demasiado largo'
            });
        }

        // Actualizar reseña
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();

        // Recalcular rating del lugar
        const place = await Place.findById(review.place);
        place.averageRating = await calculateAverageRating(review.place);
        await place.save();

        res.status(200).json({
            message: 'Reseña actualizada correctamente',
            review
        });
    } catch (error) {
        console.error('Error al actualizar review:', error);

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

// Eliminar reseña
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                message: 'Reseña no encontrada'
            });
        }

        // Verificar que el usuario sea el autor
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'No tienes permiso para eliminar esta reseña'
            });
        }

        const placeId = review.place;

        await review.deleteOne();

        // Recalcular rating del lugar
        const place = await Place.findById(placeId);
        place.averageRating = await calculateAverageRating(placeId);
        await place.save();

        res.status(200).json({
            message: 'Reseña eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar review:', error);

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
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'El comentario es obligatorio'],
      maxlength: 500,
    },
    rating: {
      type: Number,
      required: [true, 'La calificación es obligatoria'],
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
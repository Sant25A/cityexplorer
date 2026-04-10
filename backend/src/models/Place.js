const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      maxlength: 1000,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: [
        'cafe',
        'restaurante',
        'parque',
        'bar',
        'museo',
        'hotel',
        'tienda',
        'atraccion',
        'naturaleza',
        'otro'
      ]
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'La ubicación es obligatoria'],
    },
    // location: {
    //   name: {
    //     type: String,
    //     required: true,
    //   },
    //   lat: {
    //     type: Number,
    //     required: true,
    //   },
    //   lng: {
    //     type: Number,
    //     required: true,
    //   }
    // },
    images: [
      {
        type: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Búsqueda de texto
placeSchema.index({
  name: 'text',
  description: 'text',
  location: 'text'
});

// Filtros y ordenamiento
placeSchema.index({ category: 1 });
placeSchema.index({ createdAt: -1 });
placeSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Place', placeSchema);
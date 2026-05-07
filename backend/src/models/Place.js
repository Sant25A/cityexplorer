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
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      }
    },
    images: [
      {
        url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: true
        }
      }
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

placeSchema.index({
  name: 'text',
  description: 'text',
  "location.address": 'text',
  "location.city": 'text'
});

// Filtros y ordenamiento
placeSchema.index({ category: 1 });
placeSchema.index({ createdAt: -1 });
placeSchema.index({ averageRating: -1 });
placeSchema.index({ "location.lat": 1, "location.lng": 1 });

module.exports = mongoose.model('Place', placeSchema);
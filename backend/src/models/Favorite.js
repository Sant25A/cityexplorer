const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Evita duplicados (un usuario no puede guardar el mismo lugar dos veces)
favoriteSchema.index({ user: 1, place: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
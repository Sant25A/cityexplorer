const multer = require('multer');

// Guardamos en memoria (no en disco)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB máximo por imagen
    },
    fileFilter
});

module.exports = upload;
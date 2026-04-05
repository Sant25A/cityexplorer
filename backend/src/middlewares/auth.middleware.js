const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        let token;

        //  1. Vericicar si hay header Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            // 2. Extraer token
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Guardar info del usuario en request
            req.user = decoded;

            next();
        } else {
            return res.status(401).json({
                message: "No autorizado, token no encontrado"
            });
        }   
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(401).json({
            message: "Token inválido"
        });
    }
};

module.exports = protect;
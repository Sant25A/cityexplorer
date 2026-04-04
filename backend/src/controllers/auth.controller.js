const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Validación básica
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        // 2. Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: 'El usuario ya existe'
            });
        }

        // 3. Crear el usuario
        const newUser = new User({
            username,
            email, 
            password 
        });

        // 4. Guardar en DB
        await newUser.save();

        // 5. Respuesta
        res.status(201).json({
            message: "Usuario registrado correctamente"
        });
        
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({
            message: "Error del servidor"
        });
    }
};
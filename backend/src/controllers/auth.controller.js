const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validación básica
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios'
      });
    }

    // 2. Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Credenciales inválidas'
      });
    }

    // 3. Comparar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Credenciales inválidas'
      });
    }

    // 4. Respuesta temporal (SIN JWT aún)
    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
};
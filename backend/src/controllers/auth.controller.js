const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { captcha } = req.body;

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

    // Validación de captcha
    const captchaVerify = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captcha
        }
      }
    );

    if (!captchaVerify.data.success) {
      return res.status(400).json({
        message: 'Captcha inválido'
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

    // 4. Generar JWT ( Agregamos el rol al payload del Token)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || 'user' 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Respuesta con token (Incluimos el rol en el objeto del usuario)
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user' 
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      message: 'Error del servidor'
    });
  }
};
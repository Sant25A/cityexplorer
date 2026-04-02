const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Intentamos conectar con un tiempo de espera más corto para no esperar años
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 
    });
    console.log('🟢 MongoDB Atlas conectado exitosamente');
  } catch (error) {
    if (error.message.includes('Authentication failed')) {
      console.error('🔴 Error: Usuario o contraseña incorrectos en el .env');
    } else {
      console.error('🔴 Error de RED/DNS: Tu internet está bloqueando la conexión a Atlas.');
      console.error('👉 Intenta usar los DNS de Google (8.8.8.8) o conectarte a tus datos móviles.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

dotenv.config();

const connectDB = require('./src/config/db');
connectDB();

const app = express();

// Middlewares base
app.use(express.json());

// CORS
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: {
    message: 'Demasiadas solicitudes, intenta más tarde'
  }
});

app.use('/api', limiter);

// Logs
app.use(morgan('dev'));

// Rutas
app.use('/api', require('./src/routes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API CityExplorer funcionando');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
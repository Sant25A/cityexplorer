const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const User = require('./src/models/User');
const Place = require('./src/models/Place');
const Favorite = require('./src/models/Favorite');
const Review = require('./src/models/Review');

dotenv.config();

const connectDB = require('./src/config/db');

connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/api', require('./src/routes'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API CityExplorer funcionando 🚀');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});



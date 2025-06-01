const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('../docs/openapi.yaml');
const authRouter = require('./routes/auth');
require('dotenv').config();

const app = express();

// 1) Conectar ao MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:1234@localhost:27017/eu_digital?authSource=admin';
mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 2) Middleware para json
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 3) Rotas
app.use('/api/ingest', require('./routes/ingest'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/texts', require('./routes/texts'));
app.use('/api/academicResults', require('./routes/academicResults'));
app.use('/api/sportResults', require('./routes/sportResults'));
app.use('/api/files', require('./routes/files'));
app.use('/api/events', require('./routes/events'));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/auth', authRouter);

module.exports = app;


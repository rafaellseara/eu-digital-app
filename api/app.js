const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');
const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
require('dotenv').config();

const app = express();

// (a) Conectar ao MongoDB
const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:1234@mongo:27017/eu_digital?authSource=admin';
console.log('🔗 URI usada para ligar ao Mongo:', MONGO_URL);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  '/api/photos/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'Photo';
    next();
  },
  commentsRouter
);

app.use(
  '/api/texts/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'Text';
    next();
  },
  commentsRouter
);

app.use(
  '/api/academicResults/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'AcademicResult';
    next();
  },
  commentsRouter
);

app.use(
  '/api/sportResults/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'SportResult';
    next();
  },
  commentsRouter
);

app.use(
  '/api/files/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'File';
    next();
  },
  commentsRouter
);

app.use(
  '/api/events/:resourceId/comments',
  (req, res, next) => {
    req.resourceType = 'Event';
    next();
  },
  commentsRouter
);

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

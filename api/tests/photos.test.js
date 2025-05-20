const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let mongod;

beforeAll(async () => {
  // Inicializa MongoDB em memória
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URL = uri;
  app = require('../app'); 
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Photos API', () => {
  let createdId;

  it('POST  /api/photos → deve criar uma photo', async () => {
    const res = await request(app)
      .post('/api/photos')
      .send({
        id: '11111111-1111-1111-1111-111111111111',
        author: 'tester',
        type: 'Photo',
        visibility: 'public',
        tags: ['tag1'],
        format: 'JPEG'
      })
      .expect(201);
    expect(res.body).toHaveProperty('id', '11111111-1111-1111-1111-111111111111');
    createdId = res.body.id;
  });

  it('GET   /api/photos → deve listar as photos', async () => {
    const res = await request(app)
      .get('/api/photos')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET   /api/photos/:id → deve retornar a photo criada', async () => {
    const res = await request(app)
      .get(`/api/photos/${createdId}`)
      .expect(200);
    expect(res.body).toHaveProperty('id', createdId);
  });

  it('PUT   /api/photos/:id → deve atualizar a photo', async () => {
    const res = await request(app)
      .put(`/api/photos/${createdId}`)
      .send({ caption: 'Updated!' })
      .expect(200);
    expect(res.body).toHaveProperty('caption', 'Updated!');
  });

  it('DELETE /api/photos/:id → deve remover a photo', async () => {
    await request(app)
      .delete(`/api/photos/${createdId}`)
      .expect(204);
    await request(app)
      .get(`/api/photos/${createdId}`)
      .expect(404);
  });
});

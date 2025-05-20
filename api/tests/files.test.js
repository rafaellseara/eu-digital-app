const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app, mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri();
  app = require('../app');
  await mongoose.connect(process.env.MONGO_URL);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('SportResults API', () => {
  let createdId;

  it('POST  /api/sportResults → deve criar um resultado desportivo', async () => {
    const res = await request(app)
      .post('/api/sportResults')
      .send({
        id:           '44444444-4444-4444-8444-444444444444',
        author:       'tester',
        activity:     'running',
        value:        5.2,
        unit:         'km',
        activityDate: '2025-05-05T08:00:00Z'
      })
      .expect(201);
    expect(res.body).toHaveProperty('activity', 'running');
    createdId = res.body.id;
  });

  it('GET   /api/sportResults → deve listar resultados desportivos', async () => {
    const res = await request(app).get('/api/sportResults').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET   /api/sportResults/:id → deve retornar o resultado criado', async () => {
    const res = await request(app).get(`/api/sportResults/${createdId}`).expect(200);
    expect(res.body).toHaveProperty('unit', 'km');
  });

  it('PUT   /api/sportResults/:id → deve atualizar o resultado', async () => {
    const res = await request(app)
      .put(`/api/sportResults/${createdId}`)
      .send({ value: 6.0 })
      .expect(200);
    expect(res.body).toHaveProperty('value', 6.0);
  });

  it('DELETE /api/sportResults/:id → deve apagar o resultado', async () => {
    await request(app).delete(`/api/sportResults/${createdId}`).expect(204);
    await request(app).get(`/api/sportResults/${createdId}`).expect(404);
  });
});

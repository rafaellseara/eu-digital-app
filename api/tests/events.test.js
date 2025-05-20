// tests/events.test.js
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

describe('Events API', () => {
  let createdId;

  it('POST  /api/events → deve criar um evento', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({
        id:           '66666666-6666-6666-8666-666666666666',
        author:       'tester',
        title:        'Test Event',
        startDate:    '2025-06-01T10:00:00Z',
        endDate:      '2025-06-01T12:00:00Z',
        participants: ['alice','bob'],
        description:  'Event for testing'
      })
      .expect(201);
    expect(res.body).toHaveProperty('title', 'Test Event');
    createdId = res.body.id;
  });

  it('GET   /api/events → deve listar eventos', async () => {
    const res = await request(app).get('/api/events').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET   /api/events/:id → deve retornar o evento criado', async () => {
    const res = await request(app).get(`/api/events/${createdId}`).expect(200);
    // Verifica propriedade principal que sempre existe
    expect(res.body).toHaveProperty('title', 'Test Event');
  });

  it('PUT   /api/events/:id → deve atualizar o evento', async () => {
    const res = await request(app)
      .put(`/api/events/${createdId}`)
      .send({ description: 'Updated event description' })
      .expect(200);
    expect(res.body).toHaveProperty('description', 'Updated event description');
  });

  it('DELETE /api/events/:id → deve apagar o evento', async () => {
    await request(app).delete(`/api/events/${createdId}`).expect(204);
    await request(app).get(`/api/events/${createdId}`).expect(404);
  });
});

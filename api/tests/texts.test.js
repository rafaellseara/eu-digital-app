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

describe('Texts API', () => {
  let createdId;

  it('POST  /api/texts → deve criar um texto', async () => {
    const res = await request(app)
      .post('/api/texts')
      .send({
        id:      '22222222-2222-4222-8222-222222222222',
        author:  'tester',
        content: 'This is a test text',
        title:   'Test Title',
        summary: 'Test summary',
      })
      .expect(201);
    expect(res.body).toHaveProperty('id', '22222222-2222-4222-8222-222222222222');
    createdId = res.body.id;
  });

  it('GET   /api/texts → deve listar os textos', async () => {
    const res = await request(app).get('/api/texts').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET   /api/texts/:id → deve retornar o texto criado', async () => {
    const res = await request(app).get(`/api/texts/${createdId}`).expect(200);
    expect(res.body).toHaveProperty('content', 'This is a test text');
  });

  it('PUT   /api/texts/:id → deve atualizar o texto', async () => {
    const res = await request(app)
      .put(`/api/texts/${createdId}`)
      .send({ summary: 'Updated summary' })
      .expect(200);
    expect(res.body).toHaveProperty('summary', 'Updated summary');
  });

  it('DELETE /api/texts/:id → deve apagar o texto', async () => {
    await request(app).delete(`/api/texts/${createdId}`).expect(204);
    await request(app).get(`/api/texts/${createdId}`).expect(404);
  });
});

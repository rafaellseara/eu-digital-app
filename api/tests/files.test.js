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

describe('Files API', () => {
  let createdId;

  it('POST  /api/files → deve criar um ficheiro', async () => {
    const res = await request(app)
      .post('/api/files')
      .send({
        id:           '55555555-5555-5555-8555-555555555555',
        author:       'tester',
        originalName: 'doc.pdf',
        size:         12345,
        format:       'pdf',
        description:  'Test doc'
      })
      .expect(201);
    expect(res.body).toHaveProperty('originalName', 'doc.pdf');
    createdId = res.body.id;
  });

  it('GET   /api/files → deve listar ficheiros', async () => {
    const res = await request(app).get('/api/files').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET   /api/files/:id → deve retornar o ficheiro criado', async () => {
    const res = await request(app).get(`/api/files/${createdId}`).expect(200);
    expect(res.body).toHaveProperty('format', 'pdf');
  });

  it('PUT   /api/files/:id → deve atualizar o ficheiro', async () => {
    const res = await request(app)
      .put(`/api/files/${createdId}`)
      .send({ description: 'Updated doc' })
      .expect(200);
    expect(res.body).toHaveProperty('description', 'Updated doc');
  });

  it('DELETE /api/files/:id → deve apagar o ficheiro', async () => {
    await request(app).delete(`/api/files/${createdId}`).expect(204);
    await request(app).get(`/api/files/${createdId}`).expect(404);
  });
});
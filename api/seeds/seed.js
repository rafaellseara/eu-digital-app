require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { fakerPT_PT: faker } = require('@faker-js/faker');

const User = require('../models/User');
const Comment = require('../models/Comment');
const Text = require('../models/Text');
const Event = require('../models/Event');
const AcademicResult = require('../models/AcademicResult');
const SportResult = require('../models/SportResult');
const File = require('../models/File');
const Photo = require('../models/Photo');

function getRandomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFriends(usernames, count = 2) {
  return faker.helpers.shuffle(usernames).slice(0, count);
}

async function seed() {
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:1234@localhost:27017/eu_digital?authSource=admin';
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Conectado ao MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    Text.deleteMany({}),
    Event.deleteMany({}),
    AcademicResult.deleteMany({}),
    SportResult.deleteMany({}),
    File.deleteMany({}),
    Photo.deleteMany({})
  ]);
  console.log('Coleções limpas');

  // Criar usuários
  const usersData = Array.from({ length: 30 }, () => ({
    id: uuidv4(),
    username: faker.internet.userName().toLowerCase(),
    email: faker.internet.email(),
    passwordHash: 'senha123',
    friends: []
  }));

  const createdUsers = await User.create(usersData);
  const usernames = createdUsers.map(u => u.username);
  console.log('Usuários criados');

  // Criar textos
  const textsData = createdUsers.map(user => ({
    id: uuidv4(),
    ownerId: user.id,
    author: user.username,
    type: 'Text',
    visibility: getRandomFrom(['public', 'friends', 'private']),
    tags: faker.lorem.words(2).split(' '),
    title: faker.lorem.sentence(3),
    content: faker.lorem.paragraphs(2),
    summary: faker.lorem.sentence(6)
  }));
  await Text.create(textsData);
  console.log('Textos criados');

  // Criar eventos
  const eventsData = createdUsers.map(user => {
    const start = faker.date.future();
    const end = new Date(start.getTime() + 1000 * 60 * 90);
    return {
      id: uuidv4(),
      ownerId: user.id,
      author: user.username,
      type: 'Event',
      visibility: getRandomFrom(['public', 'friends', 'private']),
      tags: faker.lorem.words(2).split(' '),
      title: faker.company.catchPhrase(),
      startDate: start,
      endDate: end,
      location: faker.location.city(),
      participants: getRandomFriends(usernames),
      description: faker.lorem.sentences(2),
      eventType: getRandomFrom(['Meeting', 'Social', 'Apresentação'])
    };
  });
  await Event.create(eventsData);
  console.log('Eventos criados');

  // Resultados Acadêmicos
  const academicResultsData = createdUsers.map(user => ({
    id: uuidv4(),
    ownerId: user.id,
    author: user.username,
    type: 'AcademicResult',
    visibility: getRandomFrom(['public', 'friends', 'private']),
    tags: ['nota', 'universidade'],
    institution: faker.company.name(),
    course: faker.person.jobArea(),
    grade: `${faker.number.float({ min: 10, max: 20, precision: 0.2 })}/20`,
    scale: '20',
    evaluationDate: faker.date.past()
  }));
  await AcademicResult.create(academicResultsData);
  console.log('Resultados acadêmicos criados');

  // Resultados Esportivos
  const sportResultsData = createdUsers.map(user => ({
    id: uuidv4(),
    ownerId: user.id,
    author: user.username,
    type: 'SportResult',
    visibility: getRandomFrom(['public', 'friends']),
    tags: faker.lorem.words(2).split(' '),
    activity: getRandomFrom(['Corrida', 'Natação', 'Ciclismo']) + ' ' + faker.number.int({ min: 1, max: 10 }) + 'km',
    value: faker.number.int({ min: 15, max: 60 }),
    unit: 'minutos',
    location: faker.location.city(),
    activityDate: faker.date.recent()
  }));
  await SportResult.create(sportResultsData);
  console.log('Resultados esportivos criados');

  // Arquivos
  const filesData = createdUsers.map(user => ({
    id: uuidv4(),
    ownerId: user.id,
    author: user.username,
    type: 'File',
    visibility: getRandomFrom(['public', 'private']),
    tags: ['arquivo', faker.lorem.word()],
    originalName: faker.system.fileName(),
    size: faker.number.int({ min: 1024, max: 10_000_000 }),
    format: faker.system.fileExt(),
    description: faker.lorem.sentence()
  }));
  await File.create(filesData);
  console.log('Arquivos criados');

  // Fotos
  const dummyBuffer = Buffer.from('');
  const photosData = createdUsers.map(user => ({
    id: uuidv4(),
    ownerId: user.id,
    author: user.username,
    type: 'Photo',
    visibility: getRandomFrom(['public', 'friends']),
    tags: ['foto', faker.word.words(1)],
    resolution: { width: 1280, height: 720 },
    format: getRandomFrom(['jpeg', 'png']),
    location: {
      lat: faker.location.latitude(),
      lon: faker.location.longitude(),
      description: faker.location.city()
    },
    caption: faker.lorem.sentence(),
    data: dummyBuffer
  }));
  await Photo.create(photosData);
  console.log('Fotos criadas');

  // Comentários
  const commentsData = [
    {
      id: uuidv4(),
      resourceType: 'Text',
      resourceId: textsData[0].id,
      author: usernames[1],
      content: faker.lorem.sentence()
    },
    {
      id: uuidv4(),
      resourceType: 'Event',
      resourceId: eventsData[1].id,
      author: usernames[2],
      content: faker.lorem.sentence()
    }
  ];
  await Comment.create(commentsData);
  console.log('Comentários criados');

  await mongoose.disconnect();
  console.log('Seeding finalizado e conexão encerrada');
}

seed().catch(err => {
  console.error('Erro durante seed:', err);
  mongoose.disconnect();
});

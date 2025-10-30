import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {
  beforeAll(async () => {
    await testServer.start();
  });

  afterAll(() => {
    testServer.close();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  const todo1 = { text: 'Hola Mundo 1' };
  const todo2 = { text: 'Hola Mundo 2' };

  test('should return TODOs api/todos', async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });
    const { body } = await request(testServer.app)
      .get('/api/todos')
      .expect(200);

    expect(body).toBeInstanceOf(Array);
    expect(body.length).toBe(2);
    expect(body[0].text).toBe(todo1.text);
    expect(body[1].text).toBe(todo2.text);
    expect(body[0].completedAt).toBeNull();
  });

  test('should return a TODO api/todos/:id', async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app).get('/api/todos');
    const { body: bodyID } = await request(testServer.app).get(
      `/api/todos/${body[0].id}`
    );

    expect(bodyID).toEqual({
      id: body[0].id,
      text: todo1.text,
      completedAt: body[0].completedAt,
    });
  });

  test('should return a 404 NotFound api/todos/:id', async () => {
    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const todoId = 999;
    const { body } = await request(testServer.app)
      .get(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return a new Todo api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send(todo1)
      .expect(201);

    expect(body).toEqual({
      id: expect.any(Number),
      text: todo1.text,
      completedAt: null,
    });
  });

  test('should return an error if text is present api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required.' });
  });

  test('should return an error if text is empty api/todos', async () => {
    const { body } = await request(testServer.app)
      .post('/api/todos')
      .send({ text: '' })
      .expect(400);

    expect(body).toEqual({ error: 'Text property is required.' });
  });

  test('should return an updated TODO api/todos/:id', async () => {
    const textUpdated = 'Updated';
    const completedAtUpdated = '2025-10-31';

    await prisma.todo.createMany({
      data: [todo1, todo2],
    });

    const { body } = await request(testServer.app).get('/api/todos');
    const { body: bodyUpdated } = await request(testServer.app)
      .put(`/api/todos/${body[0].id}`)
      .send({ text: textUpdated, completedAt: completedAtUpdated });

    expect(bodyUpdated).toEqual({
      id: body[0].id,
      text: textUpdated,
      completedAt: '2025-10-31T00:00:00.000Z',
    });
  });

  test('should return 404 if TODO not found', async () => {
    const id = 999;
    const { body } = await request(testServer.app)
      .put(`/api/todos/${id}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${id} not found` });
  });

  test('should return an updated TODO only the date', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const dataUpdated = '2024-10-13';

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ completedAt: dataUpdated })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo1.text,
      completedAt: '2024-10-13T00:00:00.000Z',
    });
  });

  test('should return an updated TODO only text', async () => {
    const todo = await prisma.todo.create({ data: todo1 });
    const textUpdated = 'Vamos a la playa oh oh oh!';

    const { body } = await request(testServer.app)
      .put(`/api/todos/${todo.id}`)
      .send({ text: textUpdated })
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: textUpdated,
      completedAt: null,
    });
  });

  test('should delete a TODO api/todos/:id', async () => {
    const todo = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todo.id}`)
      .expect(200);

    expect(body).toEqual({
      id: todo.id,
      text: todo.text,
      completedAt: todo.completedAt,
    });
  });

  test('should return 404 if TODO do not exist api/todos/:id', async () => {
    const todoId = 999;

    const { body } = await request(testServer.app)
      .delete(`/api/todos/${todoId}`)
      .expect(404);

    expect(body).toEqual({ error: `Todo with id ${todoId} not found` });
  });

  test('should return index.html to any url', async () => {
    const { body } = await request(testServer.app).get('/pepe').expect(200);

    expect(body).toEqual({});
  });

  test('should error an update TODO api/todos/:id', async () => {
    const { body } = await request(testServer.app)
      .put(`/api/todos/id`)
      .expect(400);

    expect(body).toEqual({ error: 'id must be a valid number' });
  });

  test('should error 500', async () => {
    const { body } = await request(testServer.app)
      .get('/api/todos/id')
      .expect(500);

    expect(body).toEqual({ error: 'Internal server error - check logs' });
  });
});

const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');

// Simulamos (mock) el modelo Task para no tocar tu MongoDB Atlas real durante los tests
jest.mock('../models/Task');

describe('Endpoints de todo-api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health responde 200 con status UP', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /tasks devuelve la lista de tareas simuladas', async () => {
    const fakeTasks = [
      { _id: '65f200010000000000000001', title: 'Aprender Jest', completed: false },
    ];
    Task.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(fakeTasks),
    });

    const res = await request(app).get('/tasks');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeTasks);
  });

  it('GET /tasks/123 devuelve 400 si el ID no es un ObjectId válido', async () => {
    const res = await request(app).get('/tasks/123');

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('ID inválido');
  });

  it('POST /tasks crea una tarea y devuelve 201', async () => {
    const created = {
      _id: '65f200010000000000000099',
      title: 'Configurar GitHub Actions',
      completed: false,
    };
    Task.create.mockResolvedValue(created);

    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Configurar GitHub Actions' });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Configurar GitHub Actions');
  });
});
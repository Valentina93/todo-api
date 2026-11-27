const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

jest.mock('../models/User');

describe('Users API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /users devuelve la lista de usuarios', async () => {
    const mockUsers = [
      { _id: '1', name: 'Valentina', email: 'valen@example.com' }
    ];

    User.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockUsers)
    });

    const res = await request(app).get('/users');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  test('POST /users crea un usuario nuevo', async () => {
    const nuevo = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Valentina',
      email: 'valen@example.com'
    };

    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(nuevo)
    }));

    const res = await request(app)
      .post('/users')
      .send({ name: 'Valentina', email: 'valen@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('valen@example.com');
  });
});
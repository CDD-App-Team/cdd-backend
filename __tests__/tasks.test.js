const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Task = require('../lib/models/Task');

const mockUser = {
  email: 'test4@example.com',
  password: '123456',
};

const mockUser2 = {
  firstName: 'Test',
  lastName: 'User 2',
  email: 'test2@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });

  //sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('items', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('example test - delete me!', () => {
    expect(1).toEqual(1);
  });
  
  it('#POST /api/v1/tasks creates new tasks for the current user', async () => {
    const [agent, user] = await registerAndLogin();

    const newTask = {
      description: 'hydrate',
    };

    const resp = await agent.post('/api/v1/tasks').send(newTask);

    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      description: expect.any(String),
      completed: false,
    });
  });

});

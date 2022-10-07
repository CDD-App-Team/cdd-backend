const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Task = require('../lib/models/Task');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '12345',
};

const mockUser2 = {
  firstName: 'Test2',
  lastName: 'User2',
  email: 'test2@example.com',
  password: '12345',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
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

  it('#GET /api/v1/tasks returns all items associated with the authenticated User', async () => {
    // create a user
    const [agent, user] = await registerAndLogin();
    // add a second user with items
    const user2 = await UserService.create(mockUser2);
    const user1Task = await Task.insert({
      description: 'test task 1',
      user_id: user.id,
    });

    await Task.insert({
      description: 'test task 2',
      user_id: user2.id,
    });

    
    const resp = await agent.get('/api/v1/tasks');
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual([user1Task]);
    console.log('resp.body', resp.body);
  });

});

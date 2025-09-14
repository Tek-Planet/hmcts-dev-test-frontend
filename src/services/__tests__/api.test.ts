import { authApi, tasksApi, ApiError } from '../api';

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = { name: 'Test User', email: 'test@gov.uk' };
      
      const mockPayload = btoa(JSON.stringify({
        id: '1',
        name: mockUser.name,
        email: mockUser.email,
        exp: Date.now() / 1000 + 3600
      }));
      const mockToken = `header.${mockPayload}.signature`;

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ token: mockToken }),
        headers: new Headers(),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await authApi.login({
        email: 'test@gov.uk',
        password: 'password'
      });

      expect(result).toEqual({
        token: mockToken,
        user: mockUser
      });
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@gov.uk',
          password: 'password'
        }),
      });
    });

    it('should handle login failure', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
        headers: new Headers(),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await expect(authApi.login({
        email: 'wrong@gov.uk',
        password: 'wrongpass'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ message: 'User registered successfully' }),
        headers: new Headers(),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await authApi.register({
        name: 'Test User',
        email: 'test@gov.uk',
        password: 'password'
      });

      expect(result.message).toBe('User registered successfully');
    });
  });
});

describe('tasksApi', () => {
  const mockToken = 'fake-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          dueDateTime: '2024-01-01T12:00:00Z'
        }
      ];

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockTasks),
        headers: new Headers(),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await tasksApi.getTasks(mockToken);

      expect(result).toEqual(mockTasks);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
        },
      });
    });
  });

  describe('createTask', () => {
    it('should create task successfully', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Description',
        dueDateTime: '2024-01-01T12:00:00Z'
      };

      const mockCreatedTask = {
        id: '1',
        ...newTask,
        status: 'pending' as const
      };

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(mockCreatedTask),
        headers: new Headers(),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await tasksApi.createTask(mockToken, newTask);

      expect(result).toEqual(mockCreatedTask);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`,
        },
        body: JSON.stringify(newTask),
      });
    });
  });
});
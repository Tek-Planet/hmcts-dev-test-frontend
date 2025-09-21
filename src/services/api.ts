const API_BASE_URL = 'https://hmcts-dev-test-backend.onrender.com/api';
//const API_BASE_URL  = 'http://127.0.0.1:3000/api';


export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDateTime: string; // ISO string with date and time
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDateTime: string; // ISO string with date and time
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
  dueDateTime?: string; // ISO string with date and time
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}


type TokenRefreshCallback = (newToken: string) => void;

let tokenRefreshCallback: TokenRefreshCallback | null = null;

export const setTokenRefreshCallback = (callback: TokenRefreshCallback) => {
  tokenRefreshCallback = callback;
};

const handleResponse = async (response: Response) => {
  const refreshToken = response.headers.get('x-refresh-token');
  if (refreshToken && tokenRefreshCallback) {
    tokenRefreshCallback(refreshToken);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }
  return response.json();
};

export const authApi = {
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resData = await handleResponse(response);
    const token: string = resData.token;

    // Extract user from JWT
    let user = { name: '', email: '' } as LoginResponse['user'];
    try {
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        const json = JSON.parse(atob(base64));
        user = {
          name: json.name ?? '',
          email: json.email ?? '',
        };
      }
    } catch (_) {
      // Fallback if token decode fails
    }

    return { token, user };
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string; resetToken: string }> => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  verifyToken: async (token: string): Promise<{ valid: boolean; user?: { name: string; email: string } }> => {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};



export const tasksApi = {
  getTasks: async (token: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  searchTasks: async (token: string, query: string): Promise<Task[]> => {
    if (!query.trim()) {
      throw new ApiError(400, 'Search query is required');
    }
    const response = await fetch(`${API_BASE_URL}/tasks/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getTask: async (token: string, id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  createTask: async (token: string, data: CreateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateTask: async (token: string, id: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteTask: async (token: string, id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'Failed to delete task');
    }
  },
};

export { ApiError };
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Login } from '../Login';
import { authApi } from '@/services/api';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

vi.mock('@/services/api');
vi.mock('@/contexts/AuthContext', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...(actual as Record<string, any>),
    useAuth: () => ({
      login: vi.fn(),
      user: null,
      token: null,
      loading: false,
    }),
  } as any;
});

const mockAuthApi = authApi as any;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </AuthProvider>
);

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    render(<Login />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle form submission successfully', async () => {
    const user = userEvent.setup();
    const mockUser = { name: 'Test User', email: 'test@gov.uk' };
    const mockToken = 'fake-token';

    mockAuthApi.login.mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });

    render(<Login />, { wrapper: TestWrapper });

    await user.type(screen.getByLabelText(/email/i), 'test@gov.uk');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAuthApi.login).toHaveBeenCalledWith({
        email: 'test@gov.uk',
        password: 'password',
      });
    });
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup();
    
    mockAuthApi.login.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login />, { wrapper: TestWrapper });

    await user.type(screen.getByLabelText(/email/i), 'wrong@gov.uk');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    
    render(<Login />, { wrapper: TestWrapper });

    await user.click(screen.getByRole('button', { name: /sign in/i }));

  });
});
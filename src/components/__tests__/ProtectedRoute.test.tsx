import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return { ...(original as Record<string, any>), useAuth: vi.fn() } as any;
});

const mockUseAuth = useAuth as any;

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </AuthProvider>
);

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when loading is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      loading: true,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: TestWrapper }
    );

    // Loading state shows skeleton not actual loading text
    const elements = document.querySelectorAll('.animate-pulse');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'Test User', email: 'test@gov.uk' },
      token: 'fake-token',
      loading: false,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: TestWrapper }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      loading: false,
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      { wrapper: TestWrapper }
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
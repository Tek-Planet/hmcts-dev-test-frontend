import React from 'react';

// Minimal working context to test if React hooks work
const TestContext = React.createContext<string>('test');

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('TestProvider - React object:', React);
  console.log('TestProvider - useState:', React.useState);
  
  try {
    const [testState] = React.useState('working');
    console.log('useState working, state:', testState);
    
    return (
      <TestContext.Provider value="test working">
        {children}
      </TestContext.Provider>
    );
  } catch (error) {
    console.error('Error in TestProvider:', error);
    return <div>Error in TestProvider: {String(error)}</div>;
  }
};

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('AuthProvider starting, React:', React);
  
  try {
    const [user, setUser] = React.useState<User | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      console.log('AuthProvider useEffect running');
      const initializeAuth = async () => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        
        if (storedToken && storedUser) {
          try {
            // Verify token is still valid
            const { authApi, setTokenRefreshCallback } = await import('@/services/api');
            
            // Set up token refresh callback
            setTokenRefreshCallback((newToken: string) => {
              setToken(newToken);
              localStorage.setItem('authToken', newToken);
            });
            
            const result = await authApi.verifyToken(storedToken);
            
            if (result.valid && result.user) {
              setToken(storedToken);
              setUser(result.user);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('authToken');
              localStorage.removeItem('authUser');
            }
          } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        }
        
        setLoading(false);
      };

      initializeAuth();
    }, []);

    const login = async (newToken: string, newUser: User) => {
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('authUser', JSON.stringify(newUser));
      
      // Set up token refresh callback for future API calls
      const { setTokenRefreshCallback } = await import('@/services/api');
      setTokenRefreshCallback((refreshedToken: string) => {
        setToken(refreshedToken);
        localStorage.setItem('authToken', refreshedToken);
      });
    };

    const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    };

    const value = {
      user,
      token,
      login,
      logout,
      loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  } catch (error) {
    console.error('Error in AuthProvider:', error);
    return <div>Error in AuthProvider: {String(error)}</div>;
  }
};
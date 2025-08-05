import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component to access auth context
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <button 
        data-testid="login-admin" 
        onClick={() => login('admin', 'admin123', 'admin')}
      >
        Login Admin
      </button>
      <button 
        data-testid="login-customer" 
        onClick={() => login('customer1', 'customer123', 'customer')}
      >
        Login Customer
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial state with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should initialize default users in localStorage', () => {
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(setItemSpy).toHaveBeenCalledWith('users', expect.any(String));
    
    const usersCall = setItemSpy.mock.calls.find(call => call[0] === 'users');
    const users = JSON.parse(usersCall![1]);
    
    expect(users).toHaveLength(4);
    expect(users[0]).toMatchObject({
      username: 'admin',
      role: 'admin'
    });
  });

  it('should login admin successfully', async () => {
    const mockUsers = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' }
    ];
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(mockUsers)) // for users
      .mockReturnValueOnce(null); // for currentUser

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-admin').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('Administrator');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('should login customer successfully', async () => {
    const mockUsers = [
      { 
        id: '2', 
        username: 'customer1', 
        password: 'customer123', 
        role: 'customer', 
        name: 'John Doe',
        customerNumber: 'C001'
      }
    ];
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(mockUsers))
      .mockReturnValueOnce(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('login-customer').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('should fail login with wrong credentials', async () => {
    const mockUsers = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' }
    ];
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(mockUsers))
      .mockReturnValueOnce(null);

    const TestComponentWithWrongLogin = () => {
      const { user, login } = useAuth();
      
      return (
        <div>
          <div data-testid="user">{user ? user.name : 'No user'}</div>
          <button 
            data-testid="wrong-login" 
            onClick={() => {
              const result = login('admin', 'wrongpassword', 'admin');
              console.log('Login result:', result);
            }}
          >
            Wrong Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponentWithWrongLogin />
      </AuthProvider>
    );

    act(() => {
      screen.getByTestId('wrong-login').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  it('should logout successfully', async () => {
    const mockUsers = [
      { id: '1', username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator' }
    ];
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce(JSON.stringify(mockUsers))
      .mockReturnValueOnce(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login first
    act(() => {
      screen.getByTestId('login-admin').click();
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');

    // Then logout
    act(() => {
      screen.getByTestId('logout').click();
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should restore user from localStorage on initialization', () => {
    const mockUser = { 
      id: '1', 
      username: 'admin', 
      password: 'admin123', 
      role: 'admin', 
      name: 'Administrator' 
    };
    
    vi.spyOn(localStorage, 'getItem')
      .mockReturnValueOnce('[]') // for users check
      .mockReturnValueOnce(JSON.stringify(mockUser)); // for currentUser

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('Administrator');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('should throw error when useAuth is used outside provider', () => {
    const TestComponentOutsideProvider = () => {
      useAuth();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
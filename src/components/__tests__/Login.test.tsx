import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Admin Login', () => {
    it('should render admin login form', () => {
      renderWithProviders(<Login role="admin" />);
      
      expect(screen.getByText('Admin Login')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('admin123')).toBeInTheDocument();
    });

    it('should show admin-specific styling', () => {
      renderWithProviders(<Login role="admin" />);
      
      const loginButton = screen.getByRole('button', { name: /masuk/i });
      expect(loginButton).toHaveClass('bg-red-600');
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();
      renderWithProviders(<Login role="admin" />);
      
      const usernameInput = screen.getByPlaceholderText('admin');
      const passwordInput = screen.getByPlaceholderText('admin123');
      const submitButton = screen.getByRole('button', { name: /masuk/i });
      
      await user.type(usernameInput, 'admin');
      await user.type(passwordInput, 'admin123');
      await user.click(submitButton);
      
      expect(submitButton).toHaveTextContent('Masuk...');
    });
  });

  describe('Customer Login', () => {
    it('should render customer login form', () => {
      renderWithProviders(<Login role="customer" />);
      
      expect(screen.getByText('Pelanggan Login')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('customer1')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('customer123')).toBeInTheDocument();
    });

    it('should show customer-specific styling', () => {
      renderWithProviders(<Login role="customer" />);
      
      const loginButton = screen.getByRole('button', { name: /masuk/i });
      expect(loginButton).toHaveClass('bg-blue-600');
    });
  });

  it('should show error message for invalid credentials', async () => {
    const user = userEvent.setup();
    
    // Mock localStorage to return empty users array
    vi.spyOn(localStorage, 'getItem').mockReturnValue('[]');
    
    renderWithProviders(<Login role="admin" />);
    
    const usernameInput = screen.getByPlaceholderText('admin');
    const passwordInput = screen.getByPlaceholderText('admin123');
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Username atau password salah')).toBeInTheDocument();
    });
  });

  it('should have back to home link', () => {
    renderWithProviders(<Login role="admin" />);
    
    const backLink = screen.getByRole('link', { name: /kembali ke beranda/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('should require username and password fields', () => {
    renderWithProviders(<Login role="admin" />);
    
    const usernameInput = screen.getByPlaceholderText('admin');
    const passwordInput = screen.getByPlaceholderText('admin123');
    
    expect(usernameInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login role="admin" />);
    
    const usernameInput = screen.getByPlaceholderText('admin');
    const passwordInput = screen.getByPlaceholderText('admin123');
    const submitButton = screen.getByRole('button', { name: /masuk/i });
    
    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin123');
    
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Masuk...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LandingPage', () => {
  it('should render main heading', () => {
    renderWithRouter(<LandingPage />);
    
    expect(screen.getByText('Sistem Pembayaran')).toBeInTheDocument();
    expect(screen.getByText('Listrik Pasca Bayar')).toBeInTheDocument();
  });

  it('should render admin login section', () => {
    renderWithRouter(<LandingPage />);
    
    expect(screen.getByText('Login Admin')).toBeInTheDocument();
    expect(screen.getByText(/Akses dashboard admin untuk mengelola tarif/)).toBeInTheDocument();
  });

  it('should render customer login section', () => {
    renderWithRouter(<LandingPage />);
    
    expect(screen.getByText('Login Pelanggan')).toBeInTheDocument();
    expect(screen.getByText(/Akses portal pelanggan untuk melihat tagihan/)).toBeInTheDocument();
  });

  it('should render features section', () => {
    renderWithRouter(<LandingPage />);
    
    expect(screen.getByText('Fitur Unggulan')).toBeInTheDocument();
    expect(screen.getByText('Pembayaran Cepat')).toBeInTheDocument();
    expect(screen.getByText('Keamanan Terjamin')).toBeInTheDocument();
    expect(screen.getByText('User Friendly')).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<LandingPage />);
    
    const adminLink = screen.getByRole('link', { name: /masuk sebagai admin/i });
    const customerLink = screen.getByRole('link', { name: /masuk sebagai pelanggan/i });
    
    expect(adminLink).toHaveAttribute('href', '/admin');
    expect(customerLink).toHaveAttribute('href', '/customer');
  });

  it('should render footer with company information', () => {
    renderWithRouter(<LandingPage />);
    
    expect(screen.getByText('PLN Payment System')).toBeInTheDocument();
    expect(screen.getByText(/© 2025 PLN Payment System/)).toBeInTheDocument();
  });
});
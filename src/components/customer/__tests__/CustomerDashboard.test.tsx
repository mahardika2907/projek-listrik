import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CustomerDashboard from '../CustomerDashboard';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the dataUtils
vi.mock('../../../utils/dataUtils', () => ({
  getBills: vi.fn(() => [
    {
      id: '1',
      customerNumber: 'C001',
      customerName: 'John Doe',
      period: '2024-01',
      usage: 150,
      totalAmount: 200000,
      status: 'unpaid',
      dueDate: '2024-02-15',
      tariffName: 'Rumah Tangga 900VA',
      previousReading: 1000,
      currentReading: 1150,
      pricePerKwh: 1352,
      basicFee: 0
    },
    {
      id: '2',
      customerNumber: 'C001',
      customerName: 'John Doe',
      period: '2023-12',
      usage: 120,
      totalAmount: 160000,
      status: 'paid',
      paidDate: '2024-01-15',
      tariffName: 'Rumah Tangga 900VA',
      previousReading: 880,
      currentReading: 1000,
      pricePerKwh: 1352,
      basicFee: 0
    }
  ]),
  getCustomers: vi.fn(() => [
    {
      id: '1',
      customerNumber: 'C001',
      name: 'John Doe',
      username: 'customer1',
      address: 'Test Address',
      phone: '081234567890',
      tariffId: '1',
      meterNumber: 'M001'
    }
  ]),
  getTariffs: vi.fn(() => [])
}));

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    save: vi.fn()
  }))
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Mock user context
const mockUser = {
  id: '1',
  username: 'customer1',
  role: 'customer' as const,
  name: 'John Doe',
  customerNumber: 'C001'
};

// Mock useAuth hook
vi.mock('../../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      logout: vi.fn(),
      login: vi.fn(),
      isAuthenticated: true
    })
  };
});

describe('CustomerDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render welcome message with customer name', () => {
    renderWithProviders(<CustomerDashboard />);
    
    expect(screen.getByText('Selamat Datang, John Doe!')).toBeInTheDocument();
    expect(screen.getByText('Nomor Pelanggan: C001')).toBeInTheDocument();
  });

  it('should display quick stats', () => {
    renderWithProviders(<CustomerDashboard />);
    
    expect(screen.getByText('Tagihan Belum Bayar')).toBeInTheDocument();
    expect(screen.getByText('Tagihan Lunas')).toBeInTheDocument();
    expect(screen.getByText('Total Tunggakan')).toBeInTheDocument();
  });

  it('should show navigation menu', () => {
    renderWithProviders(<CustomerDashboard />);
    
    expect(screen.getByText('Beranda')).toBeInTheDocument();
    expect(screen.getByText('Tagihan')).toBeInTheDocument();
    expect(screen.getByText('Pembayaran')).toBeInTheDocument();
    expect(screen.getByText('Riwayat')).toBeInTheDocument();
  });

  it('should switch between tabs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Click on Tagihan tab
    const billsTab = screen.getByText('Tagihan');
    await user.click(billsTab);
    
    expect(screen.getByText('Daftar Tagihan')).toBeInTheDocument();
    expect(screen.getByText('Lihat semua tagihan listrik Anda')).toBeInTheDocument();
  });

  it('should display bills in bills tab', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Switch to bills tab
    const billsTab = screen.getByText('Tagihan');
    await user.click(billsTab);
    
    expect(screen.getByText('Periode 2024-01')).toBeInTheDocument();
    expect(screen.getByText('150 kWh')).toBeInTheDocument();
    expect(screen.getByText('Belum Bayar')).toBeInTheDocument();
  });

  it('should show payment section for unpaid bills', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Switch to payment tab
    const paymentTab = screen.getByText('Pembayaran');
    await user.click(paymentTab);
    
    expect(screen.getByText('Pembayaran Tagihan')).toBeInTheDocument();
    expect(screen.getByText('Tagihan Periode 2024-01')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bayar sekarang/i })).toBeInTheDocument();
  });

  it('should show payment history in history tab', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Switch to history tab
    const historyTab = screen.getByText('Riwayat');
    await user.click(historyTab);
    
    expect(screen.getByText('Riwayat Pembayaran')).toBeInTheDocument();
    expect(screen.getByText('Periode 2023-12')).toBeInTheDocument();
    expect(screen.getByText('Lunas')).toBeInTheDocument();
  });

  it('should open payment modal when pay button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Switch to payment tab
    const paymentTab = screen.getByText('Pembayaran');
    await user.click(paymentTab);
    
    // Click pay button
    const payButton = screen.getByRole('button', { name: /bayar sekarang/i });
    await user.click(payButton);
    
    expect(screen.getByText('Pilih Metode Pembayaran')).toBeInTheDocument();
    expect(screen.getByText('Tunai (Cash)')).toBeInTheDocument();
    expect(screen.getByText('Transfer Bank')).toBeInTheDocument();
  });

  it('should handle payment method selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Navigate to payment and open modal
    const paymentTab = screen.getByText('Pembayaran');
    await user.click(paymentTab);
    
    const payButton = screen.getByRole('button', { name: /bayar sekarang/i });
    await user.click(payButton);
    
    // Select payment method
    const cashMethod = screen.getByText('Tunai (Cash)');
    await user.click(cashMethod);
    
    // Confirm payment should be enabled
    const confirmButton = screen.getByRole('button', { name: /konfirmasi pembayaran/i });
    expect(confirmButton).not.toBeDisabled();
  });

  it('should close payment modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Open payment modal
    const paymentTab = screen.getByText('Pembayaran');
    await user.click(paymentTab);
    
    const payButton = screen.getByRole('button', { name: /bayar sekarang/i });
    await user.click(payButton);
    
    expect(screen.getByText('Pilih Metode Pembayaran')).toBeInTheDocument();
    
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /batal/i });
    await user.click(cancelButton);
    
    expect(screen.queryByText('Pilih Metode Pembayaran')).not.toBeInTheDocument();
  });

  it('should show no unpaid bills message when all bills are paid', async () => {
    // Mock getBills to return only paid bills
    const { getBills } = await import('../../../utils/dataUtils');
    vi.mocked(getBills).mockReturnValue([
      {
        id: '1',
        customerNumber: 'C001',
        customerName: 'John Doe',
        period: '2024-01',
        usage: 150,
        totalAmount: 200000,
        status: 'paid',
        paidDate: '2024-01-15',
        dueDate: '2024-02-15',
        tariffName: 'Rumah Tangga 900VA',
        previousReading: 1000,
        currentReading: 1150,
        pricePerKwh: 1352,
        basicFee: 0
      }
    ]);
    
    const user = userEvent.setup();
    renderWithProviders(<CustomerDashboard />);
    
    // Switch to payment tab
    const paymentTab = screen.getByText('Pembayaran');
    await user.click(paymentTab);
    
    expect(screen.getByText('Tidak Ada Tagihan')).toBeInTheDocument();
    expect(screen.getByText('Semua tagihan Anda sudah lunas!')).toBeInTheDocument();
  });
});
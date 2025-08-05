import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TariffManagement from '../TariffManagement';

// Mock the dataUtils
vi.mock('../../../utils/dataUtils', () => ({
  getTariffs: vi.fn(() => [
    {
      id: '1',
      name: 'Test Tariff',
      pricePerKwh: 1500,
      basicFee: 50000,
      description: 'Test description',
      createdAt: '2024-01-01'
    }
  ])
}));

describe('TariffManagement', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render tariff management page', () => {
    render(<TariffManagement />);
    
    expect(screen.getByText('Manajemen Tarif')).toBeInTheDocument();
    expect(screen.getByText('Kelola tarif listrik untuk berbagai kategori pelanggan')).toBeInTheDocument();
  });

  it('should display existing tariffs', () => {
    render(<TariffManagement />);
    
    expect(screen.getByText('Test Tariff')).toBeInTheDocument();
    expect(screen.getByText('Rp 1.500')).toBeInTheDocument();
    expect(screen.getByText('Rp 50.000')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should open modal when add tariff button is clicked', async () => {
    const user = userEvent.setup();
    render(<TariffManagement />);
    
    const addButton = screen.getByRole('button', { name: /tambah tarif/i });
    await user.click(addButton);
    
    expect(screen.getByText('Tambah Tarif Baru')).toBeInTheDocument();
    expect(screen.getByLabelText('Nama Tarif')).toBeInTheDocument();
    expect(screen.getByLabelText('Harga per kWh (Rp)')).toBeInTheDocument();
    expect(screen.getByLabelText('Biaya Beban (Rp)')).toBeInTheDocument();
    expect(screen.getByLabelText('Deskripsi')).toBeInTheDocument();
  });

  it('should filter tariffs based on search term', async () => {
    const user = userEvent.setup();
    render(<TariffManagement />);
    
    const searchInput = screen.getByPlaceholderText('Cari tarif...');
    await user.type(searchInput, 'Test');
    
    expect(screen.getByText('Test Tariff')).toBeInTheDocument();
  });

  it('should handle form submission for new tariff', async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    
    render(<TariffManagement />);
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /tambah tarif/i });
    await user.click(addButton);
    
    // Fill form
    await user.type(screen.getByLabelText('Nama Tarif'), 'New Tariff');
    await user.type(screen.getByLabelText('Harga per kWh (Rp)'), '2000');
    await user.type(screen.getByLabelText('Biaya Beban (Rp)'), '60000');
    await user.type(screen.getByLabelText('Deskripsi'), 'New tariff description');
    
    // Submit form
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    await user.click(saveButton);
    
    expect(setItemSpy).toHaveBeenCalledWith('tariffs', expect.any(String));
  });

  it('should close modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TariffManagement />);
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /tambah tarif/i });
    await user.click(addButton);
    
    expect(screen.getByText('Tambah Tarif Baru')).toBeInTheDocument();
    
    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /batal/i });
    await user.click(cancelButton);
    
    expect(screen.queryByText('Tambah Tarif Baru')).not.toBeInTheDocument();
  });

  it('should handle delete tariff with confirmation', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    
    render(<TariffManagement />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(confirmSpy).toHaveBeenCalledWith('Apakah Anda yakin ingin menghapus tarif ini?');
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('should not delete tariff if user cancels confirmation', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const setItemSpy = vi.spyOn(localStorage, 'setItem');
    
    render(<TariffManagement />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(confirmSpy).toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<TariffManagement />);
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /tambah tarif/i });
    await user.click(addButton);
    
    // Try to submit without filling required fields
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    await user.click(saveButton);
    
    // Form should not be submitted (modal should still be open)
    expect(screen.getByText('Tambah Tarif Baru')).toBeInTheDocument();
  });
});
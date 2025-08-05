import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initializeData, getTariffs, getCustomers, getBills } from '../dataUtils';

describe('dataUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initializeData', () => {
    it('should initialize tariffs when localStorage is empty', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      const getItemSpy = vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      initializeData();

      expect(getItemSpy).toHaveBeenCalledWith('tariffs');
      expect(setItemSpy).toHaveBeenCalledWith('tariffs', expect.any(String));
      
      const tariffCall = setItemSpy.mock.calls.find(call => call[0] === 'tariffs');
      const tariffs = JSON.parse(tariffCall![1]);
      
      expect(tariffs).toHaveLength(3);
      expect(tariffs[0]).toMatchObject({
        name: 'Rumah Tangga 900VA',
        pricePerKwh: 1352,
        basicFee: 0
      });
    });

    it('should initialize customers when localStorage is empty', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      initializeData();

      expect(setItemSpy).toHaveBeenCalledWith('customers', expect.any(String));
      
      const customerCall = setItemSpy.mock.calls.find(call => call[0] === 'customers');
      const customers = JSON.parse(customerCall![1]);
      
      expect(customers).toHaveLength(3);
      expect(customers[0]).toMatchObject({
        customerNumber: 'C001',
        name: 'John Doe',
        username: 'customer1'
      });
    });

    it('should initialize bills when localStorage is empty', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);

      initializeData();

      expect(setItemSpy).toHaveBeenCalledWith('bills', expect.any(String));
      
      const billCall = setItemSpy.mock.calls.find(call => call[0] === 'bills');
      const bills = JSON.parse(billCall![1]);
      
      expect(bills).toHaveLength(3);
      expect(bills[0]).toMatchObject({
        customerNumber: 'C001',
        period: '2024-01',
        status: 'unpaid'
      });
    });

    it('should not initialize data if localStorage already has data', () => {
      const setItemSpy = vi.spyOn(localStorage, 'setItem');
      vi.spyOn(localStorage, 'getItem').mockReturnValue('[]');

      initializeData();

      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  describe('getTariffs', () => {
    it('should return empty array when no tariffs in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      
      const result = getTariffs();
      
      expect(result).toEqual([]);
    });

    it('should return parsed tariffs from localStorage', () => {
      const mockTariffs = [
        { id: '1', name: 'Test Tariff', pricePerKwh: 1000, basicFee: 0 }
      ];
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTariffs));
      
      const result = getTariffs();
      
      expect(result).toEqual(mockTariffs);
    });
  });

  describe('getCustomers', () => {
    it('should return empty array when no customers in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      
      const result = getCustomers();
      
      expect(result).toEqual([]);
    });

    it('should return parsed customers from localStorage', () => {
      const mockCustomers = [
        { id: '1', name: 'Test Customer', customerNumber: 'C001' }
      ];
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockCustomers));
      
      const result = getCustomers();
      
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('getBills', () => {
    it('should return empty array when no bills in localStorage', () => {
      vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
      
      const result = getBills();
      
      expect(result).toEqual([]);
    });

    it('should return parsed bills from localStorage', () => {
      const mockBills = [
        { id: '1', customerNumber: 'C001', status: 'unpaid', totalAmount: 100000 }
      ];
      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockBills));
      
      const result = getBills();
      
      expect(result).toEqual(mockBills);
    });
  });
});
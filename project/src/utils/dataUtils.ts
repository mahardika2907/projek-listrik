import { Customer, Tariff, Bill } from '../types';

// Default data initialization
export const initializeData = () => {
  // Initialize tariffs
  if (!localStorage.getItem('tariffs')) {
    const defaultTariffs: Tariff[] = [
      {
        id: '1',
        name: 'Rumah Tangga 900VA',
        pricePerKwh: 1352,
        basicFee: 0,
        description: 'Tarif untuk rumah tangga dengan daya 900VA',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Rumah Tangga 1300VA',
        pricePerKwh: 1444.70,
        basicFee: 0,
        description: 'Tarif untuk rumah tangga dengan daya 1300VA',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Bisnis 2200VA',
        pricePerKwh: 1699.53,
        basicFee: 44000,
        description: 'Tarif untuk usaha dengan daya 2200VA',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('tariffs', JSON.stringify(defaultTariffs));
  }

  // Initialize customers
  if (!localStorage.getItem('customers')) {
    const defaultCustomers: Customer[] = [
      {
        id: '1',
        customerNumber: 'C001',
        name: 'John Doe',
        username: 'customer1',
        password: 'customer123',
        address: 'Jl. Merdeka No. 123, Jakarta',
        phone: '081234567890',
        tariffId: '1',
        meterNumber: 'M001',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        customerNumber: 'C002',
        name: 'Jane Smith',
        username: 'customer2',
        password: 'customer123',
        address: 'Jl. Sudirman No. 456, Jakarta',
        phone: '081234567891',
        tariffId: '2',
        meterNumber: 'M002',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        customerNumber: 'C003',
        name: 'Bob Wilson',
        username: 'customer3',
        password: 'customer123',
        address: 'Jl. Thamrin No. 789, Jakarta',
        phone: '081234567892',
        tariffId: '3',
        meterNumber: 'M003',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('customers', JSON.stringify(defaultCustomers));
  }

  // Initialize bills
  if (!localStorage.getItem('bills')) {
    const customers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');
    const tariffs: Tariff[] = JSON.parse(localStorage.getItem('tariffs') || '[]');
    
    const defaultBills: Bill[] = customers.map((customer, index) => {
      const tariff = tariffs.find(t => t.id === customer.tariffId)!;
      const usage = 150 + (index * 50);
      const totalAmount = (usage * tariff.pricePerKwh) + tariff.basicFee;
      
      return {
        id: `${index + 1}`,
        customerNumber: customer.customerNumber,
        customerId: customer.id,
        customerName: customer.name,
        period: '2024-01',
        previousReading: 1000 + (index * 100),
        currentReading: 1000 + (index * 100) + usage,
        usage,
        tariffId: tariff.id,
        tariffName: tariff.name,
        pricePerKwh: tariff.pricePerKwh,
        basicFee: tariff.basicFee,
        totalAmount,
        status: index === 0 ? 'unpaid' : 'paid',
        dueDate: '2024-02-15',
        paidDate: index === 0 ? undefined : '2024-01-20',
        createdAt: new Date().toISOString()
      };
    });
    
    localStorage.setItem('bills', JSON.stringify(defaultBills));
  }
};

export const getTariffs = (): Tariff[] => {
  return JSON.parse(localStorage.getItem('tariffs') || '[]');
};

export const getCustomers = (): Customer[] => {
  return JSON.parse(localStorage.getItem('customers') || '[]');
};

export const getBills = (): Bill[] => {
  return JSON.parse(localStorage.getItem('bills') || '[]');
};
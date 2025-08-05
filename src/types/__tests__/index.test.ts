import { describe, it, expect } from 'vitest';
import type { User, Customer, Tariff, Bill, Payment } from '../index';

describe('Types', () => {
  describe('User type', () => {
    it('should have correct structure for admin user', () => {
      const adminUser: User = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrator'
      };

      expect(adminUser.role).toBe('admin');
      expect(adminUser.customerNumber).toBeUndefined();
    });

    it('should have correct structure for customer user', () => {
      const customerUser: User = {
        id: '2',
        username: 'customer1',
        password: 'customer123',
        role: 'customer',
        name: 'John Doe',
        customerNumber: 'C001'
      };

      expect(customerUser.role).toBe('customer');
      expect(customerUser.customerNumber).toBe('C001');
    });
  });

  describe('Customer type', () => {
    it('should have all required fields', () => {
      const customer: Customer = {
        id: '1',
        customerNumber: 'C001',
        name: 'John Doe',
        username: 'customer1',
        password: 'customer123',
        address: 'Test Address',
        phone: '081234567890',
        tariffId: '1',
        meterNumber: 'M001',
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      expect(customer).toHaveProperty('id');
      expect(customer).toHaveProperty('customerNumber');
      expect(customer).toHaveProperty('name');
      expect(customer).toHaveProperty('username');
      expect(customer).toHaveProperty('password');
      expect(customer).toHaveProperty('address');
      expect(customer).toHaveProperty('phone');
      expect(customer).toHaveProperty('tariffId');
      expect(customer).toHaveProperty('meterNumber');
      expect(customer).toHaveProperty('createdAt');
    });
  });

  describe('Tariff type', () => {
    it('should have all required fields', () => {
      const tariff: Tariff = {
        id: '1',
        name: 'Rumah Tangga 900VA',
        pricePerKwh: 1352,
        basicFee: 0,
        description: 'Tarif untuk rumah tangga dengan daya 900VA',
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      expect(tariff).toHaveProperty('id');
      expect(tariff).toHaveProperty('name');
      expect(tariff).toHaveProperty('pricePerKwh');
      expect(tariff).toHaveProperty('basicFee');
      expect(tariff).toHaveProperty('description');
      expect(tariff).toHaveProperty('createdAt');
      expect(typeof tariff.pricePerKwh).toBe('number');
      expect(typeof tariff.basicFee).toBe('number');
    });
  });

  describe('Bill type', () => {
    it('should have all required fields for unpaid bill', () => {
      const bill: Bill = {
        id: '1',
        customerNumber: 'C001',
        customerId: '1',
        customerName: 'John Doe',
        period: '2024-01',
        previousReading: 1000,
        currentReading: 1150,
        usage: 150,
        tariffId: '1',
        tariffName: 'Rumah Tangga 900VA',
        pricePerKwh: 1352,
        basicFee: 0,
        totalAmount: 202800,
        status: 'unpaid',
        dueDate: '2024-02-15',
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      expect(bill.status).toBe('unpaid');
      expect(bill.paidDate).toBeUndefined();
      expect(typeof bill.usage).toBe('number');
      expect(typeof bill.totalAmount).toBe('number');
    });

    it('should have paidDate for paid bill', () => {
      const paidBill: Bill = {
        id: '1',
        customerNumber: 'C001',
        customerId: '1',
        customerName: 'John Doe',
        period: '2024-01',
        previousReading: 1000,
        currentReading: 1150,
        usage: 150,
        tariffId: '1',
        tariffName: 'Rumah Tangga 900VA',
        pricePerKwh: 1352,
        basicFee: 0,
        totalAmount: 202800,
        status: 'paid',
        dueDate: '2024-02-15',
        paidDate: '2024-01-20T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z'
      };

      expect(paidBill.status).toBe('paid');
      expect(paidBill.paidDate).toBeDefined();
    });
  });

  describe('Payment type', () => {
    it('should have all required fields', () => {
      const payment: Payment = {
        id: '1',
        billId: '1',
        customerNumber: 'C001',
        amount: 202800,
        paymentDate: '2024-01-20T00:00:00.000Z',
        paymentMethod: 'cash'
      };

      expect(payment).toHaveProperty('id');
      expect(payment).toHaveProperty('billId');
      expect(payment).toHaveProperty('customerNumber');
      expect(payment).toHaveProperty('amount');
      expect(payment).toHaveProperty('paymentDate');
      expect(payment).toHaveProperty('paymentMethod');
      expect(typeof payment.amount).toBe('number');
    });
  });
});
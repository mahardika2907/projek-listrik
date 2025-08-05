export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'customer';
  name: string;
  customerNumber?: string;
}

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  username: string;
  password: string;
  address: string;
  phone: string;
  tariffId: string;
  meterNumber: string;
  createdAt: string;
}

export interface Tariff {
  id: string;
  name: string;
  pricePerKwh: number;
  basicFee: number;
  description: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  customerNumber: string;
  customerId: string;
  customerName: string;
  period: string;
  previousReading: number;
  currentReading: number;
  usage: number;
  tariffId: string;
  tariffName: string;
  pricePerKwh: number;
  basicFee: number;
  totalAmount: number;
  status: 'unpaid' | 'paid';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  billId: string;
  customerNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}
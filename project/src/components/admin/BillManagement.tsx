import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Receipt, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Bill, Customer, Tariff } from '../../types';
import { getBills, getCustomers, getTariffs } from '../../utils/dataUtils';

const BillManagement: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    period: '',
    previousReading: '',
    currentReading: '',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBills(getBills());
    setCustomers(getCustomers());
    setTariffs(getTariffs());
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.customerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.period.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const calculateBill = (customerId: string, previousReading: number, currentReading: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;
    
    const tariff = tariffs.find(t => t.id === customer.tariffId);
    if (!tariff) return null;

    const usage = currentReading - previousReading;
    const totalAmount = (usage * tariff.pricePerKwh) + tariff.basicFee;

    return {
      customer,
      tariff,
      usage,
      totalAmount
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calculation = calculateBill(
      formData.customerId,
      parseFloat(formData.previousReading),
      parseFloat(formData.currentReading)
    );

    if (!calculation) {
      alert('Error: Invalid customer or tariff data');
      return;
    }

    const billData: Bill = {
      id: editingBill ? editingBill.id : Date.now().toString(),
      customerNumber: calculation.customer.customerNumber,
      customerId: formData.customerId,
      customerName: calculation.customer.name,
      period: formData.period,
      previousReading: parseFloat(formData.previousReading),
      currentReading: parseFloat(formData.currentReading),
      usage: calculation.usage,
      tariffId: calculation.tariff.id,
      tariffName: calculation.tariff.name,
      pricePerKwh: calculation.tariff.pricePerKwh,
      basicFee: calculation.tariff.basicFee,
      totalAmount: calculation.totalAmount,
      status: editingBill ? editingBill.status : 'unpaid',
      dueDate: formData.dueDate,
      paidDate: editingBill?.paidDate,
      createdAt: editingBill ? editingBill.createdAt : new Date().toISOString()
    };

    let updatedBills;
    if (editingBill) {
      updatedBills = bills.map(b => b.id === editingBill.id ? billData : b);
    } else {
      updatedBills = [...bills, billData];
    }

    localStorage.setItem('bills', JSON.stringify(updatedBills));
    setBills(updatedBills);
    closeModal();
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      customerId: bill.customerId,
      period: bill.period,
      previousReading: bill.previousReading.toString(),
      currentReading: bill.currentReading.toString(),
      dueDate: bill.dueDate
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
      const updatedBills = bills.filter(b => b.id !== id);
      localStorage.setItem('bills', JSON.stringify(updatedBills));
      setBills(updatedBills);
    }
  };

  const handleStatusToggle = (bill: Bill) => {
    const updatedBill = {
      ...bill,
      status: bill.status === 'paid' ? 'unpaid' : 'paid',
      paidDate: bill.status === 'paid' ? undefined : new Date().toISOString()
    } as Bill;

    const updatedBills = bills.map(b => b.id === bill.id ? updatedBill : b);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    setBills(updatedBills);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBill(null);
    setFormData({
      customerId: '',
      period: '',
      previousReading: '',
      currentReading: '',
      dueDate: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Tagihan</h1>
          <p className="text-gray-600">Kelola tagihan listrik pelanggan</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Tagihan</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tagihan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
          >
            <option value="all">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="unpaid">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Bill List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pemakaian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Tagihan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <Receipt className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.customerName}</div>
                        <div className="text-sm text-gray-500">No: {bill.customerNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {bill.period}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bill.usage} kWh
                    <div className="text-xs text-gray-500">
                      ({bill.previousReading} → {bill.currentReading})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      Rp {bill.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(bill)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        bill.status === 'paid'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {bill.status === 'paid' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {bill.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(bill.dueDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingBill ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pelanggan
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                  >
                    <option value="">Pilih Pelanggan</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customerNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    placeholder="2024-01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meter Awal
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.previousReading}
                      onChange={(e) => setFormData({...formData, previousReading: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meter Akhir
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={formData.currentReading}
                      onChange={(e) => setFormData({...formData, currentReading: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>

                {formData.customerId && formData.previousReading && formData.currentReading && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Preview Tagihan:</h4>
                    {(() => {
                      const calc = calculateBill(
                        formData.customerId,
                        parseFloat(formData.previousReading),
                        parseFloat(formData.currentReading)
                      );
                      return calc ? (
                        <div className="space-y-1 text-sm">
                          <p>Pemakaian: {calc.usage} kWh</p>
                          <p>Tarif: {calc.tariff.name}</p>
                          <p>Total: Rp {calc.totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {editingBill ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillManagement;
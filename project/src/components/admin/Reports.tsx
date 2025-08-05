import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter, Users, Receipt, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import { getBills, getCustomers, getTariffs } from '../../utils/dataUtils';

const Reports: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [reportType, setReportType] = useState<string>('bills');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<string>('all');

  useEffect(() => {
    setBills(getBills());
    setCustomers(getCustomers());
    setTariffs(getTariffs());
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('PT PLN (Persero)', 20, 20);
    doc.setFontSize(14);
    doc.text('Laporan Sistem Pembayaran Listrik', 20, 35);
    
    // Date range
    const currentDate = new Date().toLocaleDateString('id-ID');
    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${currentDate}`, 20, 50);
    
    if (startDate && endDate) {
      doc.text(`Periode: ${startDate} s/d ${endDate}`, 20, 60);
    }

    let yPos = 80;

    if (reportType === 'bills') {
      // Bills Report
      doc.setFontSize(16);
      doc.text('Laporan Tagihan', 20, yPos);
      yPos += 20;

      const filteredBills = bills.filter(bill => {
        const billDate = new Date(bill.createdAt);
        const start = startDate ? new Date(startDate) : new Date('1900-01-01');
        const end = endDate ? new Date(endDate) : new Date('2099-12-31');
        const matchesDate = billDate >= start && billDate <= end;
        const matchesStatus = status === 'all' || bill.status === status;
        return matchesDate && matchesStatus;
      });

      // Summary
      const totalBills = filteredBills.length;
      const paidBills = filteredBills.filter(b => b.status === 'paid').length;
      const totalRevenue = filteredBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);

      doc.setFontSize(12);
      doc.text(`Total Tagihan: ${totalBills}`, 20, yPos);
      doc.text(`Tagihan Lunas: ${paidBills}`, 120, yPos);
      yPos += 10;
      doc.text(`Total Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}`, 20, yPos);
      yPos += 20;

      // Table Header
      doc.setFontSize(10);
      doc.text('No. Pel', 20, yPos);
      doc.text('Nama', 50, yPos);
      doc.text('Periode', 90, yPos);
      doc.text('Pemakaian', 120, yPos);
      doc.text('Jumlah', 150, yPos);
      doc.text('Status', 180, yPos);
      yPos += 10;

      // Table Content
      filteredBills.slice(0, 20).forEach((bill, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(bill.customerNumber, 20, yPos);
        doc.text(bill.customerName.substring(0, 15), 50, yPos);
        doc.text(bill.period, 90, yPos);
        doc.text(`${bill.usage} kWh`, 120, yPos);
        doc.text(`Rp ${(bill.totalAmount / 1000).toFixed(0)}k`, 150, yPos);
        doc.text(bill.status === 'paid' ? 'Lunas' : 'Belum', 180, yPos);
        yPos += 8;
      });
    } else if (reportType === 'customers') {
      // Customers Report
      doc.setFontSize(16);
      doc.text('Laporan Data Pelanggan', 20, yPos);
      yPos += 20;

      doc.setFontSize(12);
      doc.text(`Total Pelanggan: ${customers.length}`, 20, yPos);
      yPos += 20;

      // Table Header
      doc.setFontSize(10);
      doc.text('No. Pel', 20, yPos);
      doc.text('Nama', 50, yPos);
      doc.text('Tarif', 90, yPos);
      doc.text('No. Meter', 130, yPos);
      doc.text('Telepon', 160, yPos);
      yPos += 10;

      // Table Content
      customers.slice(0, 25).forEach((customer, index) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        const tariff = tariffs.find(t => t.id === customer.tariffId);
        doc.text(customer.customerNumber, 20, yPos);
        doc.text(customer.name.substring(0, 15), 50, yPos);
        doc.text(tariff ? tariff.name.substring(0, 15) : 'N/A', 90, yPos);
        doc.text(customer.meterNumber, 130, yPos);
        doc.text(customer.phone, 160, yPos);
        yPos += 8;
      });
    } else if (reportType === 'revenue') {
      // Revenue Report
      doc.setFontSize(16);
      doc.text('Laporan Pendapatan', 20, yPos);
      yPos += 20;

      const paidBills = bills.filter(b => b.status === 'paid');
      const totalRevenue = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);
      const avgBill = totalRevenue / paidBills.length;

      doc.setFontSize(12);
      doc.text(`Total Pendapatan: Rp ${totalRevenue.toLocaleString('id-ID')}`, 20, yPos);
      yPos += 10;
      doc.text(`Jumlah Tagihan Lunas: ${paidBills.length}`, 20, yPos);
      yPos += 10;
      doc.text(`Rata-rata Tagihan: Rp ${avgBill.toLocaleString('id-ID')}`, 20, yPos);
      yPos += 20;

      // Revenue by tariff
      const revenueByTariff = tariffs.map(tariff => {
        const tariffBills = paidBills.filter(b => b.tariffId === tariff.id);
        const revenue = tariffBills.reduce((sum, b) => sum + b.totalAmount, 0);
        return { tariff: tariff.name, revenue, count: tariffBills.length };
      });

      doc.text('Pendapatan per Tarif:', 20, yPos);
      yPos += 15;

      revenueByTariff.forEach(item => {
        doc.text(`${item.tariff}:`, 20, yPos);
        doc.text(`Rp ${item.revenue.toLocaleString('id-ID')} (${item.count} tagihan)`, 30, yPos + 8);
        yPos += 20;
      });
    }

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, 180, 285);
      doc.text('Dicetak dari Sistem PLN', 20, 285);
    }

    // Save the PDF
    const fileName = `laporan_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const getReportStats = () => {
    const paidBills = bills.filter(b => b.status === 'paid');
    const unpaidBills = bills.filter(b => b.status === 'unpaid');
    const totalRevenue = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);

    return {
      totalCustomers: customers.length,
      totalBills: bills.length,
      paidBills: paidBills.length,
      unpaidBills: unpaidBills.length,
      totalRevenue
    };
  };

  const stats = getReportStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-600">Generate dan download laporan sistem</p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Pelanggan</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Tagihan</p>
              <p className="text-2xl font-bold">{stats.totalBills}</p>
            </div>
            <Receipt className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Tagihan Lunas</p>
              <p className="text-2xl font-bold">{stats.paidBills}</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Pendapatan</p>
              <p className="text-xl font-bold">Rp {(stats.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Laporan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Laporan
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="bills">Laporan Tagihan</option>
              <option value="customers">Laporan Pelanggan</option>
              <option value="revenue">Laporan Pendapatan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {reportType === 'bills' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="paid">Lunas</option>
                <option value="unpaid">Belum Bayar</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Preview Laporan</h3>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Jenis Laporan:</span>
              <span>
                {reportType === 'bills' ? 'Laporan Tagihan' :
                 reportType === 'customers' ? 'Laporan Pelanggan' :
                 'Laporan Pendapatan'}
              </span>
            </div>
            {startDate && endDate && (
              <div className="flex justify-between">
                <span className="font-medium">Periode:</span>
                <span>{startDate} s/d {endDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Tanggal Generate:</span>
              <span>{new Date().toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Estimated Records:</span>
              <span>
                {reportType === 'bills' ? bills.length :
                 reportType === 'customers' ? customers.length :
                 `${stats.paidBills} transaksi`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Informasi Laporan</h4>
              <p className="text-sm text-blue-700 mt-1">
                Laporan akan didownload dalam format PDF dengan informasi lengkap sesuai filter yang dipilih.
                File akan disimpan dengan nama format: laporan_[jenis]_[tanggal].pdf
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
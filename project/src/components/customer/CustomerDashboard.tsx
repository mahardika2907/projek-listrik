import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Receipt, 
  CreditCard, 
  FileText, 
  LogOut, 
  Zap, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Download,
  ArrowLeft,
  Banknote,
  Smartphone,
  Building2,
  Wallet,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getBills, getCustomers, getTariffs } from '../../utils/dataUtils';
import jsPDF from 'jspdf';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [bills, setBills] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    if (user?.customerNumber) {
      const allBills = getBills();
      const customerBills = allBills.filter(bill => bill.customerNumber === user.customerNumber);
      setBills(customerBills);

      const allCustomers = getCustomers();
      const customerData = allCustomers.find(c => c.customerNumber === user.customerNumber);
      setCustomer(customerData);
    }
  }, [user]);

  const openPaymentModal = (bill: any) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
    setSelectedPaymentMethod('');
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBill(null);
    setSelectedPaymentMethod('');
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod || !selectedBill) return;

    const updatedBills = bills.map(bill => 
      bill.id === selectedBill.id 
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString(), paymentMethod: selectedPaymentMethod }
        : bill
    );
    setBills(updatedBills);

    // Update localStorage
    const allBills = getBills();
    const updatedAllBills = allBills.map(bill => 
      bill.id === selectedBill.id 
        ? { ...bill, status: 'paid', paidDate: new Date().toISOString(), paymentMethod: selectedPaymentMethod }
        : bill
    );
    localStorage.setItem('bills', JSON.stringify(updatedAllBills));

    // Generate receipt
    generateReceipt(updatedBills.find(b => b.id === selectedBill.id));
    closePaymentModal();
  };

  const generateReceipt = (bill: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('BUKTI PEMBAYARAN LISTRIK', 20, 20);
    doc.setFontSize(14);
    doc.text('PT PLN (Persero)', 20, 35);
    
    // Receipt details
    doc.setFontSize(12);
    doc.text('DETAIL PEMBAYARAN', 20, 55);
    
    const details = [
      ['Nomor Pelanggan', bill.customerNumber],
      ['Nama Pelanggan', bill.customerName],
      ['Periode Tagihan', bill.period],
      ['Tanggal Bayar', new Date(bill.paidDate).toLocaleDateString('id-ID')],
      ['Metode Pembayaran', bill.paymentMethod || 'Cash'],
      ['Pemakaian', `${bill.usage} kWh`],
      ['Tarif', bill.tariffName],
      ['Jumlah Tagihan', `Rp ${bill.totalAmount.toLocaleString('id-ID')}`]
    ];

    let yPos = 70;
    details.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPos);
      doc.text(value, 80, yPos);
      yPos += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Terima kasih atas pembayaran Anda', 20, yPos + 20);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 20, yPos + 35);
    
    doc.save(`bukti_pembayaran_${bill.customerNumber}_${bill.period}.pdf`);
  };

  const unpaidBills = bills.filter(bill => bill.status === 'unpaid');
  const paidBills = bills.filter(bill => bill.status === 'paid');
  const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Tunai (Cash)',
      description: 'Pembayaran langsung dengan uang tunai',
      icon: Banknote,
      color: 'green'
    },
    {
      id: 'transfer',
      name: 'Transfer Bank',
      description: 'Transfer melalui ATM atau Internet Banking',
      icon: Building2,
      color: 'blue'
    },
    {
      id: 'mobile_banking',
      name: 'Mobile Banking',
      description: 'Pembayaran melalui aplikasi mobile banking',
      icon: Smartphone,
      color: 'purple'
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      description: 'Pembayaran melalui dompet digital (OVO, GoPay, DANA)',
      icon: Wallet,
      color: 'orange'
    }
  ];
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'bills', label: 'Tagihan', icon: Receipt },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
    { id: 'history', label: 'Riwayat', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}!</h1>
                  <p className="text-blue-100">Nomor Pelanggan: {user?.customerNumber}</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <Zap className="h-12 w-12" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tagihan Belum Bayar</p>
                    <p className="text-2xl font-bold text-gray-900">{unpaidBills.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Tagihan Lunas</p>
                    <p className="text-2xl font-bold text-gray-900">{paidBills.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Tunggakan</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {totalUnpaid.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tagihan Terbaru</h3>
              <div className="space-y-4">
                {bills.slice(0, 3).map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        bill.status === 'paid' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">Periode {bill.period}</p>
                        <p className="text-sm text-gray-600">
                          Pemakaian: {bill.usage} kWh - Rp {bill.totalAmount.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      bill.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bill.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bills':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Daftar Tagihan</h2>
              <p className="text-gray-600">Lihat semua tagihan listrik Anda</p>
            </div>

            <div className="grid gap-6">
              {bills.map((bill) => (
                <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Periode {bill.period}</h3>
                        <p className="text-sm text-gray-600">Jatuh Tempo: {new Date(bill.dueDate).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      bill.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bill.status === 'paid' ? 'Lunas' : 'Belum Bayar'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Meter Awal</p>
                      <p className="font-medium">{bill.previousReading}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Meter Akhir</p>
                      <p className="font-medium">{bill.currentReading}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pemakaian</p>
                      <p className="font-medium">{bill.usage} kWh</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Tagihan</p>
                      <p className="font-medium text-lg">Rp {bill.totalAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pembayaran Tagihan</h2>
              <p className="text-gray-600">Bayar tagihan listrik Anda</p>
            </div>

            {unpaidBills.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Tagihan</h3>
                <p className="text-gray-600">Semua tagihan Anda sudah lunas!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {unpaidBills.map((bill) => (
                  <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Tagihan Periode {bill.period}</h3>
                        <p className="text-sm text-gray-600">Jatuh Tempo: {new Date(bill.dueDate).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Tagihan</p>
                        <p className="text-2xl font-bold text-gray-900">Rp {bill.totalAmount.toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Pemakaian</p>
                          <p className="font-medium">{bill.usage} kWh</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tarif</p>
                          <p className="font-medium">{bill.tariffName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Biaya Pemakaian</p>
                          <p className="font-medium">Rp {(bill.usage * bill.pricePerKwh).toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Biaya Beban</p>
                          <p className="font-medium">Rp {bill.basicFee.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => openPaymentModal(bill)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Bayar Sekarang</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Riwayat Pembayaran</h2>
              <p className="text-gray-600">Lihat riwayat pembayaran tagihan listrik</p>
            </div>

            {paidBills.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Riwayat</h3>
                <p className="text-gray-600">Riwayat pembayaran Anda akan muncul di sini</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {paidBills.map((bill) => (
                  <div key={bill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Periode {bill.period}</h3>
                          <p className="text-sm text-gray-600">
                            Dibayar: {new Date(bill.paidDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => generateReceipt(bill)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Bukti</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Pemakaian</p>
                        <p className="font-medium">{bill.usage} kWh</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tarif</p>
                        <p className="font-medium">{bill.tariffName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Bayar</p>
                        <p className="font-medium">Rp {bill.totalAmount.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Metode Bayar</p>
                        <p className="font-medium">{bill.paymentMethod || 'Cash'}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Lunas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">PLN Customer Portal</h1>
                <p className="text-sm text-gray-500">Portal Pelanggan</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-4"
            >
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Beranda</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Keluar</span>
              </button>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Pilih Metode Pembayaran</h3>
                  <p className="text-gray-600">Tagihan Periode {selectedBill.period}</p>
                </div>
                <button
                  onClick={closePaymentModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Bill Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Tagihan:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    Rp {selectedBill.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Pemakaian: {selectedBill.usage} kWh • Tarif: {selectedBill.tariffName}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Pilih Metode Pembayaran:</h4>
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPaymentMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? `border-${method.color}-500 bg-${method.color}-50`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          method.color === 'green' ? 'bg-green-100' :
                          method.color === 'blue' ? 'bg-blue-100' :
                          method.color === 'purple' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${
                            method.color === 'green' ? 'text-green-600' :
                            method.color === 'blue' ? 'text-blue-600' :
                            method.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{method.name}</h5>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                        {isSelected && (
                          <div className={`w-5 h-5 rounded-full ${
                            method.color === 'green' ? 'bg-green-500' :
                            method.color === 'blue' ? 'bg-blue-500' :
                            method.color === 'purple' ? 'bg-purple-500' :
                            'bg-orange-500'
                          } flex items-center justify-center`}>
                            <CheckCircle className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Instructions */}
              {selectedPaymentMethod && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-blue-900 mb-2">Instruksi Pembayaran:</h5>
                  <div className="text-sm text-blue-800">
                    {selectedPaymentMethod === 'cash' && (
                      <p>Silakan datang ke kantor PLN terdekat dengan membawa tagihan ini untuk melakukan pembayaran tunai.</p>
                    )}
                    {selectedPaymentMethod === 'transfer' && (
                      <div>
                        <p className="mb-2">Transfer ke rekening PLN:</p>
                        <p className="font-mono bg-white p-2 rounded">Bank BCA: 1234567890</p>
                        <p className="font-mono bg-white p-2 rounded mt-1">Bank Mandiri: 0987654321</p>
                      </div>
                    )}
                    {selectedPaymentMethod === 'mobile_banking' && (
                      <p>Gunakan aplikasi mobile banking Anda, pilih menu "Pembayaran" → "PLN" → masukkan nomor pelanggan.</p>
                    )}
                    {selectedPaymentMethod === 'ewallet' && (
                      <p>Buka aplikasi e-wallet Anda, pilih "Bayar Tagihan" → "PLN" → scan QR code atau masukkan nomor pelanggan.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={closePaymentModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!selectedPaymentMethod}
                  className={`flex-1 py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    selectedPaymentMethod
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Konfirmasi Pembayaran</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
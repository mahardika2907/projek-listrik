import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Zap, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PLN Payment System</h1>
                <p className="text-sm text-gray-500">Sistem Pembayaran Listrik Pasca Bayar</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistem Pembayaran
            <span className="text-blue-600 block">Listrik Pasca Bayar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform digital untuk mengelola dan membayar tagihan listrik dengan mudah, 
            aman, dan efisien. Tersedia untuk admin dan pelanggan.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Login */}
          <Link to="/admin" className="group">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                  <Shield className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Admin</h3>
                <p className="text-gray-600 mb-6">
                  Akses dashboard admin untuk mengelola tarif, data pelanggan, 
                  tagihan, dan laporan sistem.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 font-medium mb-2"></p>
                  <p className="text-sm text-gray-600"></p>
                  <p className="text-sm text-gray-600"></p>
                </div>
                <div className="flex items-center justify-center text-red-600 font-semibold group-hover:text-red-700">
                  <span>Masuk sebagai Admin</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Customer Login */}
          <Link to="/customer" className="group">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Pelanggan</h3>
                <p className="text-gray-600 mb-6">
                  Akses portal pelanggan untuk melihat tagihan, 
                  melakukan pembayaran, dan download bukti bayar.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700 font-medium mb-2">:</p>
                  <p className="text-sm text-gray-600"></p>
                  <p className="text-sm text-gray-600"></p>
                </div>
                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Masuk sebagai Pelanggan</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Fitur Unggulan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pembayaran Cepat</h3>
              <p className="text-gray-600">Bayar tagihan listrik dengan mudah dan cepat melalui platform digital</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-600">Sistem keamanan berlapis untuk melindungi data dan transaksi Anda</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User Friendly</h3>
              <p className="text-gray-600">Interface yang intuitif dan mudah digunakan untuk semua kalangan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">PLN Payment System</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Sistem Pembayaran Listrik Pasca Bayar - PT PLN (Persero)
            </p>
            <p className="text-sm text-gray-500">
              © 2025 PLN Payment System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
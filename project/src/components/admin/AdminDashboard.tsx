import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import TariffManagement from './TariffManagement';
import CustomerManagement from './CustomerManagement';
import BillManagement from './BillManagement';
import Reports from './Reports';
import { initializeData } from '../../utils/dataUtils';

const AdminDashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />;
      case 'tariffs':
        return <TariffManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'bills':
        return <BillManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Back to Home Link - Fixed Position */}
      <Link 
        to="/" 
        className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-white text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg shadow-sm border border-gray-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Beranda</span>
      </Link>
      
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
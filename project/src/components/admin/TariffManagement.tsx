import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Zap } from 'lucide-react';
import { Tariff } from '../../types';
import { getTariffs } from '../../utils/dataUtils';

const TariffManagement: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pricePerKwh: '',
    basicFee: '',
    description: ''
  });

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = () => {
    setTariffs(getTariffs());
  };

  const filteredTariffs = tariffs.filter(tariff =>
    tariff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tariff.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tariffData: Tariff = {
      id: editingTariff ? editingTariff.id : Date.now().toString(),
      name: formData.name,
      pricePerKwh: parseFloat(formData.pricePerKwh),
      basicFee: parseFloat(formData.basicFee),
      description: formData.description,
      createdAt: editingTariff ? editingTariff.createdAt : new Date().toISOString()
    };

    let updatedTariffs;
    if (editingTariff) {
      updatedTariffs = tariffs.map(t => t.id === editingTariff.id ? tariffData : t);
    } else {
      updatedTariffs = [...tariffs, tariffData];
    }

    localStorage.setItem('tariffs', JSON.stringify(updatedTariffs));
    setTariffs(updatedTariffs);
    closeModal();
  };

  const handleEdit = (tariff: Tariff) => {
    setEditingTariff(tariff);
    setFormData({
      name: tariff.name,
      pricePerKwh: tariff.pricePerKwh.toString(),
      basicFee: tariff.basicFee.toString(),
      description: tariff.description
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tarif ini?')) {
      const updatedTariffs = tariffs.filter(t => t.id !== id);
      localStorage.setItem('tariffs', JSON.stringify(updatedTariffs));
      setTariffs(updatedTariffs);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTariff(null);
    setFormData({
      name: '',
      pricePerKwh: '',
      basicFee: '',
      description: ''
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Tarif</h1>
          <p className="text-gray-600">Kelola tarif listrik untuk berbagai kategori pelanggan</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Tarif</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari tarif..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tariff List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Tarif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga per kWh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biaya Beban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTariffs.map((tariff) => (
                <tr key={tariff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                        <Zap className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tariff.name}</div>
                        <div className="text-sm text-gray-500">ID: {tariff.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rp {tariff.pricePerKwh.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Rp {tariff.basicFee.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {tariff.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(tariff)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tariff.id)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTariff ? 'Edit Tarif' : 'Tambah Tarif Baru'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Tarif
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga per kWh (Rp)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.pricePerKwh}
                    onChange={(e) => setFormData({...formData, pricePerKwh: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biaya Beban (Rp)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.basicFee}
                    onChange={(e) => setFormData({...formData, basicFee: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {editingTariff ? 'Update' : 'Simpan'}
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

export default TariffManagement;
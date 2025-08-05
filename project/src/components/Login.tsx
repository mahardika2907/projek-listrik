import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Zap, Shield, User, ArrowLeft } from 'lucide-react';

interface LoginProps {
  role: 'admin' | 'customer';
}

const Login: React.FC<LoginProps> = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(username, password, role);
    
    if (!success) {
      setError('Username atau password salah');
    }
    
    setLoading(false);
  };

  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
            isAdmin ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            {isAdmin ? (
              <Shield className={`h-8 w-8 ${isAdmin ? 'text-red-600' : 'text-blue-600'}`} />
            ) : (
              <User className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isAdmin ? 'Admin' : 'Pelanggan'} Login
          </h2>
          <div className="flex items-center justify-center mt-2 text-gray-600">
            <Zap className="h-5 w-5 mr-2" />
            <span>PLN Payment System</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isAdmin ? "admin" : "customer1"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder={isAdmin ? "admin123" : "customer123"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isAdmin
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="font-medium mb-2"></p>
            <div className="space-y-1">
              {isAdmin ? (
                <p></p>
              ) : (
                <>
                  <p></p>
                  <p></p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
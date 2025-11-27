import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TRICKY PART: FastAPI OAuth2 butuh Form Data, bukan JSON!
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await api.post('/api/v1/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      // Kalau sukses, simpan token & pindah ke dashboard
      login(response.data.access_token);
      navigate('/dashboard'); 
      
    } catch (err: any) {
      console.error(err);
      setError('Username atau password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-t-4 border-primary">
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-primary tracking-wide mb-1">Hari-Hari</h1>
          <p className="text-secondary font-serif italic">Staff Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-dark mb-2 font-serif">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
              placeholder="Masukan ID Staff"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark mb-2 font-serif">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-serif font-bold py-3.5 rounded-md shadow-md transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      login(res.data.data.token, email);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Object && 'response' in err
        ? (err as { response: { data: { message: string } } }).response?.data?.message || 'Login failed'
        : 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 sm:p-10 max-w-sm w-full shadow-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-on-surface">Admin Login</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to manage registrations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="admin@introinternship.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-on-surface-variant">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

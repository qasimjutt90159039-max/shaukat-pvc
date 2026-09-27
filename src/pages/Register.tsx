import React, { useState } from 'react';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const { navigate } = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/account');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded bg-[#005B96] text-white flex items-center justify-center font-tech font-bold text-xl mx-auto mb-3">
            SP
          </div>
          <h1 className="font-tech text-2xl font-bold uppercase text-[#17212B]">
            CREATE CUSTOMER ACCOUNT
          </h1>
          <p className="text-xs text-slate-500 font-mono-spec mt-1">
            Save delivery addresses, track orders, and request wholesale estimates
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Muhammad Tariq"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="+92 300 0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#F4F8FA] border border-slate-300 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#005B96]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#005B96] hover:bg-[#004370] text-white font-tech font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          Already registered?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#005B96] font-bold hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};

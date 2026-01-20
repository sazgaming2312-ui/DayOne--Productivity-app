import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  onLogin: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating secure backend communication (conceptually calling Backend.java AuthController)
    setTimeout(() => {
      const user = {
        id: 'user_123',
        email,
        name: isLogin ? (email.split('@')[0]) : name,
      };
      localStorage.setItem('dayone_token', 'mock_secure_bearer_token_v2');
      localStorage.setItem('dayone_user', JSON.stringify(user));
      onLogin(user);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl">
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-700" />

      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 relative z-10">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-10 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <ShieldCheck className="w-6 h-6 text-white/30" />
          </div>
          
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20 shadow-inner">
            <span className="text-4xl font-black tracking-tighter">D1</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">
            {isLogin ? 'Sign In' : 'Join DayOne'}
          </h2>
          <p className="text-indigo-100/70 text-sm font-medium">
            {isLogin ? 'Enter your credentials to continue.' : 'Start your journey to peak productivity.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Your Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all dark:text-white"
                placeholder="hello@dayone.ai"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Password</label>
              {isLogin && <button type="button" className="text-xs text-indigo-500 font-bold hover:underline">Forgot?</button>}
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-700 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="relative z-10">{isLogin ? 'Sign Into Dashboard' : 'Create My Account'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {isLogin ? "New to DayOne?" : "Already a member?"}{' '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                {isLogin ? "Sign up for free" : "Log in to account"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
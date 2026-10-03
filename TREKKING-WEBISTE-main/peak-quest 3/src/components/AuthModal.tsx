import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Mail, Lock, User, CheckCircle2, Shield, Mountain } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please provide your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
        email,
        phone: phone || '+91 98765 43210',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80`,
        authMethod: 'email',
        savedTreks: [],
        experienceLevel: 'Intermediate'
      };

      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    }, 700);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user: UserProfile = {
        id: `user-google-${Date.now()}`,
        name: 'Ashwini Saurabh',
        email: 'ashwinisau888@gmail.com',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authMethod: 'google',
        savedTreks: ['kedarkantha-trek', 'triund-trek'],
        experienceLevel: 'Intermediate'
      };

      setIsLoading(false);
      onAuthSuccess(user);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2822]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#FDFCF7] text-[#2D3633] rounded-2xl shadow-2xl border border-[#E8E4D9] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#1E2822] text-[#FDFCF7] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4A6741] flex items-center justify-center text-white">
                <Mountain className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-lg tracking-tight">Peak Quest</span>
            </div>
            <button
              id="close-auth-modal-btn"
              onClick={onClose}
              className="text-[#D1CDC0] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 relative z-10">
            <h3 className="text-xl font-bold font-heading">
              {mode === 'login' ? 'Welcome Back, Trekker' : 'Join Peak Quest'}
            </h3>
            <p className="text-[#D1CDC0] text-xs mt-1">
              {mode === 'login'
                ? 'Access your Himalayan permits, booked batches, and trail notes.'
                : 'Create your account to book Himachal & Uttarakhand expeditions.'}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E8E4D9] bg-[#F3F1EA]">
          <button
            id="auth-tab-login-btn"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-[#4A6741] text-[#2D4F1E] bg-[#FDFCF7]'
                : 'border-transparent text-[#5C6662] hover:text-[#2D3633]'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup-btn"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              mode === 'signup'
                ? 'border-[#4A6741] text-[#2D4F1E] bg-[#FDFCF7]'
                : 'border-transparent text-[#5C6662] hover:text-[#2D3633]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C2C0] text-[#8B3A36] text-xs font-medium">
              {error}
            </div>
          )}

          {/* Google 1-Click Sign-in */}
          <button
            id="google-signin-btn"
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 bg-white border border-[#E8E4D9] rounded-xl hover:bg-[#F3F1EA] transition-colors flex items-center justify-center gap-3 text-xs font-bold text-[#2D3633] shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 text-[#8B9691] text-xs">
            <div className="h-px bg-[#E8E4D9] flex-1" />
            <span>or email</span>
            <div className="h-px bg-[#E8E4D9] flex-1" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#5C6662] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                  <input
                    id="auth-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ashwini Saurabh"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#5C6662] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6662] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                <input
                  id="auth-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#5C6662] mb-1">Mobile Number (Optional)</label>
                <input
                  id="auth-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                />
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8B5E3C] hover:bg-[#734B2E] text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md text-xs mt-2 disabled:opacity-50"
            >
              {isLoading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to Peak Quest'
                : 'Create Free Account'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-[#5C6662] flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#4A6741]" />
            <span>Secure 256-bit encryption for all permits & bookings.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

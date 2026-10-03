import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Mail, Lock, User, Shield, Mountain, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const buildUserProfile = (supaUser: any, displayName?: string): UserProfile => ({
    id: supaUser.id,
    name:
      displayName ||
      supaUser.user_metadata?.full_name ||
      (supaUser.email?.split('@')[0] ?? 'Trekker'),
    email: supaUser.email ?? '',
    phone: phone || supaUser.user_metadata?.phone || '+91 98765 43210',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName || supaUser.email?.split('@')[0] || 'T'
    )}&background=4A6741&color=FDFCF7&size=120`,
    authMethod: 'email',
    savedTreks: [],
    experienceLevel: 'Intermediate',
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
              phone: phone.trim() || undefined,
            },
          },
        });

        if (signUpError) throw signUpError;

        // If email confirmation is required, data.user exists but session may be null
        if (data.user && data.session) {
          onAuthSuccess(buildUserProfile(data.user, name.trim()));
          onClose();
        } else if (data.user) {
          // Email confirmation required
          setSuccessMsg(
            '✅ Account created! Check your email to verify, then sign in.'
          );
          setMode('login');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          onAuthSuccess(buildUserProfile(data.user));
          onClose();
        }
      }
    } catch (err: any) {
      // Map Supabase error messages to user-friendly text
      const msg: string = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please verify your email first, then sign in.');
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setMode('login');
      } else if (msg.includes('Password should be')) {
        setError('Password must be at least 6 characters.');
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
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
                ? 'Sign in to access your permits, booked batches, and trail notes.'
                : 'Create your account to book Himalayan & Indian expeditions.'}
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E8E4D9] bg-[#F3F1EA]">
          <button
            id="auth-tab-login-btn"
            onClick={() => switchMode('login')}
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
            onClick={() => switchMode('signup')}
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
          {/* Error banner */}
          {error && (
            <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F5C2C0] text-[#8B3A36] text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success banner */}
          {successMsg && (
            <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#A8C69F] text-[#2D4F1E] text-xs font-medium">
              {successMsg}
            </div>
          )}

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
                    placeholder="e.g. Rahul Sharma"
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5C6662] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8B9691] absolute left-3 top-2.5" />
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm border border-[#E8E4D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white text-[#2D3633]"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8B9691] hover:text-[#2D3633] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-[10px] text-[#8B9691] mt-1 ml-1">Minimum 6 characters</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#5C6662] mb-1">
                  Mobile Number <span className="font-normal text-[#8B9691]">(Optional)</span>
                </label>
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
              className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-md text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign In to Peak Quest'
                : 'Create Free Account'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-[#5C6662] flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#4A6741]" />
            <span>Secured by Supabase Auth — 256-bit encryption.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

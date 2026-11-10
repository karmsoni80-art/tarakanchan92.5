import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { api } from '../../services/api';

export const AuthModal: React.FC = () => {
  const { authModalView, setAuthModalView, login, register, isLoading } = useAuth();
  const { showToast } = useCartWishlist();

  if (!authModalView) return null;

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setPhone('');
    setOtp('');
    setErrorMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await login(email, password);
      showToast(`Welcome back to TARAKANCHAN!`, 'success');
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    try {
      await register(name, email, password, phone);
      showToast(`Welcome to TARAKANCHAN, ${name}! Your account has been created.`, 'success');
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await api.forgotPassword(email);
      setDemoOtpHint(res.demoOtp);
      showToast(res.message, 'info');
      setAuthModalView('otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send reset instructions');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await api.verifyOtp(otp);
      showToast('OTP verified successfully. Please enter your new password.', 'success');
      setAuthModalView('reset');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid OTP code');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    try {
      const msg = await api.resetPassword(email, password);
      showToast(msg, 'success');
      setAuthModalView('login');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Reset password failed');
    }
  };

  // Quick One-Click Demo logins for testing
  const loginAsCustomer = () => {
    setEmail('customer@tarakanchan.com');
    setPassword('password123');
    login('customer@tarakanchan.com', 'password123').then(() => {
      showToast('Logged in as Priya Sharma (Customer)', 'success');
    });
  };

  const loginAsAdmin = () => {
    setEmail('admin@tarakanchan.com');
    setPassword('admin');
    login('admin@tarakanchan.com', 'admin').then(() => {
      showToast('Logged in as Master Jeweller (Administrator)', 'success');
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#3E2630] border border-[#D4AF37]/50 rounded-2xl max-w-md w-full text-[#F8F1F1] shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalView(null);
            resetForm();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#6F4C57]/50 hover:bg-[#6F4C57] text-white transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6F4C57]/40 border border-[#D4AF37]/40 text-[#D4AF37] mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#F8F1F1]">
            {authModalView === 'login' && 'Welcome to TARAKANCHAN'}
            {authModalView === 'register' && 'Join the Silver Circle'}
            {authModalView === 'forgot' && 'Reset Your Password'}
            {authModalView === 'otp' && 'Verify 6-Digit Code'}
            {authModalView === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-zinc-300 font-light mt-1">
            {authModalView === 'login' && 'Sign in to access your orders, saved addresses, and wishlist.'}
            {authModalView === 'register' && 'Create your account and unlock ₹500 off your first purchase.'}
            {authModalView === 'forgot' && 'Enter your registered email to receive an OTP verification code.'}
            {authModalView === 'otp' && `Enter the code sent to ${email || 'your email'}.`}
            {authModalView === 'reset' && 'Choose a strong password to secure your account.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* View 1: LOGIN */}
        {authModalView === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[#E8C7CC]">Password</label>
                <button
                  type="button"
                  onClick={() => setAuthModalView('forgot')}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow-lg transition cursor-pointer"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-2 border-t border-[#6F4C57]/40 space-y-2">
              <p className="text-[10px] text-center text-zinc-400 uppercase tracking-wider">
                Instant Demo Access (Single-Click)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={loginAsCustomer}
                  className="py-1.5 px-2 rounded-lg bg-[#6F4C57]/40 hover:bg-[#6F4C57] text-[11px] text-zinc-200 border border-[#6F4C57] transition"
                >
                  👤 Customer Demo
                </button>
                <button
                  type="button"
                  onClick={loginAsAdmin}
                  className="py-1.5 px-2 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[11px] text-[#D4AF37] border border-[#D4AF37]/40 font-medium transition"
                >
                  👑 Admin Demo
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-zinc-300">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setAuthModalView('register')}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* View 2: REGISTER */}
        {authModalView === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Mobile Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Password (Min 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow-lg transition cursor-pointer"
            >
              {isLoading ? 'Creating Account...' : 'Register & Claim ₹500 Voucher'}
            </button>

            <div className="text-center pt-2 text-xs text-zinc-300">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* View 3: FORGOT PASSWORD */}
        {authModalView === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Registered Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow-lg transition cursor-pointer"
            >
              Send Verification OTP
            </button>

            <div className="text-center pt-2 text-xs text-zinc-300">
              Back to{' '}
              <button
                type="button"
                onClick={() => setAuthModalView('login')}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* View 4: OTP VERIFICATION */}
        {authModalView === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#6F4C57]/30 border border-[#D4AF37]/40 text-center text-xs text-[#D4AF37]">
              Demo Verification Code: <strong className="text-white text-sm">925001</strong>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="925001"
                  className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-2.5 text-xs text-center tracking-widest font-mono text-white text-base focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow-lg transition cursor-pointer"
            >
              Verify Code
            </button>
          </form>
        )}

        {/* View 5: RESET PASSWORD */}
        {authModalView === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#E8C7CC] mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#6F4C57]/30 border border-[#6F4C57] focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#B76E79] hover:bg-[#C8A4A6] text-white text-xs font-medium tracking-wider shadow-lg transition cursor-pointer"
            >
              Save New Password & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

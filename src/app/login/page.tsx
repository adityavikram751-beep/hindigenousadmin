'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  KeyRound,
  ArrowRight,
  Loader2,
  Server,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, baseUrl, updateBaseUrl } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1); // 1: Email, 2: OTP, 3: New Password
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Base URL edit toggle
  const [showServerInput, setShowServerInput] = useState(false);
  const [tempBaseUrl, setTempBaseUrl] = useState(baseUrl);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Error', 'Please fill in email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res.token || res.accessToken;
      if (!token) {
        throw new Error(res.message || 'Token not returned from server');
      }
      login(token, { email, username: res.user?.username || email.split('@')[0] });
      showToast('Login Successful', 'Welcome to Hindigenous Admin Portal', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(
        'Login Failed',
        err.response?.data?.message || err.message || 'Invalid email or password',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      showToast('Error', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({ username, email, password });
      showToast('Registration Successful', res.message || 'Admin account created. Please sign in.', 'success');
      setTab('login');
    } catch (err: any) {
      showToast(
        'Sign Up Failed',
        err.response?.data?.message || err.message || 'Could not register admin',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Flow
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Error', 'Please enter your registered email', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setVerificationId(res.verificationId || 'verified-id');
      showToast('OTP Sent', res.message || 'OTP sent to your email', 'info');
      setForgotStep(2);
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || err.message || 'Failed to send OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      showToast('Error', 'Please enter the OTP', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(verificationId, otp);
      showToast('OTP Verified', res.message || 'OTP verified successfully', 'success');
      setForgotStep(3);
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || err.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Error', 'Please enter new password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.changePassword({ email, newpassword: newPassword });
      showToast('Password Changed', res.message || 'Password changed successfully. Please login.', 'success');
      setTab('login');
      setForgotStep(1);
    } catch (err: any) {
      showToast('Error', err.response?.data?.message || err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Top Bar: Server Config */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Server className="w-4 h-4 text-indigo-400" />
          <span className="font-mono truncate max-w-[200px]">{baseUrl}</span>
        </div>
        <button
          onClick={() => setShowServerInput(!showServerInput)}
          className="text-xs text-amber-400 hover:underline font-semibold"
        >
          {showServerInput ? 'Close' : 'Change Backend'}
        </button>
      </div>

      {showServerInput && (
        <div className="w-full max-w-md mx-auto mt-2 p-3 bg-[#111827] border border-[#1E293B] rounded-xl z-10 flex gap-2">
          <input
            type="text"
            value={tempBaseUrl}
            onChange={(e) => setTempBaseUrl(e.target.value)}
            placeholder="http://localhost:5000"
            className="flex-1 bg-[#090D16] border border-[#1E293B] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => {
              updateBaseUrl(tempBaseUrl);
              setShowServerInput(false);
              showToast('Target Server Updated', `Base URL set to ${tempBaseUrl}`, 'info');
            }}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg"
          >
            Save
          </button>
        </div>
      )}

      {/* Main Auth Container */}
      <div className="w-full max-w-md mx-auto my-auto z-10 pt-4 pb-8">
        <div className="bg-[#111827] rounded-2xl p-6 sm:p-8 border border-[#1E293B] shadow-2xl relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Hindigenous</h1>
            <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase">
              Admin CMS Portal
            </p>
          </div>

          {/* Navigation Tabs */}
          {tab !== 'forgot' && (
            <div className="flex bg-[#090D16] p-1 rounded-xl mb-6 border border-[#1E293B]">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'login'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Login
              </button>
              <button
                type="button"
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  tab === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register Admin
              </button>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('forgot');
                      setForgotStep(1);
                    }}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin_user"
                    className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password123"
                    className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Admin Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD STEP FLOW */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                Password Reset Helper
              </h3>

              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Enter Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-center font-mono text-white tracking-widest focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 3 && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Enter New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="NewPassword123"
                        className="w-full bg-[#1E293B]/50 border border-[#1E293B] rounded-xl pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                        title={showNewPassword ? 'Hide Password' : 'Show Password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => setTab('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 z-10">
        Hindigenous © {new Date().getFullYear()} • Secure Admin Control Panel
      </footer>
    </div>
  );
}

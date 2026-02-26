'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const EMPTY_FORM = { name: '', email: '', password: '', confirm: '' };
  const [form, setForm]             = useState(EMPTY_FORM);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [registeredName, setRegisteredName] = useState('');
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm, setShowConfirm]       = useState(false);
  const [countdown, setCountdown]           = useState(3);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) router.replace('/predict');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8 || form.password.length > 16) {
      setError('Password must be between 8 and 16 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Save name, reset form, show success screen
      setRegisteredName(form.name.split(' ')[0]);
      setForm(EMPTY_FORM);
      setSuccess(true);

      // Countdown + redirect
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          router.push('/login?registered=1');
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Eye icon SVGs ────────────────────────────────────────────
  const EyeOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  const eyeBtnStyle = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
    color: '#64748b', display: 'flex', alignItems: 'center',
    transition: 'color 0.2s ease',
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ← Back to Home — fixed top-left */}
      {!success && (
        <Link href="/" style={{
          position: 'fixed', top: '20px', left: '20px', zIndex: 10,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: '#64748b', textDecoration: 'none',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px', padding: '7px 12px',
          backdropFilter: 'blur(8px)', transition: 'color 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Home
        </Link>
      )}

      {/* Background blobs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        top: '-100px', left: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
        bottom: '-100px', right: '-100px', pointerEvents: 'none',
      }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" opacity="0.6"/>
                <path d="M12 22a10 10 0 0 1-10-10" opacity="0.6"/>
                <path d="M2 12a10 10 0 0 1 10-10" opacity="0.3"/>
                <path d="M22 12a10 10 0 0 1-10 10" opacity="0.3"/>
                <line x1="12" y1="2" x2="12" y2="5" strokeWidth="2"/>
                <line x1="12" y1="19" x2="12" y2="22" strokeWidth="2"/>
                <line x1="2" y1="12" x2="5" y2="12" strokeWidth="2"/>
                <line x1="19" y1="12" x2="22" y2="12" strokeWidth="2"/>
              </svg>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 800, color: 'white' }}>
              CancerDetect <span style={{ color: '#00d4ff' }}>AI</span>
            </span>
          </Link>

          {!success && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '32px', marginBottom: '8px' }}>Create account</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Start detecting cancer types with AI</p>
            </>
          )}
        </div>

        {/* ── SUCCESS SCREEN ───────────────────────────────────── */}
        {success ? (
          <div className="glass animate-fade-in" style={{ padding: '48px 36px', textAlign: 'center' }}>
            {/* Animated checkmark circle */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 24px',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} className="animate-pulse-glow">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px', color: '#f1f5f9' }}>
              Welcome, {registeredName}!
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.65, marginBottom: '28px' }}>
              Your account has been created successfully.<br/>
              Please sign in to access CancerDetect AI.
            </p>

            {/* Countdown ring */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', borderRadius: '999px',
              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '13px', color: 'white',
              }}>
                {countdown}
              </div>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Redirecting to login...
              </span>
            </div>

            <div>
              <button
                className="btn-primary"
                onClick={() => router.push('/login?registered=1')}
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                <span>Go to Login now →</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── REGISTER FORM ──────────────────────────────────── */
          <div className="glass" style={{ padding: '36px' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Full name */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                  Full name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Dr. Jane Smith"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field"
                    placeholder="8–16 characters"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    minLength={8}
                    maxLength={16}
                    style={{ paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeBtnStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                  Confirm password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="input-field"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    style={{ paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={eyeBtnStyle}
                    onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '14px', marginTop: '4px' }}
              >
                <span>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </span>
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#475569' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#334155', marginTop: '20px', lineHeight: 1.6 }}>
          By creating an account, you agree this tool is for educational &amp; research purposes only.
        </p>
      </div>
    </div>
  );
}

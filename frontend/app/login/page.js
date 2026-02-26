'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === '1';
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) router.replace('/predict');
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.access_token);
      router.push('/predict');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--navy)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ← Back to Home — fixed top-left */}
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

      {/* Background blobs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)',
        top: '-100px', right: '-100px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
        bottom: '-100px', left: '-100px', pointerEvents: 'none',
      }} />

      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '420px' }}>
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

          <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '32px', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Sign in to your account to continue</p>
        </div>

        <div className="glass" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {justRegistered && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                color: '#86efac', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Account created successfully! Please sign in.
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', fontSize: '13px',
              }}>{error}</div>
            )}

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

            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', marginBottom: '8px', display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: '#64748b', display: 'flex', alignItems: 'center',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px' }}>
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#475569' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--navy)' }} />}>
      <LoginForm />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const allNavLinks = [
    { href: '/', label: 'Home', guestOnly: true },
    { href: '/predict', label: 'Predict', authOnly: true },
    { href: '/history', label: 'History', authOnly: true },
    { href: '/about', label: 'About' },
  ];

  const navLinks = allNavLinks.filter(link => {
    if (link.guestOnly && user) return false;   // hide Home when logged in
    if (link.authOnly && !user) return false;   // hide Predict/History when logged out
    return true;
  });

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href={user ? '/predict' : '/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
          <span style={{ fontWeight: 700, fontSize: '17px', color: 'white' }}>
             <span style={{ color: '#00d4ff' }}>CancerDetect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                Hi, <span style={{ color: '#00d4ff' }}>{user.name.split(' ')[0]}</span>
              </span>
              <button className="btn-outline" onClick={handleLogout} style={{ padding: '8px 16px', fontSize: '13px' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/login">
                <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  <span>Get Started</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

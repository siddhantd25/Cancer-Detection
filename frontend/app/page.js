'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';

const CANCER_TYPES = [
  { name: 'ALL', icon: '🩸', color: '#ef4444' },
  { name: 'Brain Cancer', icon: '🧠', color: '#8b5cf6' },
  { name: 'Breast Cancer', icon: '🎗️', color: '#ec4899' },
  { name: 'Cervical Cancer', icon: '🔬', color: '#f59e0b' },
  { name: 'Kidney Cancer', icon: '🫘', color: '#06b6d4' },
  { name: 'Lung & Colon Cancer', icon: '🫁', color: '#22c55e' },
  { name: 'Lymphoma', icon: '🦠', color: '#00d4ff' },
  { name: 'Oral Cancer', icon: '🦷', color: '#f97316' },
];

const STEPS = [
  { num: '01', title: 'Upload Image', desc: 'Drag and drop or browse your medical scan or histopathology image.', icon: '📤' },
  { num: '02', title: 'AI Analysis', desc: 'Our MobileNetV3Large model processes and classifies the image in seconds.', icon: '🤖' },
  { num: '03', title: 'Get Results', desc: 'View the predicted cancer type, confidence score, and top-3 breakdown.', icon: '📊' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background blobs */}
        <div style={{
          position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          top: '10%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
          bottom: '20%', right: '10%', pointerEvents: 'none',
        }} />

        <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
          <span style={{
            display: 'inline-block', padding: '6px 18px', borderRadius: '999px',
            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
            fontSize: '13px', color: '#00d4ff', fontWeight: 500,
          }}>
            🔬 Powered by MobileNetV3Large · 8 Cancer Types
          </span>
        </div>

        <h1 className="animate-fade-in-up delay-100" style={{
          fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.1,
          marginBottom: '24px', letterSpacing: '-0.03em',
        }}>
          Detect Cancer with{' '}
          <span className="gradient-text">AI Precision</span>
        </h1>

        <p className="animate-fade-in-up delay-200" style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: '560px',
          lineHeight: 1.7, marginBottom: '40px',
        }}>
          Upload a medical image and receive instant AI-powered cancer type classification
          with confidence scores and detailed analysis.
        </p>

        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
              <span>🚀 Get Started Free</span>
            </button>
          </Link>
          <Link href="/about">
            <button className="btn-outline" style={{ padding: '16px 36px', fontSize: '16px' }}>
              Learn More
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400" style={{
          display: 'flex', gap: '40px', marginTop: '64px', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {[['8', 'Cancer Types'], ['224×224', 'Image Input'], ['< 5s', 'Analysis Time'], ['Top-3', 'Predictions']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '28px', fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>
            Three simple steps from image to diagnosis-ready results
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {STEPS.map((step) => (
            <div key={step.num} className="glass" style={{ padding: '32px 28px', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '20px', right: '20px',
                fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em',
              }}>{step.num}</div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{step.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cancer types */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            Supported <span className="gradient-text">Cancer Types</span>
          </h2>
          <p style={{ color: '#94a3b8' }}>Our model is trained to classify 8 distinct cancer categories</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {CANCER_TYPES.map((c) => (
            <div key={c.name} className="glass" style={{
              padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${c.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: `${c.color}18`, border: `1px solid ${c.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{c.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="glass" style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Ready to <span className="gradient-text">Get Started?</span>
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.7 }}>
            Create a free account and upload your first medical image in under 60 seconds.
          </p>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
              <span>Create Free Account</span>
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '13px',
      }}>
        <p>© 2026 CancerDetect AI · For educational & research purposes only</p>
      </footer>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const CANCER_TYPES = [
  { name: 'ALL', full: 'Acute Lymphoblastic Leukemia', icon: '🩸', color: '#ef4444' },
  { name: 'Brain', full: 'Brain & CNS Tumors', icon: '🧠', color: '#8b5cf6' },
  { name: 'Breast', full: 'Breast Carcinoma', icon: '🎗️', color: '#ec4899' },
  { name: 'Cervical', full: 'Cervical Carcinoma', icon: '🔬', color: '#f59e0b' },
  { name: 'Kidney', full: 'Renal Cell Carcinoma', icon: '🫘', color: '#06b6d4' },
  { name: 'Lung & Colon', full: 'Lung & Colorectal', icon: '🫁', color: '#22c55e' },
  { name: 'Lymphoma', full: 'Lymphatic Cancer', icon: '🦠', color: '#00d4ff' },
  { name: 'Oral', full: 'Oral Cavity Cancer', icon: '🦷', color: '#f97316' },
];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.6"/><path d="M12 22a10 10 0 0 1-10-10" opacity="0.6"/>
        <line x1="12" y1="2" x2="12" y2="5" strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="22" strokeWidth="2"/>
        <line x1="2" y1="12" x2="5" y2="12" strokeWidth="2"/><line x1="19" y1="12" x2="22" y2="12" strokeWidth="2"/>
      </svg>
    ),
    color: '#00d4ff',
    title: 'Deep Learning Model',
    desc: 'Built on MobileNetV3Large — a state-of-the-art convolutional neural network optimised for accurate medical image classification across 8 cancer categories.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    color: '#7c3aed',
    title: 'Batch Upload',
    desc: 'Analyse up to 5 medical images in a single submission. Each image is processed independently with its own confidence score and cancer type prediction.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: '#22c55e',
    title: 'Instant Results',
    desc: 'Receive predictions in under 5 seconds with a top-3 ranked breakdown, confidence percentage bar, and additional context about the detected cancer type.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    color: '#f59e0b',
    title: 'Prediction History',
    desc: 'Every prediction is saved to your personal history. Filter by cancer type, view detailed results, or remove entries — all in one place.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    color: '#06b6d4',
    title: 'Secure & Private',
    desc: 'Authenticated accounts keep your data yours. Images are stored in the cloud under your unique user folder — no one else can access your predictions.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    color: '#ec4899',
    title: 'Multi-Format Support',
    desc: 'Accepts PNG, JPG, JPEG, BMP, and TIFF images. Works with histopathology slides, CT scans, MRI images, and microscopy photographs.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Create an Account',
    desc: 'Sign up in seconds. Your data is protected behind authentication with encrypted passwords.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Upload Medical Image',
    desc: 'Drag & drop or browse your histopathology slide, CT scan, MRI, or microscopy image. Single or batch up to 5.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16"/>
        <line x1="12" y1="12" x2="12" y2="21"/>
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'AI Analysis',
    desc: 'MobileNetV3Large processes the image in seconds — the model runs fully server-side, so no data stays in your browser.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.6"/><path d="M12 22a10 10 0 0 1-10-10" opacity="0.6"/>
        <line x1="12" y1="2" x2="12" y2="5" strokeWidth="2"/><line x1="12" y1="19" x2="12" y2="22" strokeWidth="2"/>
        <line x1="2" y1="12" x2="5" y2="12" strokeWidth="2"/><line x1="19" y1="12" x2="22" y2="12" strokeWidth="2"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'View Results',
    desc: 'Get the predicted cancer type, confidence score, top-3 probabilities with a bar chart, and descriptive context.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: 'What types of images does the model accept?',
    a: 'Any standard medical image format: PNG, JPG, JPEG, BMP, or TIFF. This includes histopathology slides, CT scans, MRI images, and microscopy photographs. The image is resized to 224×224px before inference.',
  },
  {
    q: 'Which cancer types can be detected?',
    a: 'The model classifies images into 8 categories: Acute Lymphoblastic Leukemia (ALL), Brain Cancer, Breast Cancer, Cervical Cancer, Kidney Cancer, Lung & Colon Cancer, Lymphoma, and Oral Cancer.',
  },
  {
    q: 'How accurate is the model?',
    a: 'The model is built on MobileNetV3Large and trained on labelled medical image datasets. Confidence scores are provided with every prediction. However, it is intended for educational use only — not clinical diagnosis.',
  },
  {
    q: 'Is my data kept private?',
    a: 'Yes. Each account is protected by authentication & Security. Your images are stored in a personal folder accessible only to you. Predictions are saved to your own private history.',
  },
  {
    q: 'Can I analyse multiple images at once?',
    a: 'Yes — use Batch Upload mode on the Predict page to submit up to 5 images simultaneously. Each is processed independently and results are displayed as an expandable accordion.',
  },
];

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('token')) router.replace('/predict');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', overflowX: 'hidden' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
          top: '5%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
          bottom: '10%', right: '5%', pointerEvents: 'none',
        }} />

        <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 18px', borderRadius: '999px',
            background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
            fontSize: '13px', color: '#00d4ff', fontWeight: 500,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00d4ff', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Powered by MobileNetV3Large · 8 Cancer Types
          </span>
        </div>

        <h1 className="animate-fade-in-up delay-100" style={{
          fontSize: 'clamp(40px, 7vw, 82px)', fontWeight: 900, lineHeight: 1.08,
          marginBottom: '24px', letterSpacing: '-0.03em',
        }}>
          Detect Cancer with{' '}
          <span className="gradient-text">AI Like Precision</span>
        </h1>

        <p className="animate-fade-in-up delay-200" style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: '580px',
          lineHeight: 1.7, marginBottom: '40px',
        }}>
          Upload a medical image and receive instant cancer type classification with
          confidence scores, top-3 predictions, and detailed analysis — powered by deep learning.
        </p>

        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '72px' }}>
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
          display: 'flex', gap: '0', flexWrap: 'wrap', justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', overflow: 'hidden',
        }}>
          {[
            ['8', 'Cancer Types', '#00d4ff'],
            ['224×224', 'Input Size', '#7c3aed'],
            ['< 5s', 'Analysis Time', '#22c55e'],
            ['Top-3', 'Predictions', '#f59e0b'],
            ['Batch', 'Up to 5 Images', '#ec4899'],
          ].map(([val, label, color], i, arr) => (
            <div key={label} style={{
              padding: '20px 32px', textAlign: 'center',
              borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            Everything You <span className="gradient-text">Need</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '440px', margin: '0 auto', fontSize: '15px' }}>
            A complete medical image analysis toolkit built for researchers and students
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="glass" style={{ padding: '28px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px', marginBottom: '18px',
                background: `${f.color}12`, border: `1px solid ${f.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: '#f1f5f9' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto' }}>
            Four simple steps from sign-up to results
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {STEPS.map((step, i) => (
            <div key={step.num} className="glass" style={{ padding: '28px 24px', position: 'relative' }}>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', top: '36px', right: '-10px', width: '20px', height: '1px',
                  background: 'linear-gradient(90deg,rgba(0,212,255,0.4),transparent)',
                  display: 'none', // shown on wider screens via inline — simplify
                }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#00d4ff',
                }}>{step.icon}</div>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em',
                }}>STEP {step.num}</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: '#f1f5f9' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CANCER TYPES ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            8 Supported <span className="gradient-text">Cancer Types</span>
          </h2>
          <p style={{ color: '#94a3b8' }}>Our model is trained to classify each of the following categories</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {CANCER_TYPES.map((c) => (
            <div key={c.name} className="glass" style={{
              padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'default',
              borderLeft: `3px solid ${c.color}44`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 30px ${c.color}22`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: `${c.color}18`, border: `1px solid ${c.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9' }}>{c.name}</div>
                <div style={{ fontSize: '11px', color: c.color, marginTop: '2px' }}>{c.full}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <Link href="/about">
            <button className="btn-outline" style={{ padding: '10px 28px', fontSize: '14px' }}>
              View detailed info on each type →
            </button>
          </Link>
        </div>
      </section>

      {/* ── MODEL TECHNOLOGY ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px', alignItems: 'center',
        }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.2 }}>
              Built on <span className="gradient-text">MobileNetV3Large</span>
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '14px', marginBottom: '20px' }}>
              MobileNetV3Large is a highly efficient deep convolutional neural network architecture
              designed by Google. It achieves strong classification accuracy while remaining fast and
              lightweight — ideal for real-time medical image inference.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '14px', marginBottom: '24px' }}>
              The model takes 224×224 pixel input and uses <strong style={{ color: '#f1f5f9' }}>depthwise separable convolutions</strong>,
              a <strong style={{ color: '#f1f5f9' }}>hard-swish activation function</strong>, and <strong style={{ color: '#f1f5f9' }}>Squeeze-and-Excite</strong> modules
              to extract rich visual features from tissue and scan images.
            </p>
            <Link href="/about">
              <button className="btn-outline" style={{ padding: '10px 24px', fontSize: '14px' }}>
                About the Model →
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Architecture', value: 'MobileNetV3Large', color: '#00d4ff' },
              { label: 'Input Resolution', value: '224 × 224 pixels', color: '#7c3aed' },
              { label: 'Preprocessing', value: 'mobilenet_v3.preprocess_input', color: '#22c55e' },
              { label: 'Output Classes', value: '8 cancer types', color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} className="glass" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="glass" style={{ padding: '22px 24px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
                  background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, color: 'white',
                }}>Q</div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>{faq.q}</p>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="glass" style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)',
          }} />
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            Ready to <span className="gradient-text">Get Started?</span>
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto 32px' }}>
            Create a free account and upload your first medical image in under 60 seconds.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register">
              <button className="btn-primary" style={{ padding: '16px 40px', fontSize: '16px' }}>
                <span>Create Free Account</span>
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-outline" style={{ padding: '16px 32px', fontSize: '16px' }}>
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '13px',
      }}>
        <p>© 2026 CancerDetect · For educational &amp; research purposes only · Not a medical device</p>
      </footer>
    </div>
  );
}

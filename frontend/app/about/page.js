'use client';

import Navbar from '../../components/Navbar';
import Link from 'next/link';

const CANCERS = [
  {
    name: 'ALL',
    full: 'Acute Lymphoblastic Leukemia',
    icon: '🩸',
    color: '#ef4444',
    desc: 'A type of cancer of the blood and bone marrow that affects white blood cells (lymphocytes). It progresses rapidly and is most common in children, though it can occur at any age.',
  },
  {
    name: 'Brain Cancer',
    full: 'Brain & CNS Tumors',
    icon: '🧠',
    color: '#8b5cf6',
    desc: 'Tumors originating in the brain or spinal cord, including gliomas, meningiomas, and medulloblastomas. Symptoms include headaches, seizures, and cognitive changes.',
  },
  {
    name: 'Breast Cancer',
    full: 'Breast Carcinoma',
    icon: '🎗️',
    color: '#ec4899',
    desc: 'The most common cancer in women worldwide, forming in breast lobules or ducts. Detected via mammograms and biopsies; highly treatable when caught early.',
  },
  {
    name: 'Cervical Cancer',
    full: 'Cervical Carcinoma',
    icon: '🔬',
    color: '#f59e0b',
    desc: 'Forms in the cells of the cervix, often caused by high-risk HPV strains. Regular Pap smears and HPV vaccination are primary prevention methods.',
  },
  {
    name: 'Kidney Cancer',
    full: 'Renal Cell Carcinoma',
    icon: '🫘',
    color: '#06b6d4',
    desc: 'The most common kidney cancer in adults, starting in the renal tubules. Risk factors include smoking, obesity, and high blood pressure. Often detected incidentally on imaging.',
  },
  {
    name: 'Lung & Colon Cancer',
    full: 'Lung & Colorectal Cancers',
    icon: '🫁',
    color: '#22c55e',
    desc: 'Covers cancers of the lung (non-small and small cell) and colorectum. Lung cancer is a leading cause of cancer death; colon cancer is highly treatable via colonoscopy screening.',
  },
  {
    name: 'Lymphoma',
    full: 'Lymphatic System Cancer',
    icon: '🦠',
    color: '#00d4ff',
    desc: 'Cancer of the lymphatic system, including Hodgkin and Non-Hodgkin lymphoma. Affects lymph nodes, spleen, and bone marrow. Often presents with swollen lymph nodes and fatigue.',
  },
  {
    name: 'Oral Cancer',
    full: 'Oral Cavity & Oropharyngeal Cancer',
    icon: '🦷',
    color: '#f97316',
    desc: 'Affects the lips, tongue, gums, and throat lining. Main risk factors are tobacco, alcohol, and HPV infection. Early warning signs include persistent mouth sores or lumps.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Header */}
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, marginBottom: '16px' }}>
            About <span className="gradient-text">CancerDetect AI</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            A deep learning application for educational cancer classification using MobileNetV3Large,
            trained to identify 8 distinct cancer types from medical images.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="animate-fade-in-up" style={{
          padding: '20px 24px', borderRadius: '14px', marginBottom: '60px',
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', gap: '14px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '22px', flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#fca5a5', marginBottom: '4px' }}>
              Important Disclaimer
            </p>
            <p style={{ fontSize: '13px', color: '#fca5a5', opacity: 0.8, lineHeight: 1.6 }}>
              This tool is for <strong>educational and research purposes only</strong>. It is NOT a medical device
              and should NOT be used for clinical diagnosis or treatment decisions. Always consult a qualified
              medical professional for any health concerns or diagnosis.
            </p>
          </div>
        </div>

        {/* Model info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '64px' }}>
          {[
            { label: 'Model', value: 'MobileNetV3Large', icon: '🤖' },
            { label: 'Input Size', value: '224 × 224 px', icon: '📐' },
            { label: 'Cancer Types', value: '8 Classes', icon: '🔢' },
            { label: 'Output', value: 'Top-3 + Confidence', icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className="glass" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cancer type cards */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            Supported <span className="gradient-text">Cancer Types</span>
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px', fontSize: '14px' }}>
            Click on any card to learn more about each cancer type
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {CANCERS.map((c) => (
              <div
                key={c.name}
                className="glass"
                style={{
                  padding: '24px', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${c.color}22`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                    background: `${c.color}18`, border: `1px solid ${c.color}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: c.color }}>{c.full}</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass" style={{ padding: '48px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>
            Ready to try it?
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '14px' }}>
            Upload a medical image and see the AI in action
          </p>
          <Link href="/predict">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>
              <span>🔬 Go to Predict</span>
            </button>
          </Link>
        </div>
      </div>

      <footer style={{
        textAlign: 'center', padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '13px',
      }}>
        <p>© 2026 CancerDetect AI · For educational & research purposes only</p>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

const CANCERS = [
  {
    name: 'ALL',
    full: 'Acute Lymphoblastic Leukemia',
    icon: '🩸',
    color: '#ef4444',
    desc: 'A type of cancer of the blood and bone marrow that affects white blood cells (lymphocytes). It progresses rapidly and is most common in children, though it can occur at any age.',
    symptoms: ['Fatigue and weakness', 'Frequent infections', 'Fever or night sweats', 'Easy bruising or bleeding', 'Bone or joint pain', 'Swollen lymph nodes'],
    riskFactors: ['Previous cancer treatment (chemotherapy/radiation)', 'Genetic disorders (Down syndrome)', 'Exposure to high levels of radiation', 'Family history of leukemia'],
    treatment: 'Primary treatment is chemotherapy, often in phases: induction, consolidation, and maintenance. Stem cell transplant may be needed for high-risk cases. Modern protocols achieve remission in over 90% of children.',
    survival: '90%+ in children; ~40% in adults (5-year survival)',
  },
  {
    name: 'Brain Cancer',
    full: 'Brain & CNS Tumors',
    icon: '🧠',
    color: '#8b5cf6',
    desc: 'Tumors originating in the brain or spinal cord tissue, including gliomas, meningiomas, and medulloblastomas. Primary brain tumors account for about 1.4% of all cancers.',
    symptoms: ['Persistent or severe headaches', 'Seizures (new onset)', 'Vision, hearing, or speech problems', 'Cognitive or personality changes', 'Balance and coordination issues', 'Nausea and vomiting without cause'],
    riskFactors: ['Exposure to ionizing radiation', 'Family history of brain tumors', 'Certain genetic syndromes (NF1, NF2)', 'Age (risk increases with age)'],
    treatment: 'Treatment depends on type and location: surgery (craniotomy), radiation therapy (stereotactic radiosurgery), and chemotherapy (temozolomide for glioblastoma). Targeted therapies and immunotherapy are emerging.',
    survival: 'Varies widely: meningioma >80%, glioblastoma ~5% (5-year survival)',
  },
  {
    name: 'Breast Cancer',
    full: 'Breast Carcinoma',
    icon: '🎗️',
    color: '#ec4899',
    desc: 'The most common cancer in women worldwide, forming in breast lobules or ducts. About 1 in 8 women will develop invasive breast cancer in their lifetime. Men can also be affected.',
    symptoms: ['New lump in the breast or underarm', 'Thickening or swelling of part of the breast', 'Skin irritation or dimpling', 'Nipple pain or retraction', 'Nipple discharge (other than breast milk)', 'Change in the size, shape, or appearance of the breast'],
    riskFactors: ['Age (risk increases after 50)', 'BRCA1/BRCA2 gene mutations', 'Dense breast tissue', 'Personal or family history of breast cancer', 'Hormone therapy or oral contraceptive use', 'Alcohol consumption and obesity'],
    treatment: 'Surgery (lumpectomy or mastectomy), radiation, chemotherapy, hormone therapy (tamoxifen, aromatase inhibitors), and targeted therapy (trastuzumab/Herceptin for HER2+). Treatment is highly personalised.',
    survival: '~91% overall 5-year survival; ~99% when localised',
  },
  {
    name: 'Cervical Cancer',
    full: 'Cervical Carcinoma',
    icon: '🔬',
    color: '#f59e0b',
    desc: 'Forms in the cells of the cervix — the lower part of the uterus that connects to the vagina. Almost all cases are linked to infection with high-risk human papillomavirus (HPV).',
    symptoms: ['Vaginal bleeding after intercourse, between periods, or after menopause', 'Watery, bloody vaginal discharge', 'Pelvic pain or pain during intercourse', 'Often no symptoms in early stages'],
    riskFactors: ['HPV infection (types 16 and 18)', 'Smoking', 'Many sexual partners', 'Weakened immune system (HIV/AIDS)', 'Long-term use of oral contraceptives', 'Chlamydia infection history'],
    treatment: 'Early-stage: surgery (hysterectomy, conization). Advanced-stage: combination of radiation therapy and chemotherapy (cisplatin). HPV vaccines (Gardasil, Cervarix) prevent most cases.',
    survival: '~67% overall 5-year survival; ~92% when localised',
  },
  {
    name: 'Kidney Cancer',
    full: 'Renal Cell Carcinoma',
    icon: '🫘',
    color: '#06b6d4',
    desc: 'The most common kidney cancer in adults, starting in the renal tubules. Renal cell carcinoma accounts for about 90% of all kidney cancers. Often detected incidentally during imaging.',
    symptoms: ['Blood in urine (hematuria)', 'Lower back pain (not from injury)', 'A lump or mass on the side or lower back', 'Fatigue and unexplained weight loss', 'Fever that is not from an infection', 'Anaemia'],
    riskFactors: ['Smoking', 'Obesity', 'High blood pressure (hypertension)', 'Advanced chronic kidney disease', 'Family history of kidney cancer', 'Von Hippel-Lindau (VHL) disease'],
    treatment: 'Surgery (partial or radical nephrectomy) is the primary treatment. Targeted therapies (sunitinib, pazopanib), immunotherapy (nivolumab, pembrolizumab) for advanced/metastatic disease. Ablation for small tumors.',
    survival: '~77% overall 5-year survival; ~93% when localised',
  },
  {
    name: 'Lung and Colon Cancer',
    full: 'Lung & Colorectal Cancers',
    icon: '🫁',
    color: '#22c55e',
    desc: 'Covers two common cancer types: lung cancer (from airway cells) and colorectal cancer (from colon or rectum lining). Lung cancer is the leading cause of cancer death globally.',
    symptoms: ['Lung: persistent cough, coughing blood, shortness of breath, chest pain', 'Colon: change in bowel habits, rectal bleeding, abdominal discomfort, unexplained weight loss', 'Fatigue and anaemia (colon)', 'Wheezing (lung)'],
    riskFactors: ['Lung: smoking (accounts for 85%), radon gas, asbestos', 'Colon: age >50, inflammatory bowel disease, high red/processed meat diet, obesity, family history', 'Genetic mutations (KRAS, APC, EGFR)'],
    treatment: 'Lung: surgery, radiation, chemotherapy, targeted therapy (EGFR/ALK inhibitors), immunotherapy. Colon: surgery (colectomy), chemotherapy (FOLFOX/FOLFIRI), targeted therapy (bevacizumab), immunotherapy for MSI-H tumors.',
    survival: 'Lung: ~25% 5-year survival. Colon: ~65% overall; ~91% when localised',
  },
  {
    name: 'Lymphoma',
    full: 'Lymphatic System Cancer',
    icon: '🦠',
    color: '#00d4ff',
    desc: 'Cancer of the lymphatic system — a key part of the immune system. Includes Hodgkin lymphoma (HL) and Non-Hodgkin lymphoma (NHL). NHL is much more common, with over 60 subtypes.',
    symptoms: ['Painless swelling of lymph nodes (neck, armpits, groin)', 'Persistent fatigue', 'Fever and chills', 'Night sweats', 'Unexplained weight loss', 'Itching and shortness of breath'],
    riskFactors: ['Age (NHL more common in older adults)', 'Weakened immune system', 'Certain infections (EBV, HIV, H. pylori)', 'Autoimmune diseases', 'Exposure to certain pesticides and chemicals', 'Previous cancer treatment'],
    treatment: 'Hodgkin lymphoma: chemotherapy (ABVD) + radiation — highly curable. NHL: varies by subtype — chemotherapy (R-CHOP), targeted therapy (rituximab), CAR-T cell therapy for relapsed cases.',
    survival: 'HL: ~87% 5-year survival. NHL: ~73% overall (varies by subtype)',
  },
  {
    name: 'Oral Cancer',
    full: 'Oral Cavity & Oropharyngeal Cancer',
    icon: '🦷',
    color: '#f97316',
    desc: 'Affects the lips, tongue, gums, floor of mouth, and throat lining. Oral cavity cancers are distinct from oropharyngeal cancers (tonsils, base of tongue) which are increasingly HPV-related.',
    symptoms: ['A sore that does not heal within 2 weeks', 'Persistent pain in the mouth', 'A white or reddish patch inside the mouth', 'A growth or lump inside the mouth', 'Difficulty chewing, swallowing, or speaking', 'Ear pain, loose teeth'],
    riskFactors: ['Tobacco use (smoking and chewing tobacco)', 'Heavy alcohol consumption', 'HPV infection (type 16)', 'Excessive sun exposure (lip cancer)', 'Poor oral hygiene', 'Age >40 and male sex'],
    treatment: 'Surgery (tumour resection ± neck dissection), radiation therapy, chemotherapy. HPV-related oropharyngeal cancers often respond better to treatment. Regular dental check-ups aid early detection.',
    survival: '~66% overall 5-year survival; ~84% when localised',
  },
];

export default function AboutPage() {
  const [selectedCancer, setSelectedCancer] = useState(null);

  const closeModal = () => setSelectedCancer(null);

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
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#fca5a5', marginBottom: '4px' }}>Important Disclaimer</p>
            <p style={{ fontSize: '13px', color: '#fca5a5', opacity: 0.8, lineHeight: 1.6 }}>
              This tool is for <strong>educational and research purposes only</strong>. Always consult a qualified
              medical professional for any health concerns or diagnosis.
            </p>
          </div>
        </div>

        {/* Model stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '64px' }}>
          {[
            { label: 'Model', value: 'MobileNetV3Large', icon: '🤖' },
            { label: 'Input Size', value: '224 × 224 px', icon: '📐' },
            { label: 'Cancer Types', value: '8 Classes', icon: '🔢' },
            { label: 'Output', value: 'Top 3 + Confidence', icon: '📊' },
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
            Click any card to learn more — symptoms, risk factors, treatment, and survival rates
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {CANCERS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCancer(c)}
                style={{
                  all: 'unset', display: 'block', cursor: 'pointer',
                  borderRadius: '16px', textAlign: 'left',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${c.color}28`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="glass" style={{ padding: '22px', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
                      background: `${c.color}18`, border: `1px solid ${c.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                    }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: c.color, marginTop: '2px' }}>{c.full}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, marginBottom: '12px' }}>
                    {c.desc.slice(0, 100)}…
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '12px', color: c.color, fontWeight: 600,
                  }}>
                    <span>Learn more</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass" style={{ padding: '48px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Ready to try it?</h3>
          <p style={{ color: '#94a3b8', marginBottom: '28px', fontSize: '14px' }}>
            Upload a medical image and see the App in action
          </p>
          <Link href="/predict">
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }}>
              <span>🔬 Go to Predict</span>
            </button>
          </Link>
        </div>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────────── */}
      {selectedCancer && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-fade-in-up"
            style={{
              background: '#111827', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px', width: '100%', maxWidth: '640px',
              maxHeight: '90vh', overflowY: 'auto', position: 'relative',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '28px 28px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              position: 'sticky', top: 0, background: '#111827', zIndex: 2,
              borderRadius: '24px 24px 0 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: `${selectedCancer.color}18`, border: `1px solid ${selectedCancer.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                }}>{selectedCancer.icon}</div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', marginBottom: '2px' }}>
                    {selectedCancer.name}
                  </h2>
                  <p style={{ fontSize: '12px', color: selectedCancer.color }}>{selectedCancer.full}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#94a3b8', transition: 'all 0.2s ease', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px 28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Overview */}
              <div>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>{selectedCancer.desc}</p>
              </div>

              {/* Survival badge */}
              <div style={{
                padding: '14px 18px', borderRadius: '12px',
                background: `${selectedCancer.color}12`, border: `1px solid ${selectedCancer.color}30`,
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={selectedCancer.color} strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>5-Year Survival Rate</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: selectedCancer.color, marginTop: '2px' }}>{selectedCancer.survival}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Common Symptoms
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {selectedCancer.symptoms.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                        background: selectedCancer.color,
                      }} />
                      <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk factors */}
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Risk Factors
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCancer.riskFactors.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '6px',
                        background: '#7c3aed',
                      }} />
                      <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Treatment */}
              <div style={{
                padding: '16px 18px', borderRadius: '12px',
                background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)',
              }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#00d4ff', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Treatment Approaches
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>{selectedCancer.treatment}</p>
              </div>

              {/* Disclaimer */}
              <p style={{ fontSize: '11px', color: '#334155', textAlign: 'center', lineHeight: 1.6 }}>
                ⚠️ This information is for educational purposes only and does not constitute medical advice.
                Always consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </div>
      )}

      <footer style={{
        textAlign: 'center', padding: '32px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)', color: '#475569', fontSize: '13px',
      }}>
        <p>© 2026 CancerDetect · For educational & research purposes only</p>
      </footer>
    </div>
  );
}

'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#00d4ff', '#7c3aed', '#06b6d4'];

const CANCER_INFO = {
  'ALL': 'Acute Lymphoblastic Leukemia — cancer of the blood and bone marrow affecting white blood cells.',
  'Brain Cancer': 'Tumors originating in the brain or spinal cord tissue.',
  'Breast Cancer': 'Cancer forming in breast cells; the most common cancer in women worldwide.',
  'Cervical Cancer': 'Occurs in the cells of the cervix, the lower part of the uterus.',
  'Kidney Cancer': 'Cancer in the kidney cells; renal cell carcinoma is the most common type.',
  'Lung and Colon Cancer': 'Covers cancers of the lung (from airways) and colon/rectum.',
  'Lymphoma': 'Cancer originating in lymphocytes — a key part of the immune system.',
  'Oral Cancer': 'Affects the mouth, tongue, gums, lips, or throat lining.',
};

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const { prediction, confidence, top_3, image_url, processing_time_ms } = result;

  const chartData = top_3.map((item) => ({
    name: item.class.replace('Cancer', '').replace('and Colon', '& Colon').trim(),
    confidence: item.confidence,
  }));

  const getConfidenceColor = (val) => {
    if (val >= 90) return '#22c55e';
    if (val >= 70) return '#00d4ff';
    if (val >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Primary result */}
      <div className="glass" style={{ padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Detection Result
        </div>
        <div className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
          {prediction}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Confidence</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: getConfidenceColor(confidence) }}>
              {confidence}%
            </span>
          </div>
          <div className="confidence-bar">
            <div className="confidence-fill" style={{ width: `${confidence}%` }} />
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#475569' }}>
          Processed in {processing_time_ms}ms
        </div>
      </div>

      {/* Image + Cancer info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Image */}
        <div className="glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Uploaded Image
          </div>
          <img
            src={image_url}
            alt="Uploaded medical scan"
            style={{ width: '100%', borderRadius: '10px', maxHeight: '180px', objectFit: 'cover' }}
          />
        </div>

        {/* Cancer info */}
        <div className="glass-purple" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#a78bfa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            About {prediction}
          </div>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            {CANCER_INFO[prediction] || 'A type of cancer detected by our classification model.'}
          </p>
          <div style={{
            marginTop: '12px', padding: '10px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <p style={{ fontSize: '11px', color: '#fca5a5', lineHeight: 1.5 }}>
              ⚠️ For educational & Research purposes only. Always consult a qualified medical professional.
            </p>
          </div>
        </div>
      </div>

      {/* Top-3 Bar Chart */}
      <div className="glass" style={{ padding: '24px' }}>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Top 3 Predictions
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis
              type="number" domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false} tickLine={false}
            />
            <YAxis
              type="category" dataKey="name" width={120}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Confidence']}
              contentStyle={{
                background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', fontSize: '12px',
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 600, marginBottom: '4px' }}
              itemStyle={{ color: '#00d4ff' }}
            />
            <Bar dataKey="confidence" radius={[0, 6, 6, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Inline top-3 list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
          {top_3.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 700, color: i === 0 ? 'white' : '#94a3b8',
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', color: i === 0 ? '#f1f5f9' : '#94a3b8', fontWeight: i === 0 ? 600 : 400 }}>
                    {item.class}
                  </span>
                  <span style={{ fontSize: '13px', color: COLORS[i], fontWeight: 600 }}>
                    {item.confidence}%
                  </span>
                </div>
                <div className="confidence-bar" style={{ height: '4px' }}>
                  <div className="confidence-fill" style={{ width: `${item.confidence}%`, background: COLORS[i] }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import ImageUploader from '../../components/ImageUploader';
import PredictionResult from '../../components/PredictionResult';
import api from '../../lib/api';

const TABS = ['single', 'batch'];

// ── Batch result card ─────────────────────────────────────────────────────────
function BatchResultCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);

  if (item.status === 'error') {
    return (
      <div className="glass" style={{ padding: '16px', borderLeft: '3px solid #ef4444' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, color: '#ef4444',
            }}>{index + 1}</div>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.filename}</span>
          </div>
          <span style={{ fontSize: '12px', color: '#ef4444' }}>{item.error}</span>
        </div>
      </div>
    );
  }

  const confColor = item.confidence >= 90 ? '#22c55e' : item.confidence >= 70 ? '#00d4ff' : '#f59e0b';

  return (
    <div className="glass" style={{ overflow: 'hidden', borderLeft: '3px solid #00d4ff' }}>
      {/* Summary row */}
      <div
        style={{
          padding: '14px 18px', display: 'flex', alignItems: 'center',
          gap: '14px', cursor: 'pointer',
          justifyContent: 'space-between',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
          {/* Index */}
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 700, color: 'white',
          }}>{index + 1}</div>

          {/* Thumbnail */}
          <img src={item.image_url} alt="" style={{
            width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0,
          }} />

          {/* Filename */}
          <span style={{
            fontSize: '13px', color: '#94a3b8', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>{item.filename}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <span className="badge">{item.prediction}</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: confColor }}>{item.confidence}%</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Expanded view */}
      {expanded && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
          <PredictionResult
            result={{
              prediction: item.prediction,
              confidence: item.confidence,
              top_3: item.top_3,
              image_url: item.image_url,
              processing_time_ms: item.processing_time_ms,
            }}
            onReset={null}
          />
        </div>
      )}
    </div>
  );
}


// ── Main page ─────────────────────────────────────────────────────────────────
export default function PredictPage() {
  const [tab, setTab]           = useState('single');
  const [files, setFiles]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);       // single mode
  const [batchResult, setBatchResult] = useState(null); // batch mode
  const [error, setError]       = useState('');
  const [progress, setProgress] = useState('');         // batch progress text

  const handleFilesChange = useCallback((newFiles) => {
    setFiles(newFiles);
    setResult(null);
    setBatchResult(null);
    setError('');
  }, []);

  const switchTab = (t) => {
    setTab(t);
    setFiles([]);
    setResult(null);
    setBatchResult(null);
    setError('');
    setProgress('');
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setBatchResult(null);
    setError('');
    setProgress('');
  };

  // ── Single predict ──────────────────────────────────────────────────────────
  const handleSinglePredict = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', files[0].file);
      const res = await api.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Try another image.');
    } finally {
      setLoading(false);
    }
  };

  // ── Batch predict ───────────────────────────────────────────────────────────
  const handleBatchPredict = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError('');
    setProgress(`Uploading and analysing ${files.length} image${files.length > 1 ? 's' : ''}…`);
    try {
      const formData = new FormData();
      files.forEach(({ file }) => formData.append('files', file));
      const res = await api.post('/predict/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBatchResult(res.data);
      setProgress('');
    } catch (err) {
      setProgress('');
      setError(err.response?.data?.detail || 'Batch prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const hasSingleResult = tab === 'single' && result;
  const hasBatchResult  = tab === 'batch'  && batchResult;

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
        <Navbar />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 60px' }}>

          {/* Header */}
          <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '12px' }}>
              Cancer <span className="gradient-text">Detection</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
              Upload a medical image and our App will classify it into one of 8 cancer types
            </p>
          </div>

          {/* Mode tabs */}
          <div className="animate-fade-in-up" style={{
            display: 'flex', gap: '4px', marginBottom: '28px',
            background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px',
            width: 'fit-content', margin: '0 auto 28px',
          }}>
            {[
              {
                key: 'single', label: 'Single Image',
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                ),
              },
              {
                key: 'batch', label: 'Batch Upload', suffix: 'up to 5',
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                    <line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                ),
              },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                style={{
                  padding: '10px 22px', borderRadius: '9px', border: 'none',
                  cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600,
                  fontSize: '14px', transition: 'all 0.2s ease',
                  background: tab === t.key ? 'linear-gradient(135deg,#00d4ff,#7c3aed)' : 'transparent',
                  color: tab === t.key ? 'white' : '#94a3b8',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{t.icon}</span>
                <span>{t.label}</span>
                {t.suffix && (
                  <span style={{
                    fontSize: '10px', padding: '2px 7px', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.15)', fontWeight: 500,
                  }}>{t.suffix}</span>
                )}
              </button>
            ))}
          </div>

          {/* Main content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: hasSingleResult ? '1fr 1fr' : '1fr',
            gap: '28px', alignItems: 'start',
          }}>

            {/* Left panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass" style={{ padding: '24px' }}>
                <div style={{
                  fontSize: '12px', color: '#94a3b8', marginBottom: '16px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>{tab === 'batch' ? `Batch Upload (${files.length}/5)` : 'Upload Medical Image'}</span>
                  {files.length > 0 && !loading && !result && !batchResult && (
                    <button
                      onClick={handleReset}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '12px' }}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <ImageUploader
                  mode={tab}
                  files={files}
                  onFilesChange={handleFilesChange}
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '14px 16px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5', fontSize: '13px',
                }}>{error}</div>
              )}

              {/* Analyse button */}
              {files.length > 0 && !loading && !result && !batchResult && (
                <button
                  className="btn-primary animate-fade-in"
                  onClick={tab === 'single' ? handleSinglePredict : handleBatchPredict}
                  style={{ width: '100%', padding: '16px', fontSize: '15px' }}
                >
                  <span>
                    {tab === 'batch'
                      ? `🔍 Analyse ${files.length} Image${files.length > 1 ? 's' : ''}`
                      : '🔍 Analyse Image'}
                  </span>
                </button>
              )}

              {/* Loading */}
              {loading && (
                <div className="glass animate-fade-in" style={{ padding: '28px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                    <div className="spinner" />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>
                    {progress || 'Analysing image…'}
                  </p>
                  <p style={{ color: '#475569', fontSize: '12px' }}>Running MobileNetV3Large inference</p>
                </div>
              )}

              {/* Reset button after single result */}
              {hasSingleResult && (
                <button className="btn-outline" onClick={handleReset} style={{ width: '100%', padding: '12px' }}>
                  🔄 Try Another Image
                </button>
              )}

              {files.length === 0 && (
                <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
                      label: 'Histopathology slides',
                    },
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
                      label: 'CT / MRI scans',
                    },
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
                      label: 'Microscopy images',
                    },
                  ].map(({ icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — single result */}
            {hasSingleResult && (
              <PredictionResult result={result} onReset={handleReset} />
            )}
          </div>

          {/* Batch results list */}
          {hasBatchResult && (
            <div className="animate-fade-in-up" style={{ marginTop: '32px' }}>
              {/* Summary bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', flexWrap: 'wrap', gap: '12px',
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                    Batch Results
                    <span className="gradient-text" style={{ marginLeft: '10px' }}>
                      {batchResult.successful}/{batchResult.total} successful
                    </span>
                  </h2>
                  <p style={{ fontSize: '13px', color: '#475569' }}>Click any row to expand full prediction details</p>
                </div>
                <button className="btn-outline" onClick={handleReset} style={{ padding: '10px 20px', fontSize: '13px' }}>
                  🔄 New Batch
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {batchResult.results.map((item, idx) => (
                  <BatchResultCard key={idx} item={item} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

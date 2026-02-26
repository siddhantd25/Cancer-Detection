'use client';

import { useState, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import ImageUploader from '../../components/ImageUploader';
import PredictionResult from '../../components/PredictionResult';
import api from '../../lib/api';

export default function PredictPage() {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError('');
  }, []);

  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try another image.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
        <Navbar />

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 60px' }}>
          {/* Header */}
          <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '12px' }}>
              Cancer <span className="gradient-text">Detection</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '480px', margin: '0 auto' }}>
              Upload a medical image and our AI will classify it into one of 8 cancer types
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>

            {/* Left panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass" style={{ padding: '24px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Upload Medical Image
                </div>
                <ImageUploader
                  onFileSelect={handleFileSelect}
                  preview={preview}
                  disabled={loading}
                />
              </div>

              {error && (
                <div style={{
                  padding: '14px 16px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5', fontSize: '13px',
                }}>{error}</div>
              )}

              {file && !loading && !result && (
                <button
                  className="btn-primary animate-fade-in"
                  onClick={handlePredict}
                  style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                >
                  <span>🔍 Analyze Image</span>
                </button>
              )}

              {loading && (
                <div className="glass animate-fade-in" style={{ padding: '32px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div className="spinner" />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>Analyzing image...</p>
                  <p style={{ color: '#475569', fontSize: '12px' }}>Running MobileNetV3Large inference</p>
                </div>
              )}

              {/* Info tags */}
              {!file && (
                <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    ['🩻', 'Histopathology slides', ''],
                    ['📷', 'CT / MRI scans', ''],
                    ['🔬', 'Microscopy images', ''],
                  ].map(([icon, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>{icon}</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right panel — results */}
            {result && (
              <PredictionResult result={result} onReset={handleReset} />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

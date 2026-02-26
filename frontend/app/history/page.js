'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/ProtectedRoute';
import HistoryTable from '../../components/HistoryTable';
import PredictionResult from '../../components/PredictionResult';
import api from '../../lib/api';

const CLASS_NAMES = ['ALL','Brain Cancer','Breast Cancer','Cervical Cancer','Kidney Cancer','Lung and Colon Cancer','Lymphoma','Oral Cancer'];

export default function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterClass, setFilterClass] = useState('');
  const [selected, setSelected]       = useState(null);
  const [error, setError]             = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/history');
      setPredictions(res.data.predictions);
    } catch (err) {
      setError('Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/history/${id}`);
      setPredictions((prev) => prev.filter((p) => p.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError('Failed to delete prediction.');
    }
  };

  const handleView = (pred) => {
    setSelected(selected?.id === pred.id ? null : pred);
  };

  const viewResult = selected ? {
    prediction: selected.predicted_class,
    confidence: selected.confidence,
    top_3: selected.top_3,
    image_url: selected.image_url,
    processing_time_ms: selected.processing_time_ms,
    timestamp: selected.timestamp,
  } : null;

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
        <Navbar />
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 24px 60px' }}>
          {/* Header */}
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
                Prediction <span className="gradient-text">History</span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                {predictions.length} prediction{predictions.length !== 1 ? 's' : ''} so far
              </p>
            </div>

            {/* Filter */}
            <div>
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '10px 16px', color: '#f1f5f9',
                  fontSize: '14px', outline: 'none', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <option value="">All Cancer Types</option>
                {CLASS_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '14px 16px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: '13px',
            }}>{error}</div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1.2fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
            {/* Table */}
            <div className="glass animate-fade-in-up" style={{ padding: '8px 0' }}>
              {loading ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div className="spinner" />
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading history...</p>
                </div>
              ) : (
                <HistoryTable
                  predictions={predictions}
                  onDelete={handleDelete}
                  onView={handleView}
                  filterClass={filterClass}
                />
              )}
            </div>

            {/* Selected result */}
            {selected && viewResult && (
              <div className="animate-fade-in">
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Selected Result
                </div>
                <PredictionResult result={viewResult} onReset={() => setSelected(null)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

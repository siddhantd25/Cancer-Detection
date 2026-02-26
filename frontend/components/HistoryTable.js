'use client';

import { useState } from 'react';

export default function HistoryTable({ predictions, onDelete, onView, filterClass }) {
  const [deleting, setDeleting] = useState(null);

  const filtered = filterClass
    ? predictions.filter((p) => p.predicted_class === filterClass)
    : predictions;

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeleting(id);
    await onDelete(id);
    setDeleting(null);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getConfColor = (val) => {
    if (val >= 90) return '#22c55e';
    if (val >= 70) return '#00d4ff';
    if (val >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
        <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '6px' }}>No predictions found</p>
        <p style={{ fontSize: '13px' }}>Upload a medical image to get started</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Cancer Type</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} onClick={() => onView(p)}>
              <td>
                <img
                  src={p.image_url}
                  alt={p.predicted_class}
                  style={{
                    width: '48px', height: '48px', borderRadius: '8px',
                    objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </td>
              <td>
                <span className="badge">{p.predicted_class}</span>
              </td>
              <td>
                <span style={{ fontWeight: 600, color: getConfColor(p.confidence) }}>
                  {p.confidence}%
                </span>
              </td>
              <td style={{ fontSize: '12px', color: '#475569' }}>{formatDate(p.timestamp)}</td>
              <td>
                <button
                  className="btn-danger"
                  onClick={(e) => handleDelete(e, p.id)}
                  disabled={deleting === p.id}
                >
                  {deleting === p.id ? '...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

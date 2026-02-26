'use client';

import { useCallback, useState } from 'react';

export default function ImageUploader({ onFileSelect, preview, disabled }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div>
      <label
        className={`drop-zone ${isDragging ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          display: 'block',
          padding: '40px 24px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInput}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {preview ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: '220px',
                maxWidth: '100%',
                borderRadius: '12px',
                border: '1px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 30px rgba(0,212,255,0.1)',
              }}
            />
            {!disabled && (
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                Click or drag to replace image
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {/* Upload icon */}
            <div
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}
              className="animate-float"
            >
              🩻
            </div>

            <div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '6px' }}>
                Drop your medical image here
              </p>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                or <span style={{ color: '#00d4ff', textDecoration: 'underline' }}>browse to upload</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['PNG', 'JPG', 'JPEG', 'BMP', 'TIFF'].map((fmt) => (
                <span
                  key={fmt}
                  style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                    background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

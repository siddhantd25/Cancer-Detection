'use client';

import { useCallback, useRef } from 'react';

const MAX_FILES = 5;

export default function ImageUploader({ mode, files, onFilesChange, disabled }) {
  const inputRef = useRef(null);

  // Merge new files, dedupe by name+size, enforce max 5
  const mergeFiles = useCallback((incoming) => {
    const next = [...files];
    for (const f of incoming) {
      if (next.length >= MAX_FILES) break;
      const dup = next.find(x => x.file.name === f.name && x.file.size === f.size);
      if (!dup) next.push({ file: f, preview: URL.createObjectURL(f) });
    }
    onFilesChange(next);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (disabled) return;
    mergeFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  }, [mergeFiles, disabled]);

  const handleInput = (e) => {
    mergeFiles(Array.from(e.target.files));
    e.target.value = ''; // allow same file twice
  };

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    onFilesChange(next);
  };

  const isEmpty = files.length === 0;
  const isFull  = files.length >= MAX_FILES;

  return (
    <div>
      {/* Drop zone — hide when full */}
      {!isFull && (
        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
          style={{
            padding: isEmpty ? '40px 24px' : '20px 24px',
            textAlign: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            marginBottom: files.length > 0 ? '16px' : 0,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={mode === 'batch'}
            onChange={handleInput}
            style={{ display: 'none' }}
            disabled={disabled}
          />

          {isEmpty ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div
                className="animate-float"
                style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
                  {mode === 'batch' ? 'Drop up to 5 images here' : 'Drop your medical image here'}
                </p>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                  or <span style={{ color: '#00d4ff', textDecoration: 'underline' }}>browse to upload</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['PNG', 'JPG', 'JPEG', 'BMP', 'TIFF'].map(fmt => (
                  <span key={fmt} style={{
                    padding: '3px 10px', borderRadius: '999px', fontSize: '11px',
                    background: 'rgba(124,58,237,0.15)', color: '#a78bfa',
                    border: '1px solid rgba(124,58,237,0.2)',
                  }}>{fmt}</span>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              {files.length}/{MAX_FILES} images added ·{' '}
              <span style={{ color: '#00d4ff' }}>Click or drop to add more</span>
            </p>
          )}
        </div>
      )}

      {/* Thumbnail grid */}
      {files.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: mode === 'batch' ? 'repeat(auto-fill, minmax(110px, 1fr))' : '1fr',
          gap: '10px',
        }}>
          {files.map((item, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <img
                src={item.preview}
                alt={`Image ${idx + 1}`}
                style={{
                  width: '100%',
                  height: mode === 'batch' ? '100px' : '200px',
                  objectFit: 'cover',
                  display: 'block',
                  border: '1px solid rgba(0,212,255,0.2)',
                  borderRadius: '12px',
                }}
              />
              {/* Filename label */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(4px)',
                padding: '4px 8px',
              }}>
                <p style={{
                  fontSize: '10px', color: '#94a3b8',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{item.file.name}</p>
              </div>
              {/* Remove button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  style={{
                    position: 'absolute', top: '6px', right: '6px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'rgba(239,68,68,0.85)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '12px', lineHeight: 1,
                  }}
                  aria-label="Remove image"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              {/* Index badge (batch) */}
              {mode === 'batch' && (
                <div style={{
                  position: 'absolute', top: '6px', left: '6px',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'linear-gradient(135deg,#00d4ff,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: 'white',
                }}>{idx + 1}</div>
              )}
            </div>
          ))}

          {/* "Add more" slot */}
          {mode === 'batch' && files.length < MAX_FILES && (
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                height: '100px', borderRadius: '12px', cursor: 'pointer',
                border: '2px dashed rgba(0,212,255,0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
                background: 'rgba(0,212,255,0.02)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; e.currentTarget.style.background = 'rgba(0,212,255,0.02)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Add more</span>
            </div>
          )}
        </div>
      )}

      {/* Max reached notice */}
      {isFull && (
        <p style={{ fontSize: '12px', color: '#f59e0b', textAlign: 'center', marginTop: '10px' }}>
          Maximum 5 images reached. Remove one to add another.
        </p>
      )}
    </div>
  );
}

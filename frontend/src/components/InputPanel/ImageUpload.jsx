import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImageUpload, error }) => {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          position: 'relative',
          height: '140px',
          borderRadius: '16px',
          border: `2px dashed ${isDragActive ? '#36565F' : error ? '#E55353' : '#BDDBD1'}`,
          transition: 'all 0.3s',
          cursor: 'pointer',
          overflow: 'hidden',
          backgroundColor: isDragActive ? 'rgba(54, 86, 95, 0.05)' : 'rgba(255,255,255,0.4)',
        }}
        onMouseEnter={(e) => {
          if (!isDragActive && !error) {
            e.currentTarget.style.borderColor = '#36565F';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.8)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragActive && !error) {
            e.currentTarget.style.borderColor = '#BDDBD1';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)';
          }
        }}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="X-ray preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
            <svg style={{ width: '32px', height: '32px', color: '#5F8190', marginBottom: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <p style={{ fontSize: '14px', color: '#141414', fontWeight: 600 }}>
              {isDragActive ? 'Drop X-ray here' : 'Upload Chest X-Ray'}
            </p>
            <p style={{ fontSize: '11px', color: '#5F8190', marginTop: '4px' }}>Drag & drop or click</p>
          </div>
        )}
      </div>
      {error && <p style={{ fontSize: '12px', color: '#E55353', marginTop: '8px' }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
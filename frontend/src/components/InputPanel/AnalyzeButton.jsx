import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const AnalyzeButton = ({ onClick, isLoading }) => {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        width: '100%',
        height: '50px',
        backgroundColor: '#36565F',
        border: 'none',
        borderRadius: '12px',
        color: '#FFFFFF',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(54, 86, 95, 0.2)'
      }}
      onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#2C4A52'; }}
      onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#36565F'; }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>{t('analyzing')}</span>
        </div>
      ) : (
        'Analyze Patient'
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default AnalyzeButton;
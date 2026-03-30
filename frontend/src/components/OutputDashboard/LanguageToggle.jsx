import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { currentLanguage, setCurrentLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languageNames = { en: 'English', hi: 'हिंदी', mr: 'मराठी' };

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 20px', borderRadius: '40px', fontSize: '13px', fontWeight: 600,
          border: '1px solid #BDDBD1', background: 'rgba(255,255,255,0.8)', color: '#36565F',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}
      >
        {languageNames[currentLanguage]} <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: '8px',
          background: '#FFFFFF', border: '1px solid #BDDBD1', borderRadius: '12px',
          overflow: 'hidden', zIndex: 1000, minWidth: '120px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }}>
          {languages.map(lang => (
            <div
              key={lang} onClick={() => { setCurrentLanguage(lang); setIsOpen(false); }}
              style={{
                padding: '10px 20px', cursor: 'pointer', fontSize: '13px', fontWeight: currentLanguage === lang ? 700 : 500,
                background: currentLanguage === lang ? '#E2F0F0' : 'transparent', color: '#141414'
              }}
              onMouseEnter={(e) => { if(currentLanguage !== lang) e.currentTarget.style.background = '#F6F6F6'; }}
              onMouseLeave={(e) => { if(currentLanguage !== lang) e.currentTarget.style.background = 'transparent'; }}
            >
              {languageNames[lang]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
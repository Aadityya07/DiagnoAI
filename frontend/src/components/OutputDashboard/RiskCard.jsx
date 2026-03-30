import React from 'react';

const RiskCard = ({ title, value }) => {
  const getColor = () => {
    if (value >= 70) return '#E55353'; // Red
    if (value >= 30) return '#F4A261'; // Yellow
    return '#34D399'; // Green
  };

  const color = getColor();
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.6)',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid rgba(189, 219, 209, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
    }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#2C4A52', marginBottom: '12px', textAlign: 'center', height: '32px' }}>{title}</h3>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(54, 86, 95, 0.1)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: '#141414' }}>
          {Math.round(value)}<span style={{ fontSize: '10px' }}>%</span>
        </span>
      </div>
    </div>
  );
};

export default RiskCard;
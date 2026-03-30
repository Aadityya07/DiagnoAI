import React from 'react';
import RiskCard from './RiskCard';
import InsightBox from './InsightBox';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../../context/LanguageContext';

const OutputDashboard = ({ analysisData, isAnalyzing, error, progress, onRetry }) => {
  const { t } = useLanguage();

  const riskItems = analysisData ? [
    { title: t('cancerRisk'), value: analysisData.cancer, key: 'cancer' },
    { title: t('tbRisk'), value: analysisData.tb, key: 'tb' },
    { title: t('diabetesRisk'), value: analysisData.diabetes, key: 'diabetes' },
    { title: t('asthmaRisk'), value: analysisData.asthma, key: 'asthma' },
    { title: t('pneumoniaRisk'), value: analysisData.pneumonia, key: 'pneumonia' }
  ] : [];

  if (error) {
    return (
      <div className="glass-premium" style={{ width: '65%', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#E55353', marginBottom: '8px' }}>Analysis Failed</h3>
        <p style={{ color: '#36565F', marginBottom: '24px', textAlign: 'center' }}>{error}</p>
        <button onClick={onRetry} style={{ padding: '10px 24px', borderRadius: '12px', background: '#36565F', color: 'white', border: 'none' }}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="glass-premium custom-scrollbar" style={{ width: '65%', padding: '28px', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
      <LanguageToggle />

      {isAnalyzing && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#36565F', marginBottom: '8px', fontWeight: 600 }}>
            <span>{t('analyzing')}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(54, 86, 95, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#36565F', transition: 'width 0.3s', width: `${progress}%` }} />
          </div>
        </div>
      )}

      {!isAnalyzing && !analysisData && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', flexDirection: 'column' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🩺</div>
          <p style={{ color: '#5F8190', fontWeight: 500 }}>{t('awaitingData')}</p>
        </div>
      )}

      {analysisData && !isAnalyzing && (
        <div className="animate-fadeIn" style={{ marginTop: '24px' }}>
          

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {riskItems.map(risk => (
              <RiskCard key={risk.key} title={risk.title} value={risk.value} />
            ))}
          </div>

          <InsightBox explanation={analysisData.explanation} />
        </div>
      )}
    </div>
  );
};

export default OutputDashboard;
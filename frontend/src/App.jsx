import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Prism from './components/Prism'; 

// Fix: Point directly to the .jsx files inside their respective folders
import InputPanel from './components/InputPanel/InputPanel'; 
import OutputDashboard from './components/OutputDashboard/OutputDashboard'; 

import { useAnalysis } from './hooks/useAnalysis';
import { LanguageProvider } from './context/LanguageContext';

function AppContent() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { analysisData, isLoading, error, progress, analyze, resetAnalysis } = useAnalysis();

  const handleAnalyze = async (formData) => {
    try {
      await analyze(formData);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <>
      {/* 3D Background */}
      <Prism
        animationType="3drotate" timeScale={0.9} height={4.5}        
        baseWidth={7.5} scale={9} hueShift={0.35} colorFrequency={0.85}
        noise={0.0} glow={0.8} bloom={0.9} transparent={true} suspendWhenOffscreen={true}
      />
      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {/* Router */}
      {!showDashboard ? (
        <LandingPage onLaunch={() => setShowDashboard(true)} />
      ) : (
        <div className="animate-fadeIn" style={{
          position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', 
          height: '100vh', padding: '24px'
        }}>
          
          {/* Top Bar for Dashboard View */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 16px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#141414', letterSpacing: '-0.5px' }}>
              Diagno<span style={{ color: '#36565F' }}>AI</span>
            </div>
            <button 
              onClick={() => setShowDashboard(false)}
              style={{ background: 'transparent', border: '1px solid #36565F', padding: '8px 16px', borderRadius: '20px', color: '#36565F', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Home
            </button>
          </div>

          {/* Main Dashboard Layout */}
          <div style={{ display: 'flex', gap: '24px', flex: 1, overflow: 'hidden' }}>
            <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isLoading} />
            <OutputDashboard
              analysisData={analysisData}
              isAnalyzing={isLoading}
              error={error}
              progress={progress}
              onRetry={resetAnalysis}
            />
          </div>

        </div>
      )}
    </>
  );
}

// Wrap the entire app in the LanguageProvider so translations work!
function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
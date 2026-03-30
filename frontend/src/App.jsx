import React, { useState } from 'react';
import LandingPage from './components/LandingPage'; // Updated path!
import Prism from './components/Prism'; // Updated path!

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <>
      <Prism
        animationType="3drotate"
        timeScale={0.9}
        height={4.5}        
        baseWidth={7.5}     
        scale={9}           
        hueShift={0.35}
        colorFrequency={0.85}
        noise={0.0}
        glow={0.8}
        bloom={0.9}
        transparent={true}
        suspendWhenOffscreen={true}
      />

      <div className="glow-orb orb-1" />
      <div className="glow-orb orb-2" />

      {!showDashboard ? (
        <LandingPage onLaunch={() => setShowDashboard(true)} />
      ) : (
        <div style={{
          position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', height: '100vh'
        }}>
          <h2 style={{ fontSize: '2rem', color: '#141414', marginBottom: '20px' }}>
            Dashboard Section (Coming in Step 3!)
          </h2>
          <button 
            onClick={() => setShowDashboard(false)}
            style={{ padding: '10px 20px', borderRadius: '12px', background: '#36565F', color: 'white', border: 'none' }}
          >
            Go Back
          </button>
        </div>
      )}
    </>
  );
}

export default App;
import React from 'react';
import { Aperture, Activity, FileText, Stethoscope, ArrowRight, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';

const LandingPage = ({ onLaunch }) => {
  return (
    <div 
      className="custom-scrollbar"
      style={{
        position: 'relative',
        zIndex: 10,
        height: '100vh',
        overflowY: 'auto',
        scrollBehavior: 'smooth',
      }}
    >
      {/* ===== TRUE GLASS NAVIGATION BAR ===== */}
      <div style={{ 
        position: 'fixed', 
        top: '24px', 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        zIndex: 100 
      }}>
        <nav style={{
          width: '90%',
          maxWidth: '1000px',
          padding: '12px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          
          /* The True Glassmorphism Effect */
          background: 'rgba(255, 255, 255, 0.25)', /* Very sheer */
          backdropFilter: 'blur(24px)', /* Heavy blur */
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.7)', /* Crisp bright edge */
          borderRadius: '100px',
          boxShadow: '0 8px 32px rgba(54, 86, 95, 0.08)' /* Soft colored shadow */
        }}>
          
          {/* 1. Left side: New Unique AI Logo (Aperture) */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: '#36565F', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Aperture size={18} color="#FFFFFF" />
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#141414', letterSpacing: '-0.5px' }}>
              Diagno<span style={{ color: '#36565F' }}>AI</span>
            </div>
          </div>
          
          {/* 2. Middle: Centered Links */}
          <div style={{ flex: 2, display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
            <a href="#home" style={{ textDecoration: 'none', color: '#141414', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#36565F'} onMouseLeave={(e) => e.target.style.color = '#141414'}>Home</a>
            <a href="#features" style={{ textDecoration: 'none', color: '#141414', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#36565F'} onMouseLeave={(e) => e.target.style.color = '#141414'}>Features</a>
            <a href="#about" style={{ textDecoration: 'none', color: '#141414', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#36565F'} onMouseLeave={(e) => e.target.style.color = '#141414'}>About Us</a>
          </div>

          {/* 3. Right side: Empty div to force perfect centering of the middle links */}
          <div style={{ flex: 1 }}></div>

        </nav>
      </div>

      {/* ===== HERO SECTION (HOME) ===== */}
      <section id="home" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '80px 24px 0'
      }}>
        
        {/* Headline (Badge removed as requested) */}
        <h1 className="animate-fadeIn" style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '24px',
          color: '#141414',
          maxWidth: '900px'
        }}>
          Intelligent Triage. <br />
          <span style={{ color: '#36565F' }}>Multimodal Precision.</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fadeIn" style={{
          fontSize: '1.15rem',
          color: '#2C4A52',
          maxWidth: '650px',
          marginBottom: '48px',
          lineHeight: 1.6,
          animationDelay: '0.1s'
        }}>
          Fusing Radiology, Clinical Vitals, EHR, and Wearable data to provide instant, explainable insights for evidence-based decision making.
        </p>

        {/* Action Buttons */}
        <div className="animate-fadeIn" style={{ display: 'flex', gap: '16px', animationDelay: '0.2s' }}>
          <button 
            onClick={onLaunch}
            style={{
              background: '#36565F',
              color: '#FFFFFF',
              padding: '16px 32px',
              borderRadius: '40px',
              fontSize: '1.1rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 14px rgba(54, 86, 95, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(54, 86, 95, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(54, 86, 95, 0.2)';
            }}
          >
            <Activity size={20} />
            Initialize Analysis
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" style={{
        padding: '120px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#141414', marginBottom: '16px' }}>Why DiagnoAI?</h2>
        <p style={{ color: '#36565F', fontSize: '1.1rem', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px' }}>
          Traditional diagnostics rely on data silos. We combine every metric to give clinicians the full picture in seconds.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* Feature 1 */}
          <div className="glass-premium" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(153, 221, 204, 0.3)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#36565F', marginBottom: '24px' }}>
              <BrainCircuit size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#141414', marginBottom: '12px' }}>Multimodal Fusion</h3>
            <p style={{ color: '#2C4A52', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Our engine cross-references Chest X-Rays using Vision AI with tabular EHR and genomic data to prevent missed diagnoses.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-premium" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(153, 221, 204, 0.3)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#36565F', marginBottom: '24px' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#141414', marginBottom: '12px' }}>Explainable AI</h3>
            <p style={{ color: '#2C4A52', lineHeight: 1.6, fontSize: '0.95rem' }}>
              We don't just output a risk score. Our LLM strictly details *why* a diagnosis was reached to build trust with medical staff.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-premium" style={{ padding: '40px 32px', textAlign: 'left' }}>
            <div style={{ background: 'rgba(153, 221, 204, 0.3)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#36565F', marginBottom: '24px' }}>
              <Zap size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#141414', marginBottom: '12px' }}>Fault Tolerant</h3>
            <p style={{ color: '#2C4A52', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Built for unstable hospital networks. If APIs fail or Wi-Fi drops, our deterministic heuristic fallback engine ensures 100% uptime.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section id="about" style={{
        padding: '100px 24px 150px',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#141414', marginBottom: '32px' }}>About Our Mission</h2>
        <div className="glass-premium" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#2C4A52', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '24px' }}>
            Diagnostic delays occur when medical data is trapped in silos. A doctor might see a clean X-ray but miss a severe genomic risk factor buried in an EHR file. 
          </p>
          <p style={{ color: '#2C4A52', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '32px' }}>
            <strong>DiagnoAI</strong> was built to solve this. We are engineering the ultimate AI co-pilot for healthcare professionals—empowering them to synthesize all patient data simultaneously, catch high-risk patterns instantly, and save lives.
          </p>
          <button 
            onClick={onLaunch}
            style={{
              padding: '12px 32px',
              borderRadius: '24px',
              background: 'transparent',
              color: '#36565F',
              border: '2px solid #36565F',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#36565F';
              e.currentTarget.style.color = '#FFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#36565F';
            }}
          >
            Try the Dashboard
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
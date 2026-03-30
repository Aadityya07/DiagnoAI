import React from 'react';

const VitalsForm = ({ formData, onChange, errors }) => {
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: parseFloat(value) });
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    border: `1px solid ${hasError ? '#E55353' : '#BDDBD1'}`,
    borderRadius: '10px',
    padding: '8px 12px',
    color: '#141414',
    outline: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
  });

  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#2C4A52', marginBottom: '6px' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      
      {/* Age */}
      <div>
        <label style={labelStyle}>Age</label>
        <input type="number" min="1" value={formData.age} onChange={(e) => onChange({ age: e.target.value })} style={inputStyle(errors.age)} placeholder="Years" />
      </div>

      {/* Heart Rate */}
      <div>
        <label style={labelStyle}>Heart Rate (bpm)</label>
        <input type="number" value={formData.heartRate} onChange={(e) => onChange({ heartRate: e.target.value })} style={inputStyle(errors.heartRate)} placeholder="e.g. 75" />
      </div>

      {/* Fasting Glucose */}
      <div>
        <label style={labelStyle}>Fasting Glucose (mg/dL)</label>
        <input type="number" value={formData.fastingGlucose} onChange={(e) => onChange({ fastingGlucose: e.target.value })} style={inputStyle()} placeholder="e.g. 90" />
      </div>

      {/* HbA1c */}
      <div>
        <label style={labelStyle}>HbA1c (%)</label>
        <input type="number" step="0.1" value={formData.hba1c} onChange={(e) => onChange({ hba1c: e.target.value })} style={inputStyle()} placeholder="e.g. 5.2" />
      </div>

      {/* Cough Duration */}
      <div>
        <label style={labelStyle}>Cough Duration (days)</label>
        <input type="number" min="0" value={formData.coughDuration} onChange={(e) => onChange({ coughDuration: e.target.value })} style={inputStyle(errors.coughDuration)} placeholder="Days" />
      </div>

      {/* Genomic Risk */}
      <div>
        <label style={labelStyle}>Genomic Risk</label>
        <select value={formData.genomicRisk} onChange={(e) => onChange({ genomicRisk: e.target.value })} style={inputStyle()}>
          <option value="Low">Low Risk</option>
          <option value="High">High Risk</option>
        </select>
      </div>

      {/* Smoking History Slider (Full Width) */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...labelStyle }}>
          <span>Smoking History (Pack-years)</span>
          <span style={{ color: '#36565F', fontWeight: 700 }}>{formData.packYears}</span>
        </div>
        <input type="range" name="packYears" min="0" max="40" step="1" value={formData.packYears} onChange={handleSliderChange} style={{ width: '100%' }} />
      </div>

      {/* O2 Saturation Slider (Full Width) */}
      <div style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...labelStyle }}>
          <span>O2 Saturation (%)</span>
          <span style={{ color: formData.o2Saturation < 92 ? '#E55353' : '#36565F', fontWeight: 700 }}>{formData.o2Saturation}%</span>
        </div>
        <input type="range" name="o2Saturation" min="80" max="100" step="1" value={formData.o2Saturation} onChange={handleSliderChange} style={{ width: '100%' }} />
      </div>

      {/* Weight Loss Toggle (Full Width) */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
        <label style={{ ...labelStyle, margin: 0 }}>Unexplained Weight Loss</label>
        <button
          type="button"
          onClick={() => onChange({ weightLoss: !formData.weightLoss })}
          style={{
            position: 'relative', width: '44px', height: '24px', borderRadius: '12px',
            background: formData.weightLoss ? '#36565F' : '#BDDBD1', border: 'none', cursor: 'pointer'
          }}
        >
          <span style={{
            position: 'absolute', top: '2px', left: formData.weightLoss ? '22px' : '2px',
            width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.3s'
          }} />
        </button>
      </div>

    </div>
  );
};

export default VitalsForm;
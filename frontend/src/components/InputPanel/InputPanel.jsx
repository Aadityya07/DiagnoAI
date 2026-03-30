import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import VitalsForm from './VitalsForm';
import AnalyzeButton from './AnalyzeButton';
import { useLanguage } from '../../context/LanguageContext';

const InputPanel = ({ onAnalyze, isAnalyzing }) => {
  const { currentLanguage } = useLanguage();
  
  // Default states mapping to all our backend keys
  const [formData, setFormData] = useState({
    age: '',
    packYears: 0,
    o2Saturation: 98,
    heartRate: 75,
    fastingGlucose: 90,
    hba1c: 5.0,
    genomicRisk: 'Low',
    weightLoss: false,
    coughDuration: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.age || formData.age < 0) newErrors.age = 'Required';
    if (formData.coughDuration === '' || formData.coughDuration < 0) newErrors.coughDuration = 'Required';
    if (!uploadedImage) newErrors.image = 'Chest X-ray is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (errors[Object.keys(updates)[0]]) {
      setErrors(prev => ({ ...prev, [Object.keys(updates)[0]]: null }));
    }
  };

  const handleAnalyzeClick = () => {
    if (validateForm()) {
      // Pass the language down so the backend knows what to translate!
      onAnalyze({ ...formData, uploadedImage, language: currentLanguage });
    }
  };

  return (
    <div className="glass-premium custom-scrollbar" style={{
      width: '35%',
      minWidth: '380px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto'
    }}>
      <div style={{ paddingBottom: '12px', borderBottom: '1px solid rgba(189, 219, 209, 0.4)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#141414', margin: 0 }}>Patient Data</h2>
        <p style={{ fontSize: '0.85rem', color: '#5F8190', margin: '4px 0 0 0' }}>Enter vitals & scan for multimodal fusion.</p>
      </div>

      <ImageUpload onImageUpload={setUploadedImage} error={errors.image} />
      
      <VitalsForm formData={formData} onChange={handleFormChange} errors={errors} />
      
      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <AnalyzeButton onClick={handleAnalyzeClick} isLoading={isAnalyzing} />
      </div>
    </div>
  );
};

export default InputPanel;
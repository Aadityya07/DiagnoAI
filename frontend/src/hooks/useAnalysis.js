import { useState, useCallback } from 'react';
import { endpoints } from '../services/api';

export const useAnalysis = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const analyze = useCallback(async (formData) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 500);
    
    try {
      const response = await endpoints.analyzePatient(formData);
      clearInterval(progressInterval);
      setProgress(100);
      
      const transformedData = {
        pneumonia: response.radiology_analysis?.Pneumonia || 0,
        tb: response.clinical_analysis?.TB_Risk === "High" ? 85 : 15,
        cancer: response.clinical_analysis?.Cancer_Risk === "High" ? 90 : 10,
        diabetes: response.clinical_analysis?.Diabetes_Risk === "High" ? 88 : 12,
        asthma: response.clinical_analysis?.Asthma_Risk === "High" ? 82 : 18,
        
        // FIX: Just pass the whole dictionary we created in app.py
        explanation: response.explainable_insight, 
        
        confidence: response.confidence,
        riskLevel: response.risk_level,
        audioBase64: response.audio_recommendation,
        clinicalFindings: response.clinical_analysis?.Clinical_Notes || [],
        radiologyError: response.radiology_analysis?.error || null
      };
      
      
      setAnalysisData(transformedData);
      return transformedData;
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.error || err.message || 'Analysis failed. Please check backend connection.');
      throw err;
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisData(null);
    setError(null);
    setProgress(0);
  }, []);

  return { analysisData, isLoading, error, progress, analyze, resetAnalysis };
};
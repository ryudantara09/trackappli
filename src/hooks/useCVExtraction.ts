'use client';

import { useState } from 'react';
import { CVExtractionResponse } from '../types/api.types';

export function useCVExtraction() {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<CVExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extractCV = async (file: File): Promise<CVExtractionResponse | null> => {
    setExtracting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await fetch('/api/profile/cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract CV data');
      }

      const result = await response.json();
      setExtractedData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract CV';
      setError(errorMessage);
      return null;
    } finally {
      setExtracting(false);
    }
  };

  const clearExtractedData = () => {
    setExtractedData(null);
    setError(null);
  };

  return { 
    extractCV, 
    extracting, 
    extractedData,
    error,
    clearExtractedData,
  };
}

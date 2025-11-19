'use client';

import { useState } from 'react';
import { JobExtractionResponse } from '../types/api.types';

/**
 * Hook return type
 */
export interface UseJobExtractionReturn {
  extractJobPosting: (rawText: string) => Promise<JobExtractionResponse | null>;
  extracting: boolean;
  extractedData: JobExtractionResponse | null;
  error: string | null;
  clearExtractedData: () => void;
}

/**
 * Custom hook for extracting job posting details using AI
 * 
 * @returns Job extraction operations and state
 * 
 * @example
 * ```tsx
 * const { extractJobPosting, extracting, extractedData } = useJobExtraction();
 * 
 * const handleExtract = async (text: string) => {
 *   const data = await extractJobPosting(text);
 *   if (data) {
 *     // Use extracted data to populate form
 *   }
 * };
 * ```
 */
export function useJobExtraction(): UseJobExtractionReturn {
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<JobExtractionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Extract job posting details from raw text using AI
   * 
   * @param rawText - Raw job posting text (from URL, copy-paste, etc.)
   * @returns Extracted job details or null on error
   */
  const extractJobPosting = async (rawText: string): Promise<JobExtractionResponse | null> => {
    if (!rawText || rawText.trim().length === 0) {
      setError('Please provide job posting text to extract');
      return null;
    }

    setExtracting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ rawText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract job posting data');
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('No data extracted from job posting');
      }

      // Map snake_case from API to camelCase for frontend
      const mappedData: JobExtractionResponse = {
        positionTitle: result.data.position_title,
        company: result.data.company,
        location: result.data.location,
        jobType: result.data.job_type,
        techStack: result.data.tech_stack,
        softSkills: result.data.soft_skills,
        description: result.data.description,
        salaryRange: result.data.salary_range,
      };

      setExtractedData(mappedData);
      return mappedData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to extract job posting. Please try again.';
      setError(errorMessage);
      console.error('Job extraction error:', err);
      return null;
    } finally {
      setExtracting(false);
    }
  };

  /**
   * Clear extracted data and error state
   */
  const clearExtractedData = () => {
    setExtractedData(null);
    setError(null);
  };

  return { 
    extractJobPosting, 
    extracting, 
    extractedData,
    error,
    clearExtractedData,
  };
}

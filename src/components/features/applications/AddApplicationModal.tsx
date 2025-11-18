'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationStatus, ApplicationFormData } from '@/types/frontend.types';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@/components/ui/Icon';
import { FileUpload } from '@/components/ui/FileUpload';
import { useJobExtraction } from '@/hooks/useJobExtraction';
import { useToastContext } from '@/contexts/ToastContext';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (application: ApplicationFormData) => void;
}

const initialFormState: ApplicationFormData = {
  position: '',
  company: '',
  location: '',
  status: ApplicationStatus.APPLIED,
  url: '',
  description: '',
  skills: [],
  notes: '',
};

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddApplication
}) => {
  const [formState, setFormState] = useState(initialFormState);
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [extractionText, setExtractionText] = useState('');
  
  const { showSuccess, showError } = useToastContext();
  const { extractJobPosting, extracting, error: extractionError, clearExtractedData } = useJobExtraction();

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setFormState(initialFormState);
        setShowExtractModal(false);
        setExtractionText('');
        clearExtractedData();
      }, 300); // Delay to allow for closing animation
    }
  }, [isOpen, clearExtractedData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev, 
      skills: e.target.value.split(',').map(s => s.trim())
    }));
  };

  const handleExtractClick = () => {
    setShowExtractModal(true);
  };

  const handleExtractSubmit = async () => {
    if (!extractionText.trim()) {
      showError('Please paste job posting text');
      return;
    }

    const data = await extractJobPosting(extractionText);
    
    if (data) {
      // Populate form with extracted data
      setFormState(prev => ({
        ...prev,
        position: data.positionTitle || prev.position,
        company: data.company || prev.company,
        location: data.location || prev.location,
        description: data.description || prev.description,
        skills: data.techStack || prev.skills,
        softSkills: data.softSkills || prev.softSkills,
        // Note: jobType from API is a string, would need mapping to JobType enum if needed
        // For now, we'll skip it to avoid type issues
      }));
      
      setShowExtractModal(false);
      setExtractionText('');
      showSuccess('Job details extracted successfully! Review and edit as needed.');
    } else if (extractionError) {
      showError(extractionError);
    }
  };

  const handleCancelExtract = () => {
    setShowExtractModal(false);
    setExtractionText('');
    clearExtractedData();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.position || !formState.company) {
      showError('Position and Company are required fields.');
      return;
    }
    onAddApplication(formState);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Add Application Modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
          style={{ animationFillMode: 'forwards' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Add New Application</h2>
            <button onClick={onClose} className="text-neutral-gray hover:text-black">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

        <div className="p-6 overflow-y-auto">
          {/* AI Extraction Button */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">AI-Powered Job Extraction</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Paste a job posting and let AI extract the details automatically
                </p>
              </div>
              <Button 
                onClick={handleExtractClick}
                variant="secondary"
                size="small"
                type="button"
              >
                Extract Job Details
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Position" 
                name="position" 
                value={formState.position} 
                onChange={handleFormChange} 
                required 
              />
              <InputField 
                label="Company" 
                name="company" 
                value={formState.company} 
                onChange={handleFormChange} 
                required 
              />
            </div>
            <InputField 
              label="Location" 
              name="location" 
              value={formState.location} 
              onChange={handleFormChange} 
            />
            <InputField 
              label="Job URL" 
              name="url" 
              value={formState.url} 
              onChange={handleFormChange} 
            />
            <InputField 
              label="Technical Skills (comma separated)" 
              name="skills" 
              value={formState.skills?.join(', ') || ''} 
              onChange={handleSkillsChange} 
            />
            <InputField 
              label="Soft Skills (comma separated)" 
              name="softSkills" 
              value={formState.softSkills?.join(', ') || ''} 
              onChange={(e) => setFormState(prev => ({
                ...prev, 
                softSkills: e.target.value.split(',').map(s => s.trim())
              }))} 
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formState.description}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formState.notes}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                type="cv"
                currentFile={formState.cvPath}
                onFileUploaded={(path) => {
                  setFormState(prev => ({ ...prev, cvPath: path }));
                }}
                onFileDeleted={() => {
                  setFormState(prev => ({ ...prev, cvPath: undefined }));
                }}
              />
              <FileUpload
                type="cover_letter"
                currentFile={formState.coverLetterPath}
                onFileUploaded={(path) => {
                  setFormState(prev => ({ ...prev, coverLetterPath: path }));
                }}
                onFileDeleted={() => {
                  setFormState(prev => ({ ...prev, coverLetterPath: undefined }));
                }}
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t bg-gray-50 flex justify-end items-center">
          <Button onClick={onClose} variant="secondary" className="mr-4">
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" size="medium">
            Save Application
          </Button>
        </div>
        </div>
      </div>

      {/* AI Extraction Modal */}
      {showExtractModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={handleCancelExtract}>
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
            style={{ animationFillMode: 'forwards' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Extract Job Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Paste the job posting text below and AI will extract the details
                </p>
              </div>
              <button onClick={handleCancelExtract} className="text-neutral-gray hover:text-black">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div>
                <label htmlFor="extractionText" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Posting Text
                </label>
                <textarea
                  id="extractionText"
                  rows={15}
                  value={extractionText}
                  onChange={(e) => setExtractionText(e.target.value)}
                  placeholder="Paste the job posting text here (from job board, company website, email, etc.)..."
                  className="block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
                  disabled={extracting}
                />
                {extractionError && (
                  <p className="mt-2 text-sm text-red-600">{extractionError}</p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Tip: Copy the entire job posting including title, company, requirements, and description for best results
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end items-center">
              <Button 
                onClick={handleCancelExtract} 
                variant="secondary" 
                className="mr-4"
                disabled={extracting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleExtractSubmit} 
                size="medium"
                disabled={extracting || !extractionText.trim()}
              >
                {extracting ? 'Extracting...' : 'Extract & Fill Form'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out; }
      `}</style>
    </>
  );
};

// Helper component for form fields
const InputField: React.FC<{
  label: string;
  name: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, name, value, onChange, required }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
    />
  </div>
);

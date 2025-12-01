'use client';

import React, { useState, useEffect } from 'react';
import { ApplicationStatus, ApplicationFormData } from '@/types/frontend.types';
import { Button } from '@/components/ui/Button';
import { XMarkIcon, PencilIcon, SparklesIcon } from '@/components/ui/Icon';
import { FileUpload } from '@/components/ui/FileUpload';
import { useJobExtraction } from '@/hooks/useJobExtraction';
import { useToastContext } from '@/contexts/ToastContext';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (application: ApplicationFormData) => void;
}

type TabType = 'extract' | 'manual';

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
  const [activeTab, setActiveTab] = useState<TabType>('extract');
  const [formState, setFormState] = useState(initialFormState);
  const [extractionText, setExtractionText] = useState('');
  const [extractJobUrl, setExtractJobUrl] = useState('');
  
  const { showSuccess, showError } = useToastContext();
  const { extractJobPosting, extracting, error: extractionError, clearExtractedData } = useJobExtraction();

  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setTimeout(() => {
        setFormState(initialFormState);
        setActiveTab('extract');
        setExtractionText('');
        setExtractJobUrl('');
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

  const handleExtractSubmit = async () => {
    if (!extractionText.trim()) {
      showError('Please paste job posting text');
      return;
    }

    const data = await extractJobPosting(extractionText);
    
    if (data) {
      // Populate form with extracted data and switch to manual tab
      setFormState(prev => ({
        ...prev,
        position: data.positionTitle || prev.position,
        company: data.company || prev.company,
        location: data.location || prev.location,
        description: data.description || prev.description,
        skills: data.techStack || prev.skills,
        softSkills: data.softSkills || prev.softSkills,
        jobType: (data.jobType as any) || prev.jobType,
        url: extractJobUrl || prev.url,
      }));
      
      setActiveTab('manual');
      setExtractionText('');
      setExtractJobUrl('');
      showSuccess('Job details extracted successfully! Review and edit as needed.');
    } else if (extractionError) {
      showError(extractionError);
    }
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
          className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
          style={{ animationFillMode: 'forwards' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">Add New Application</h2>
            <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-border-light dark:border-neutral-border-dark">
            <button
              onClick={() => setActiveTab('extract')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'extract'
                  ? 'text-primary-blue border-b-2 border-primary-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'text-neutral-gray hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark'
              }`}
            >
              <SparklesIcon className="w-5 h-5 inline-block mr-2" />
              Extract with AI
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'text-primary-blue border-b-2 border-primary-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'text-neutral-gray hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark'
              }`}
            >
              <PencilIcon className="w-5 h-5 inline-block mr-2" />
              Add Manually
            </button>
          </div>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'extract' ? (
            // Extract with AI Tab
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
                  Extract Job Details with AI
                </h3>
                <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark mb-6">
                  Paste the entire job posting text below and AI will extract the details automatically
                </p>
              </div>

              <div>
                <label htmlFor="extractionText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Posting Text
                </label>
                <textarea
                  id="extractionText"
                  rows={12}
                  value={extractionText}
                  onChange={(e) => setExtractionText(e.target.value)}
                  placeholder="Paste the entire job posting text here (from job board, company website, email, etc.)..."
                  className="block w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
                  disabled={extracting}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Tip: Copy the entire job posting including title, company, requirements, and description for best results
                </p>
              </div>

              <div>
                <label htmlFor="extractJobUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job URL (Optional)
                </label>
                <input
                  type="url"
                  id="extractJobUrl"
                  value={extractJobUrl}
                  onChange={(e) => setExtractJobUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="block w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
                  disabled={extracting}
                />
              </div>

              {extractionError && (
                <p className="mt-2 text-sm text-red-600">{extractionError}</p>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleExtractSubmit}
                  size="medium"
                  disabled={extracting || !extractionText.trim()}
                >
                  {extracting ? 'Extracting...' : 'Extract & Fill Form'}
                </Button>
              </div>
            </div>
          ) : (
            // Manual Entry Tab
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
            <InputField 
              label="Tags (comma separated)" 
              name="tags" 
              value={formState.tags?.join(', ') || ''} 
              onChange={(e) => setFormState(prev => ({
                ...prev, 
                tags: e.target.value.split(',').map(s => s.trim())
              }))} 
            />
            <InputField 
              label="Job Type" 
              name="jobType" 
              value={formState.jobType || ''} 
              onChange={handleFormChange} 
            />

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formState.description}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formState.notes}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
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
          )}
        </div>
        
        {activeTab === 'manual' && (
          <div className="p-6 border-t border-neutral-border-light dark:border-neutral-border-dark bg-gray-50 dark:bg-neutral-bg-dark flex justify-end items-center">
            <Button onClick={onClose} variant="secondary" className="mr-4">
              Cancel
            </Button>
            <Button onClick={handleSubmit} type="submit" size="medium">
              Save Application
            </Button>
          </div>
        )}
        </div>
      </div>

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
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border-neutral-border-light dark:border-neutral-border-dark rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3 bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
    />
  </div>
);


'use client';

import React, { useState, useEffect } from 'react';
import { FrontendApplication, ApplicationStatus, JobType } from '@/types/frontend.types';
import { Button } from '@/components/ui/Button';
import { XMarkIcon } from '@/components/ui/Icon';
import { FileUpload } from '@/components/ui/FileUpload';
import { useToastContext } from '@/contexts/ToastContext';

interface EditApplicationModalProps {
  isOpen: boolean;
  application: FrontendApplication | null;
  onClose: () => void;
  onUpdateApplication: (application: FrontendApplication) => void;
}

export const EditApplicationModal: React.FC<EditApplicationModalProps> = ({ 
  isOpen, 
  application,
  onClose, 
  onUpdateApplication
}) => {
  const { showError } = useToastContext();
  const [formState, setFormState] = useState<FrontendApplication | null>(null);

  useEffect(() => {
    if (isOpen && application) {
      setFormState({ ...application });
    }
  }, [isOpen, application]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => prev ? {
      ...prev, 
      skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
    } : null);
  };

  const handleSoftSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => prev ? {
      ...prev, 
      softSkills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
    } : null);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => prev ? {
      ...prev, 
      tags: e.target.value.split(',').map(s => s.trim()).filter(s => s)
    } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    
    if (!formState.position || !formState.company) {
      showError('Position and Company are required fields.');
      return;
    }
    onUpdateApplication(formState);
  };

  if (!isOpen || !formState) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Application</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField 
                label="Location" 
                name="location" 
                value={formState.location || ''} 
                onChange={handleFormChange} 
              />
              <InputField 
                label="Job URL" 
                name="url" 
                value={formState.url || ''} 
                onChange={handleFormChange} 
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formState.status}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
              >
                <option value={ApplicationStatus.APPLIED}>Applied</option>
                <option value={ApplicationStatus.INTERVIEW}>Interview</option>
                <option value={ApplicationStatus.OFFER}>Offer</option>
                <option value={ApplicationStatus.REJECTED}>Rejected</option>
                <option value={ApplicationStatus.WITHDRAWN}>Withdrawn</option>
              </select>
            </div>
            <div>
              <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formState.jobType || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
              >
                <option value="">Select job type...</option>
                <option value={JobType.FULL_TIME}>Full-time</option>
                <option value={JobType.PART_TIME}>Part-time</option>
                <option value={JobType.CONTRACT}>Contract</option>
                <option value={JobType.INTERNSHIP}>Internship</option>
                <option value={JobType.FREELANCE}>Freelance</option>
              </select>
            </div>
            <InputField 
              label="Skills (comma separated)" 
              name="skills" 
              value={formState.skills?.join(', ') || ''} 
              onChange={handleSkillsChange} 
            />
            <InputField 
              label="Soft Skills (comma separated)" 
              name="softSkills" 
              value={formState.softSkills?.join(', ') || ''} 
              onChange={handleSoftSkillsChange} 
            />
            <InputField 
              label="Tags (comma separated)" 
              name="tags" 
              value={formState.tags?.join(', ') || ''} 
              onChange={handleTagsChange} 
            />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formState.description || ''}
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
                value={formState.notes || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border-neutral-border-light rounded-md shadow-sm focus:ring-primary-blue focus:border-primary-blue sm:text-sm p-3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUpload
                type="cv"
                currentFile={formState.cvPath}
                onFileUploaded={(path) => {
                  setFormState(prev => prev ? { ...prev, cvPath: path } : null);
                }}
                onFileDeleted={() => {
                  setFormState(prev => prev ? { ...prev, cvPath: undefined } : null);
                }}
              />
              <FileUpload
                type="cover_letter"
                currentFile={formState.coverLetterPath}
                onFileUploaded={(path) => {
                  setFormState(prev => prev ? { ...prev, coverLetterPath: path } : null);
                }}
                onFileDeleted={() => {
                  setFormState(prev => prev ? { ...prev, coverLetterPath: undefined } : null);
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
            Update Application
          </Button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out; }
      `}</style>
    </div>
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

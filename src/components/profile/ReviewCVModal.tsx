import React, { useState, useEffect } from 'react';
import { CVExtraction, CVPersonalInfo, CVWorkExperience, CVEducation, CVTechnicalSkill } from '../../types/ai.types';
import { Button } from '../ui/Button';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon, 
  UserIcon, 
  BriefcaseIcon, 
  NotebookPenIcon,
  BoltIcon 
} from '../ui/Icon';

interface ReviewCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CVExtraction;
  onSave: (data: CVExtraction) => Promise<void>;
}

type Tab = 'personal' | 'experience' | 'education' | 'skills';

export default function ReviewCVModal({ isOpen, onClose, initialData, onSave }: ReviewCVModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [formData, setFormData] = useState<CVExtraction>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof CVPersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: value
      }
    }));
  };

  // Experience Helpers
  const addExperience = () => {
    const newExp: CVWorkExperience = {
      company: '',
      position: '',
      start_date: '',
      current: false,
      description: '',
      technologies: []
    };
    setFormData(prev => ({
      ...prev,
      work_experience: [...(prev.work_experience || []), newExp]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience?.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: keyof CVWorkExperience, value: any) => {
    setFormData(prev => {
      const newExp = [...(prev.work_experience || [])];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, work_experience: newExp };
    });
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: CVEducation = {
      institution: '',
      degree: '',
      start_date: '',
      current: false
    };
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: any) => {
    setFormData(prev => {
      const newEdu = [...(prev.education || [])];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  // Skills Helpers
  const addSkill = () => {
    const newSkill: CVTechnicalSkill = {
      category: '',
      name: ''
    };
    setFormData(prev => ({
      ...prev,
      technical_skills: [...(prev.technical_skills || []), newSkill]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technical_skills: prev.technical_skills?.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, field: keyof CVTechnicalSkill, value: string) => {
    setFormData(prev => {
      const newSkills = [...(prev.technical_skills || [])];
      newSkills[index] = { ...newSkills[index], [field]: value };
      return { ...prev, technical_skills: newSkills };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Review CV Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <TabButton 
            active={activeTab === 'personal'} 
            onClick={() => setActiveTab('personal')} 
            icon={<UserIcon className="w-4 h-4" />}
            label="Personal" 
          />
          <TabButton 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')} 
            icon={<BriefcaseIcon className="w-4 h-4" />}
            label="Experience" 
          />
          <TabButton 
            active={activeTab === 'education'} 
            onClick={() => setActiveTab('education')} 
            icon={<NotebookPenIcon className="w-4 h-4" />}
            label="Education" 
          />
          <TabButton 
            active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')} 
            icon={<BoltIcon className="w-4 h-4" />}
            label="Skills" 
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          {activeTab === 'personal' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <InputField 
                label="Full Name" 
                value={formData.personal_info?.name || ''} 
                onChange={(v) => updatePersonalInfo('name', v)} 
              />
              <InputField 
                label="Email" 
                value={formData.personal_info?.email || ''} 
                onChange={(v) => updatePersonalInfo('email', v)} 
              />
              <InputField 
                label="Phone" 
                value={formData.personal_info?.phone || ''} 
                onChange={(v) => updatePersonalInfo('phone', v)} 
              />
              <InputField 
                label="Location" 
                value={formData.personal_info?.location || ''} 
                onChange={(v) => updatePersonalInfo('location', v)} 
              />
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              {formData.work_experience?.map((exp, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative group">
                  <button 
                    onClick={() => removeExperience(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InputField 
                      label="Company" 
                      value={exp.company} 
                      onChange={(v) => updateExperience(index, 'company', v)} 
                    />
                    <InputField 
                      label="Position" 
                      value={exp.position} 
                      onChange={(v) => updateExperience(index, 'position', v)} 
                    />
                    <InputField 
                      label="Start Date" 
                      value={exp.start_date} 
                      onChange={(v) => updateExperience(index, 'start_date', v)} 
                      placeholder="YYYY-MM"
                    />
                    <div className="flex items-end gap-4">
                      <InputField 
                        label="End Date" 
                        value={exp.end_date || ''} 
                        onChange={(v) => updateExperience(index, 'end_date', v)} 
                        disabled={exp.current}
                        placeholder="YYYY-MM"
                      />
                      <label className="flex items-center gap-2 mb-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={exp.current} 
                          onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
                        />
                        <span className="text-sm text-gray-600">Current</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        value={exp.description || ''}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue min-h-[100px]"
                      />
                    </div>
                    <InputField 
                      label="Technologies (comma separated)" 
                      value={exp.technologies?.join(', ') || ''} 
                      onChange={(v) => updateExperience(index, 'technologies', v.split(',').map(s => s.trim()).filter(Boolean))} 
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addExperience} variant="secondary" className="w-full border-dashed">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Experience
              </Button>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6">
              {formData.education?.map((edu, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative group">
                  <button 
                    onClick={() => removeEducation(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                      label="Institution" 
                      value={edu.institution} 
                      onChange={(v) => updateEducation(index, 'institution', v)} 
                    />
                    <InputField 
                      label="Degree" 
                      value={edu.degree} 
                      onChange={(v) => updateEducation(index, 'degree', v)} 
                    />
                    <InputField 
                      label="Field of Study" 
                      value={edu.field_of_study || ''} 
                      onChange={(v) => updateEducation(index, 'field_of_study', v)} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField 
                        label="Start Date" 
                        value={edu.start_date} 
                        onChange={(v) => updateEducation(index, 'start_date', v)} 
                        placeholder="YYYY-MM"
                      />
                      <InputField 
                        label="End Date" 
                        value={edu.end_date || ''} 
                        onChange={(v) => updateEducation(index, 'end_date', v)} 
                        placeholder="YYYY-MM"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addEducation} variant="secondary" className="w-full border-dashed">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Education
              </Button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.technical_skills?.map((skill, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group flex gap-3 items-start">
                    <div className="flex-1 space-y-3">
                      <InputField 
                        label="Category" 
                        value={skill.category} 
                        onChange={(v) => updateSkill(index, 'category', v)} 
                        placeholder="e.g. Frontend"
                      />
                      <InputField 
                        label="Skill Name" 
                        value={skill.name} 
                        onChange={(v) => updateSkill(index, 'name', v)} 
                        placeholder="e.g. React"
                      />
                      <InputField 
                        label="Proficiency" 
                        value={skill.proficiency || ''} 
                        onChange={(v) => updateSkill(index, 'proficiency', v)} 
                        placeholder="e.g. Senior"
                      />
                    </div>
                    <button 
                      onClick={() => removeSkill(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button onClick={addSkill} variant="secondary" className="w-full border-dashed">
                <PlusIcon className="w-4 h-4 mr-2" /> Add Skill
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
        active 
          ? 'border-primary-blue text-primary-blue bg-blue-50/50' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

function InputField({ label, onChange, value, className = '', ...props }: InputFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-blue focus:ring-primary-blue h-10 px-3"
        {...props}
      />
    </div>
  );
}

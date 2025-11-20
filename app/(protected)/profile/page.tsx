'use client';

import React, { useState } from 'react';
import { useProfile } from '../../../src/hooks/useProfile';
import { useCVExtraction } from '../../../src/hooks/useCVExtraction';
import { useToastContext } from '../../../src/contexts/ToastContext';
import { Button } from '../../../src/components/ui/Button';
import { PlusIcon } from '../../../src/components/ui/Icon';
import { PageHeader } from '../../../src/components/ui/PageHeader';
import { Header } from '../../../src/components/layout/Header';
import { SKILL_PROFICIENCY, SkillProficiency, SkillCategory } from '../../../src/config/constants';
import { WorkExperience, Education, TechnicalSkill } from '../../../src/types/api.types';

type Tab = 'personal' | 'experience' | 'education' | 'skills';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const { profile, loading, error } = useProfile();
  const { extractCV, extracting } = useCVExtraction();
  const { showSuccess, showError } = useToastContext();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
  ];

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await extractCV(file);
    if (result) {
      showSuccess('CV extracted successfully! Review and save the information.');
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-full min-h-[50vh] text-neutral-gray">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-full min-h-[50vh] text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <Header />
      <PageHeader 
        title="Profile" 
        description="Manage your professional information"
      />

      {/* Tabs */}
      <div className="border-b border-neutral-border-light dark:border-neutral-border-dark mb-8 overflow-x-auto">
        <nav className="flex space-x-6 sm:space-x-8 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-neutral-gray hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark hover:border-neutral-border-light dark:hover:border-neutral-border-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <PersonalInfoTab onCVUpload={handleCVUpload} extracting={extracting} />
      )}

      {/* Work Experience Tab */}
      {activeTab === 'experience' && profile && (
        <ExperienceTab experiences={profile.workExperience} />
      )}

      {/* Education Tab */}
      {activeTab === 'education' && profile && (
        <EducationTab education={profile.education} />
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && profile && (
        <SkillsTab skills={profile.technicalSkills} />
      )}
    </div>
  );
}


// Personal Info Tab Component
function PersonalInfoTab({ onCVUpload, extracting }: { onCVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; extracting: boolean }) {
  return (
    <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Personal Information</h2>
        <div className="flex gap-2">
          <label htmlFor="cv-upload" className="cursor-pointer">
            <span className="inline-flex items-center justify-center px-4 py-2 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg font-medium text-sm bg-white dark:bg-neutral-surface-dark hover:bg-neutral-bg-light dark:hover:bg-neutral-bg-dark transition-colors">
              {extracting ? 'Extracting...' : 'Upload CV'}
            </span>
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              onChange={onCVUpload}
              className="hidden"
              disabled={extracting}
            />
          </label>
        </div>
      </div>

      <div className="text-center py-12 text-neutral-gray">
        <p>Upload your CV to automatically extract your profile information</p>
        <p className="text-sm mt-2">or manually add your experience, education, and skills using the tabs above</p>
      </div>
    </div>
  );
}


// Work Experience Tab Component
function ExperienceTab({ experiences }: { experiences: WorkExperience[] }) {
  const { deleteExperience } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      await deleteExperience(id);
      showSuccess('Experience deleted successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete experience');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button size="medium" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-12 text-center">
          <p className="text-neutral-gray">No work experience added yet</p>
          <Button size="medium" onClick={() => setShowAddModal(true)} className="mt-4">
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                    {exp.position}
                  </h3>
                  <p className="text-neutral-gray">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </p>
                  <p className="text-sm text-neutral-gray mt-1">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small" onClick={() => setEditingExperience(exp)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(exp.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {exp.description && (
                <p className="text-neutral-gray mb-4">{exp.description}</p>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs font-medium bg-primary-light text-primary-dark rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddExperienceModal onClose={() => setShowAddModal(false)} />
      )}
      {editingExperience && (
        <EditExperienceModal
          experience={editingExperience}
          onClose={() => setEditingExperience(null)}
        />
      )}
    </div>
  );
}


// Education Tab Component
function EducationTab({ education }: { education: Education[] }) {
  const { deleteEducation } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education?')) return;
    
    try {
      await deleteEducation(id);
      showSuccess('Education deleted successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete education');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button size="medium" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-12 text-center">
          <p className="text-neutral-gray">No education added yet</p>
          <Button size="medium" onClick={() => setShowAddModal(true)} className="mt-4">
            Add Your First Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map(edu => (
            <div
              key={edu.id}
              className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                    {edu.degree}
                  </h3>
                  <p className="text-neutral-gray">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </p>
                  <p className="text-sm text-neutral-gray mt-1">
                    {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -{' '}
                    {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </p>
                  {edu.fieldOfStudy && (
                    <p className="text-sm text-neutral-gray">Field: {edu.fieldOfStudy}</p>
                  )}
                  {edu.gpa && (
                    <p className="text-sm text-neutral-gray">GPA: {edu.gpa}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="small" onClick={() => setEditingEducation(edu)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="small" onClick={() => handleDelete(edu.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {edu.description && (
                <p className="text-neutral-gray">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddEducationModal onClose={() => setShowAddModal(false)} />
      )}
      {editingEducation && (
        <EditEducationModal
          education={editingEducation}
          onClose={() => setEditingEducation(null)}
        />
      )}
    </div>
  );
}


// Skills Tab Component
function SkillsTab({ skills }: { skills: TechnicalSkill[] }) {
  const { deleteSkill } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<TechnicalSkill | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await deleteSkill(id);
      showSuccess('Skill deleted successfully');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete skill');
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button size="medium" onClick={() => setShowAddModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-12 text-center">
          <p className="text-neutral-gray">No skills added yet</p>
          <Button size="medium" onClick={() => setShowAddModal(true)} className="mt-4">
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div
              key={category}
              className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6"
            >
              <h3 className="text-lg font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {(categorySkills as TechnicalSkill[]).map((skill: TechnicalSkill) => (
                  <div
                    key={skill.id}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-light text-primary-dark rounded-lg group"
                  >
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs opacity-70">({skill.proficiency})</span>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-primary-dark hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddSkillModal onClose={() => setShowAddModal(false)} />
      )}
      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}
    </div>
  );
}


// Add Experience Modal
function AddExperienceModal({ onClose }: { onClose: () => void }) {
  const { addExperience } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    technologies: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addExperience({
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(',').map((t: string) => t.trim()) : undefined,
      });
      showSuccess('Experience added successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to add experience');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Work Experience</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current"
              checked={formData.current}
              onChange={e => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
              className="mr-2"
            />
            <label htmlFor="current" className="text-sm">I currently work here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
            <input
              type="text"
              value={formData.technologies}
              onChange={e => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Add Experience
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Edit Experience Modal
function EditExperienceModal({ experience, onClose }: { experience: WorkExperience; onClose: () => void }) {
  const { updateExperience } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    company: experience.company,
    position: experience.position,
    location: experience.location || '',
    start_date: new Date(experience.startDate).toISOString().split('T')[0],
    end_date: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
    current: experience.current,
    description: experience.description || '',
    technologies: experience.technologies ? experience.technologies.join(', ') : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateExperience(experience.id, {
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : undefined,
      });
      showSuccess('Experience updated successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update experience');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Work Experience</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current-edit"
              checked={formData.current}
              onChange={e => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
              className="mr-2"
            />
            <label htmlFor="current-edit" className="text-sm">I currently work here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Technologies (comma separated)</label>
            <input
              type="text"
              value={formData.technologies}
              onChange={e => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, TypeScript, Node.js"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Update Experience
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Add Education Modal
function AddEducationModal({ onClose }: { onClose: () => void }) {
  const { addEducation } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    gpa: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addEducation(formData);
      showSuccess('Education added successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to add education');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Education</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Institution *</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Degree *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Field of Study</label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={e => setFormData({ ...formData, field_of_study: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current-edu"
              checked={formData.current}
              onChange={e => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
              className="mr-2"
            />
            <label htmlFor="current-edu" className="text-sm">I currently study here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GPA</label>
            <input
              type="text"
              value={formData.gpa}
              onChange={e => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="3.8/4.0"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Add Education
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Edit Education Modal
function EditEducationModal({ education, onClose }: { education: Education; onClose: () => void }) {
  const { updateEducation } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    institution: education.institution,
    degree: education.degree,
    field_of_study: education.fieldOfStudy || '',
    location: education.location || '',
    start_date: new Date(education.startDate).toISOString().split('T')[0],
    end_date: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '',
    current: education.current,
    gpa: education.gpa || '',
    description: education.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateEducation(education.id, formData);
      showSuccess('Education updated successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update education');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Education</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Institution *</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={e => setFormData({ ...formData, institution: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Degree *</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={e => setFormData({ ...formData, degree: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Field of Study</label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={e => setFormData({ ...formData, field_of_study: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.current}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current-edu-edit"
              checked={formData.current}
              onChange={e => setFormData({ ...formData, current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
              className="mr-2"
            />
            <label htmlFor="current-edu-edit" className="text-sm">I currently study here</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">GPA</label>
            <input
              type="text"
              value={formData.gpa}
              onChange={e => setFormData({ ...formData, gpa: e.target.value })}
              placeholder="3.8/4.0"
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Update Education
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Add Skill Modal
function AddSkillModal({ onClose }: { onClose: () => void }) {
  const { addSkill } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    category: 'FRAMEWORK' as SkillCategory,
    name: '',
    proficiency: SKILL_PROFICIENCY.INTERMEDIATE as SkillProficiency,
    years_of_exp: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addSkill({
        ...formData,
        years_of_exp: formData.years_of_exp ? parseInt(formData.years_of_exp) : undefined,
      });
      showSuccess('Skill added successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to add skill');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Skill</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="React, Python, etc."
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              >
                <option value="PROGRAMMING_LANGUAGE">Programming Language</option>
                <option value="FRAMEWORK">Framework</option>
                <option value="DATABASE">Database</option>
                <option value="TOOL">Tool</option>
                <option value="CLOUD">Cloud</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Proficiency *</label>
              <select
                required
                value={formData.proficiency}
                onChange={e => setFormData({ ...formData, proficiency: e.target.value as SkillProficiency })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              >
                <option value={SKILL_PROFICIENCY.BEGINNER}>Beginner</option>
                <option value={SKILL_PROFICIENCY.INTERMEDIATE}>Intermediate</option>
                <option value={SKILL_PROFICIENCY.ADVANCED}>Advanced</option>
                <option value={SKILL_PROFICIENCY.EXPERT}>Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={formData.years_of_exp}
                onChange={e => setFormData({ ...formData, years_of_exp: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Add Skill
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Skill Modal
function EditSkillModal({ skill, onClose }: { skill: TechnicalSkill; onClose: () => void }) {
  const { updateSkill } = useProfile();
  const { showSuccess, showError } = useToastContext();
  const [formData, setFormData] = useState({
    category: skill.category,
    name: skill.name,
    proficiency: skill.proficiency as SkillProficiency,
    years_of_exp: skill.yearsOfExp?.toString() || '',
    description: skill.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSkill(skill.id, {
        ...formData,
        years_of_exp: formData.years_of_exp ? parseInt(formData.years_of_exp) : undefined,
      });
      showSuccess('Skill updated successfully');
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update skill');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-surface-dark rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Skill</h2>
          <button onClick={onClose} className="text-neutral-gray hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Skill Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as SkillCategory })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              >
                <option value="PROGRAMMING_LANGUAGE">Programming Language</option>
                <option value="FRAMEWORK">Framework</option>
                <option value="DATABASE">Database</option>
                <option value="TOOL">Tool</option>
                <option value="CLOUD">Cloud</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Proficiency *</label>
              <select
                required
                value={formData.proficiency}
                onChange={e => setFormData({ ...formData, proficiency: e.target.value as SkillProficiency })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              >
                <option value={SKILL_PROFICIENCY.BEGINNER}>Beginner</option>
                <option value={SKILL_PROFICIENCY.INTERMEDIATE}>Intermediate</option>
                <option value={SKILL_PROFICIENCY.ADVANCED}>Advanced</option>
                <option value={SKILL_PROFICIENCY.EXPERT}>Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={formData.years_of_exp}
                onChange={e => setFormData({ ...formData, years_of_exp: e.target.value })}
                className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-neutral-border-light dark:border-neutral-border-dark rounded-md p-2 bg-white dark:bg-neutral-bg-dark"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Update Skill
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  WorkExperience,
  Education,
  TechnicalSkill,
  CreateWorkExperienceRequest,
  UpdateWorkExperienceRequest,
  CreateEducationRequest,
  UpdateEducationRequest,
  CreateTechnicalSkillRequest,
  UpdateTechnicalSkillRequest,
  CVExtractionResponse,
} from '../types/api.types';

interface ProfileData {
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkill[];
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const result = await response.json();
      setProfile(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Work Experience operations
  const addExperience = async (data: CreateWorkExperienceRequest) => {
    const response = await fetch('/api/profile/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add experience');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      workExperience: [...prev.workExperience, result.data],
    } : null);
    return result.data;
  };

  const updateExperience = async (id: string, data: UpdateWorkExperienceRequest) => {
    const response = await fetch(`/api/profile/experience/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update experience');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      workExperience: prev.workExperience.map(exp =>
        exp.id === id ? result.data : exp
      ),
    } : null);
    return result.data;
  };

  const deleteExperience = async (id: string) => {
    const response = await fetch(`/api/profile/experience/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete experience');
    }

    setProfile(prev => prev ? {
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id),
    } : null);
  };

  // Education operations
  const addEducation = async (data: CreateEducationRequest) => {
    const response = await fetch('/api/profile/education', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add education');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      education: [...prev.education, result.data],
    } : null);
    return result.data;
  };

  const updateEducation = async (id: string, data: UpdateEducationRequest) => {
    const response = await fetch(`/api/profile/education/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update education');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? result.data : edu
      ),
    } : null);
    return result.data;
  };

  const deleteEducation = async (id: string) => {
    const response = await fetch(`/api/profile/education/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete education');
    }

    setProfile(prev => prev ? {
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    } : null);
  };

  // Skills operations
  const addSkill = async (data: CreateTechnicalSkillRequest) => {
    const response = await fetch('/api/profile/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add skill');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      technicalSkills: [...prev.technicalSkills, result.data],
    } : null);
    return result.data;
  };

  const updateSkill = async (id: string, data: UpdateTechnicalSkillRequest) => {
    const response = await fetch(`/api/profile/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update skill');
    }

    const result = await response.json();
    setProfile(prev => prev ? {
      ...prev,
      technicalSkills: prev.technicalSkills.map(skill =>
        skill.id === id ? result.data : skill
      ),
    } : null);
    return result.data;
  };

  const deleteSkill = async (id: string) => {
    const response = await fetch(`/api/profile/skills/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete skill');
    }

    setProfile(prev => prev ? {
      ...prev,
      technicalSkills: prev.technicalSkills.filter(skill => skill.id !== id),
    } : null);
  };

  return {
    profile,
    loading,
    error,
    refresh: loadProfile,
    // Work Experience
    addExperience,
    updateExperience,
    deleteExperience,
    // Education
    addEducation,
    updateEducation,
    deleteEducation,
    // Skills
    addSkill,
    updateSkill,
    deleteSkill,
  };
}

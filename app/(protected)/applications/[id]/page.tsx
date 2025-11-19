'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { FrontendApplication, ApplicationStatus } from '@/types/frontend.types';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { EditApplicationModal } from '@/components/features/applications/EditApplicationModal';
import { useToastContext } from '@/contexts/ToastContext';
import { 
  MapPinIcon, 
  CalendarIcon, 
  BuildingOfficeIcon, 
  ArrowPathIcon 
} from '@/components/ui/Icon';

interface ApplicationDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicationDetailsPage({ params }: ApplicationDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { showSuccess, showError } = useToastContext();
  
  const [application, setApplication] = useState<FrontendApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch application data
  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getApplication(id);
      setApplication(data);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to load application');
      // Redirect to applications list if not found
      setTimeout(() => router.push('/applications'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/applications');
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateApplication = async (updatedApp: FrontendApplication) => {
    try {
      const updated = await apiClient.updateApplication(id, {
        position: updatedApp.position,
        company: updatedApp.company,
        location: updatedApp.location,
        url: updatedApp.url,
        status: updatedApp.status,
        description: updatedApp.description,
        notes: updatedApp.notes,
        skills: updatedApp.skills,
        softSkills: updatedApp.softSkills,
        jobType: updatedApp.jobType,
        tags: updatedApp.tags,
      });
      
      setApplication(updated);
      setIsEditModalOpen(false);
      showSuccess('Application updated successfully!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update application');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiClient.deleteApplication(id);
      showSuccess('Application deleted successfully!');
      router.push('/applications');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to delete application');
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    try {
      const updated = await apiClient.updateApplication(id, {
        status: newStatus,
      });
      
      setApplication(updated);
      showSuccess('Status updated successfully!');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-gray">Loading application...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-bg-light dark:bg-neutral-bg-dark">
        <div className="text-center">
          <p className="text-neutral-gray text-lg mb-4">Application not found</p>
          <Button onClick={handleBack} variant="primary">
            Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-bg-light dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="flex items-center text-neutral-gray hover:text-primary-blue mb-6 transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2 rotate-180" />
            Back to Applications
          </button>

          {/* Header Section */}
          <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-4 sm:p-6 lg:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-3 break-words">
                  {application.position}
                </h1>
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 text-neutral-gray mb-4">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-base sm:text-lg break-words">{application.company}</span>
                  </div>
                  {application.location && (
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base break-words">{application.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      Applied on {new Date(application.dateApplied).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                <StatusBadge status={application.status} />
              </div>
              
              <div className="flex gap-3 flex-shrink-0">
                <Button onClick={handleEdit} variant="secondary" size="medium">
                  Edit
                </Button>
                <Button 
                  onClick={handleDelete} 
                  variant="danger" 
                  size="medium"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>

            {/* Status Change Dropdown */}
            <div className="pt-6 border-t border-neutral-border-light dark:border-neutral-border-dark">
              <label className="block text-sm font-medium text-neutral-gray mb-2">
                Update Status
              </label>
              <select 
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                className="w-full sm:w-auto px-4 py-2 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg focus:ring-primary-blue focus:border-primary-blue bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
              >
                {Object.values(ApplicationStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Type */}
          {application.jobType && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Job Type
              </h2>
              <span className="px-3 py-1.5 text-sm font-medium bg-primary-light text-primary-dark rounded-lg">
                {application.jobType}
              </span>
            </div>
          )}

          {/* Job Description */}
          {application.description && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Job Description
              </h2>
              <p className="text-neutral-gray whitespace-pre-line leading-relaxed">
                {application.description}
              </p>
            </div>
          )}

          {/* Job URL */}
          {application.url && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Job Posting URL
              </h2>
              <a 
                href={application.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-blue hover:underline break-all"
              >
                {application.url}
              </a>
            </div>
          )}

          {/* Skills / Tech Stack */}
          {application.skills && application.skills.length > 0 && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Required Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill, index) => (
                  <span 
                    key={`${skill}-${index}`}
                    className="px-3 py-1.5 text-sm font-medium bg-primary-light text-primary-dark rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {application.softSkills && application.softSkills.length > 0 && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Soft Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {application.softSkills.map((skill, index) => (
                  <span 
                    key={`${skill}-${index}`}
                    className="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-800 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {application.tags.map((tag, index) => (
                  <span 
                    key={`${tag}-${index}`}
                    className="px-3 py-1.5 text-sm font-medium bg-purple-100 text-purple-800 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {(application.cvPath || application.coverLetterPath) && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Documents
              </h2>
              <div className="space-y-2">
                {application.cvPath && (
                  <div className="flex items-center justify-between p-3 bg-neutral-bg-light dark:bg-neutral-bg-dark rounded-lg">
                    <span className="text-neutral-gray">CV / Resume</span>
                    <a 
                      href={application.cvPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-blue hover:underline text-sm"
                    >
                      View Document
                    </a>
                  </div>
                )}
                {application.coverLetterPath && (
                  <div className="flex items-center justify-between p-3 bg-neutral-bg-light dark:bg-neutral-bg-dark rounded-lg">
                    <span className="text-neutral-gray">Cover Letter</span>
                    <a 
                      href={application.coverLetterPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-blue hover:underline text-sm"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark p-6">
              <h2 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-4">
                Notes
              </h2>
              <p className="text-neutral-gray whitespace-pre-line leading-relaxed">
                {application.notes}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      <EditApplicationModal
        isOpen={isEditModalOpen}
        application={application}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateApplication={handleUpdateApplication}
      />
    </div>
  );
}

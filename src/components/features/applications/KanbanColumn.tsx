'use client';

import React from 'react';
import { FrontendApplication, ApplicationStatus } from '@/types/frontend.types';
import { ApplicationCard } from '@/components/features/applications/ApplicationCard';
import { EmptyState } from '@/components/features/applications/EmptyState';
import { STATUS_DETAILS } from '@/lib/constants';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: FrontendApplication[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  status, 
  applications, 
  onDelete, 
  onEdit, 
  onStatusChange 
}) => {
  const details = STATUS_DETAILS[status] || STATUS_DETAILS[ApplicationStatus.WITHDRAWN];
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const applicationData = e.dataTransfer.getData('application/json');
      if (applicationData && onStatusChange) {
        const application: FrontendApplication = JSON.parse(applicationData);
        // Only update if the status is different
        if (application.status !== status) {
          onStatusChange(application.id, status);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  return (
    <div className="w-80 min-w-[320px] flex-shrink-0">
      <div className={`flex items-center justify-between p-3 rounded-t-lg border-b-4 ${details.border} bg-neutral-surface-light dark:bg-neutral-surface-dark`}>
        <div className="flex items-center gap-2">
          <h2 className={`font-semibold ${details.color}`}>{status}</h2>
          <span className="text-sm font-medium bg-neutral-border-light text-neutral-gray px-2 py-0.5 rounded-full dark:bg-neutral-border-dark dark:text-neutral-text-secondary-dark">
            {applications.length}
          </span>
        </div>
      </div>
      <div 
        className={`p-1 bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-[400px] rounded-b-lg transition-colors ${
          isDragOver ? 'bg-primary-light/20 ring-2 ring-primary-blue ring-inset' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {applications.length > 0 ? (
          applications.map(app => (
            <ApplicationCard 
              key={app.id} 
              application={app} 
              onDelete={onDelete} 
              onEdit={onEdit} 
            />
          ))
        ) : (
          <EmptyState type="column-empty" />
        )}
      </div>
    </div>
  );
};

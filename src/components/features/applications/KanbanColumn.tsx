'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-80 min-w-[320px] flex-shrink-0"
    >
      <div className={`flex items-center justify-between p-4 rounded-t-3xl bg-transparent ${details.border.replace('border-b-4', 'border-b-2')}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${details.color.replace('text-', 'bg-')}`} />
          <h2 className="font-bold text-neutral-800 dark:text-white tracking-tight text-lg">{status}</h2>
          <span className="text-xs font-bold bg-white dark:bg-neutral-800 text-neutral-500 px-2.5 py-1 rounded-full shadow-sm">
            {applications.length}
          </span>
        </div>
      </div>
      <div
        className={`p-3 min-h-[400px] rounded-b-3xl transition-colors duration-300 ${isDragOver ? 'bg-primary-blue/5 rounded-3xl' : 'bg-transparent'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode='popLayout'>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState type="column-empty" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FrontendApplication } from '@/types/frontend.types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  MapPinIcon, 
  CalendarIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@/components/ui/Icon';

interface ListViewProps {
  applications: FrontendApplication[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ applications, onDelete, onEdit }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-lg overflow-hidden">
      {/* Header - Hidden on mobile, shown on larger screens */}
      <div className="hidden lg:grid bg-gray-50 dark:bg-neutral-border-dark/40 border-b border-neutral-border-light dark:border-neutral-border-dark px-6 py-3 grid-cols-12 gap-4 text-xs font-semibold text-neutral-gray dark:text-neutral-text-secondary-dark uppercase tracking-wide">
        <div className="col-span-3">Position & Company</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Skills</div>
        <div className="col-span-2">Date Applied</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
        {applications.map((app) => (
          <div
            key={app.id}
            className="px-4 sm:px-6 py-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start lg:items-center hover:bg-gray-50 dark:hover:bg-neutral-border-dark transition-colors cursor-pointer group"
            onClick={() => router.push(`/applications/${app.id}`)}
          >
            {/* Position & Company */}
            <div className="lg:col-span-3">
              <h4 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark text-sm mb-0.5 break-words">
                {app.position}
              </h4>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark break-words">{app.company}</p>
            </div>

            {/* Location */}
            <div className="lg:col-span-2 flex items-center text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
              <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{app.location}</span>
            </div>

            {/* Status */}
            <div className="lg:col-span-2">
              <StatusBadge status={app.status} />
            </div>

            {/* Skills */}
            <div className="lg:col-span-2">
              {app.skills && app.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {app.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs font-medium bg-primary-light text-primary-dark rounded truncate"
                    >
                      {skill}
                    </span>
                  ))}
                  {app.skills.length > 2 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-border-light dark:bg-neutral-border-dark text-neutral-gray dark:text-neutral-text-secondary-dark rounded">
                      +{app.skills.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">—</span>
              )}
            </div>

            {/* Date Applied */}
            <div className="lg:col-span-2 flex items-center text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
              <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span>{formatDate(app.dateApplied)}</span>
            </div>

            {/* Actions */}
            <div className="lg:col-span-1 flex items-center justify-start lg:justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/applications/${app.id}`);
                }}
                className="p-1.5 hover:bg-primary-light dark:hover:bg-primary-light/20 rounded transition-colors"
                title="View Details"
              >
                <EyeIcon className="w-4 h-4 text-neutral-gray hover:text-primary-blue" />
              </button>
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(app.id);
                  }}
                className="p-1.5 hover:bg-primary-light dark:hover:bg-primary-light/20 rounded transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="w-4 h-4 text-neutral-gray hover:text-primary-blue" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(app.id);
                  }}
                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4 text-neutral-gray hover:text-red-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

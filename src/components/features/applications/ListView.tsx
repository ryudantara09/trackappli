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
  TrashIcon,
  BriefcaseIcon,
  BanknotesIcon,
  LinkIcon
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
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Details</div>
        <div className="col-span-2">Skills</div>
        <div className="col-span-1">Date Applied</div>
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
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark text-sm mb-0.5 break-words">
                  {app.position}
                </h4>
                {app.url && (
                  <a 
                    href={app.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-gray hover:text-primary-main transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    title="View Job Posting"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <p className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark break-words">{app.company}</p>
            </div>

            {/* Location */}
            <div className="lg:col-span-2 flex items-center text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
              <MapPinIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">{app.location}</span>
            </div>

            {/* Status */}
            <div className="lg:col-span-1">
              <StatusBadge status={app.status} />
            </div>

            {/* Details (Job Type & Salary) */}
            <div className="lg:col-span-2 flex flex-col gap-1">
              {app.jobType && (
                <div className="flex items-center text-xs text-neutral-gray dark:text-neutral-text-secondary-dark">
                  <BriefcaseIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{app.jobType}</span>
                </div>
              )}
              {app.salary && (
                <div className="flex items-center text-xs text-neutral-gray dark:text-neutral-text-secondary-dark">
                  <BanknotesIcon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{app.salary}</span>
                </div>
              )}
              {!app.jobType && !app.salary && (
                 <span className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">—</span>
              )}
            </div>

            {/* Skills */}
            <div className="lg:col-span-2 flex flex-col gap-1">
              {/* Technical Skills */}
              {app.skills && app.skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {app.skills.slice(0, 2).map((skill) => (
                    <span
                      key={`tech-${skill}`}
                      className="px-2 py-0.5 text-xs font-medium bg-primary-light text-primary-dark rounded truncate"
                      title="Technical Skill"
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
              )}
              
              {/* Soft Skills */}
              {app.softSkills && app.softSkills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {app.softSkills.slice(0, 2).map((skill) => (
                    <span
                      key={`soft-${skill}`}
                      className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded truncate"
                      title="Soft Skill"
                    >
                      {skill}
                    </span>
                  ))}
                  {app.softSkills.length > 2 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-neutral-border-light dark:bg-neutral-border-dark text-neutral-gray dark:text-neutral-text-secondary-dark rounded">
                      +{app.softSkills.length - 2}
                    </span>
                  )}
                </div>
              )}

              {(!app.skills?.length && !app.softSkills?.length) && (
                <span className="text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">—</span>
              )}
            </div>

            {/* Date Applied */}
            <div className="lg:col-span-1 flex items-center text-sm text-neutral-gray dark:text-neutral-text-secondary-dark">
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

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FrontendApplication, ApplicationStatus } from '@/types/frontend.types';
import { 
  MapPinIcon, 
  EllipsisVerticalIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon 
} from '@/components/ui/Icon';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface ApplicationCardProps {
  application: FrontendApplication;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isDragging?: boolean;
}

const CompanyLogo: React.FC<{ company: string }> = ({ company }) => {
  const initial = company ? company.charAt(0).toUpperCase() : '?';
  
  // Simple hashing function to get a color based on company name
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  
  const intToRGB = (i: number) => {
    const c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
  };
  
  const bgColor = `#${intToRGB(hashCode(company))}`;

  return (
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
      style={{ backgroundColor: bgColor, opacity: 0.8 }}
    >
      {initial}
    </div>
  );
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onDelete, 
  onEdit, 
  isDragging = false 
}) => {
  const { position, company, location, skills, id, dateApplied, status } = application;
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    router.push(`/applications/${id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    setShowMenu(false);
    action();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(application));
    e.dataTransfer.setData('text/plain', id);
    
    // Add a semi-transparent copy of the card as the drag image
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };
  
  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      className={`relative bg-neutral-surface-light border border-neutral-border-light rounded-xl p-4 transition-all hover:shadow-md hover:border-primary-blue/50 cursor-move mb-4 group ${isDragging ? 'opacity-50' : ''}`}
    >
      {/* Quick Actions Menu */}
      <div className="absolute top-3 right-3">
        <button
          onClick={handleMenuClick}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-border-light transition-opacity"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-neutral-gray" />
        </button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div className="absolute right-0 mt-1 w-48 bg-white border border-neutral-border-light rounded-lg shadow-lg z-20 overflow-hidden">
              <button
                onClick={(e) => handleAction(e, handleCardClick)}
                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
              >
                <EyeIcon className="w-4 h-4 text-neutral-gray" />
                <span>View Details</span>
              </button>
              {onEdit && (
                <button
                  onClick={(e) => handleAction(e, () => onEdit(id))}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm border-t border-neutral-border-light"
                >
                  <PencilIcon className="w-4 h-4 text-neutral-gray" />
                  <span>Quick Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => handleAction(e, () => onDelete(id))}
                  className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 border-t border-neutral-border-light"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex items-start gap-4">
        <CompanyLogo company={company} />
        <div className="flex-grow pr-8">
          <h3 className="font-bold text-neutral-text-primary-light leading-tight">{position}</h3>
          <p className="text-sm text-neutral-gray mt-1">{company}</p>
          <div className="flex items-center gap-3 mt-2">
            <p className="flex items-center text-xs text-neutral-gray">
              <MapPinIcon className="w-3 h-3 mr-1.5 text-neutral-gray/80" />
              <span>{location}</span>
            </p>
            {dateApplied && (
              <p className="flex items-center text-xs text-neutral-gray">
                <CalendarIcon className="w-3 h-3 mr-1.5 text-neutral-gray/80" />
                <span>{formatDate(dateApplied)}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {skills && skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 text-xs font-medium bg-primary-light text-primary-dark rounded">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-neutral-border-light text-neutral-gray rounded">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

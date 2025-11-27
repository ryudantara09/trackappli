'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FrontendApplication } from '@/types/frontend.types';
import {
  MapPinIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon
} from '@/components/ui/Icon';

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
      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm"
      style={{ backgroundColor: bgColor, opacity: 0.9 }}
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
  const { position, company, location, skills, id, dateApplied } = application;
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
      draggable
      onDragStart={(e: any) => handleDragStart(e)}
      onDragEnd={(e: any) => handleDragEnd(e)}
      onClick={handleCardClick}
      className={`relative bg-white dark:bg-neutral-surface-dark rounded-2xl p-4 cursor-move mb-4 group transition-all duration-200 ${isDragging
          ? 'opacity-50 ring-2 ring-primary-blue shadow-none'
          : 'shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:-translate-y-1'
        }`}
    >
      {/* Quick Actions Menu */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={handleMenuClick}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
        >
          <EllipsisVerticalIcon className="w-5 h-5 text-neutral-gray" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 overflow-hidden backdrop-blur-xl"
              >
                <button
                  onClick={(e) => handleAction(e, handleCardClick)}
                  className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 text-sm transition-colors"
                >
                  <EyeIcon className="w-4 h-4 text-neutral-gray" />
                  <span>View Details</span>
                </button>
                {onEdit && (
                  <button
                    onClick={(e) => handleAction(e, () => onEdit(id))}
                    className="w-full px-4 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 text-sm border-t border-neutral-100 dark:border-neutral-800 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 text-neutral-gray" />
                    <span>Quick Edit</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => handleAction(e, () => onDelete(id))}
                    className="w-full px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-sm text-red-600 border-t border-neutral-100 dark:border-neutral-800 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-start gap-4">
        <CompanyLogo company={company} />
        <div className="flex-grow pr-8">
          <h3 className="font-bold text-neutral-900 dark:text-white leading-tight text-lg">{position}</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">{company}</p>
          <div className="flex items-center gap-3 mt-3">
            <p className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/50 px-2 py-1 rounded-md">
              <MapPinIcon className="w-3 h-3 mr-1.5 opacity-70" />
              <span>{location}</span>
            </p>
            {dateApplied && (
              <p className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/50 px-2 py-1 rounded-md">
                <CalendarIcon className="w-3 h-3 mr-1.5 opacity-70" />
                <span>{formatDate(dateApplied)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {skills && skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2.5 py-1 text-xs font-medium bg-primary-blue/10 text-primary-blue rounded-full border border-primary-blue/10">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-full">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

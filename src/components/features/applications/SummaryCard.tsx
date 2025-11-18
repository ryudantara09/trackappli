'use client';

import React from 'react';
import { ApplicationStatus } from '@/types/frontend.types';
import { STATUS_DETAILS } from '@/lib/constants';
import { 
  BriefcaseIcon, 
  NoSymbolIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon 
} from '@/components/ui/Icon';

interface SummaryCardProps {
  title: string;
  value: number;
  status?: ApplicationStatus;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
  isActive?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  title, 
  value, 
  status, 
  trend, 
  onClick, 
  isActive = false 
}) => {
  const isTotalCard = !status;
  const details = status ? (STATUS_DETAILS[status] || STATUS_DETAILS[ApplicationStatus.WITHDRAWN]) : null;
  
  const Icon = isTotalCard ? BriefcaseIcon : (details ? details.icon : NoSymbolIcon);
  const colorClass = isTotalCard ? 'text-primary-blue' : (details ? details.color : 'text-status-withdrawn');
  
  // Create a background color with 10% opacity from the text color class.
  // e.g., 'text-primary-blue' becomes 'bg-primary-blue/10'
  const bgClass = colorClass.replace('text-', 'bg-') + '/10';
  
  // For the 'Total Applications' card, we need to ensure Tailwind recognizes the bg-primary-blue/10 class.
  // The primary color is a hex value, so we can't directly use a JIT-generated class like that.
  // Instead, we use a known safe class from the config.
  const finalBgClass = isTotalCard ? 'bg-primary-light' : bgClass;
  const finalColorClass = isTotalCard ? 'text-primary-dark' : colorClass;

  return (
    <div 
      className={`bg-neutral-surface-light p-3 sm:p-4 lg:p-5 rounded-xl border transition-all ${
        onClick 
          ? isActive 
            ? 'border-primary-blue ring-2 ring-primary-blue shadow-md cursor-pointer' 
            : 'border-neutral-border-light hover:shadow-md hover:border-primary-blue/50 cursor-pointer'
          : 'border-neutral-border-light hover:shadow-md'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${finalBgClass}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${finalColorClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-neutral-text-primary-light">{value}</p>
            {trend && (
              <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.direction === 'up' ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
                <span className="hidden sm:inline">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-gray truncate">{title}</p>
        </div>
      </div>
    </div>
  );
};

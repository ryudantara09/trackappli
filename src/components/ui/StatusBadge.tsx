import React from 'react';
import { ApplicationStatus } from '@/types/frontend.types';

// Status styles mapping
const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  [ApplicationStatus.APPLIED]: {
    bg: 'bg-status-applied/10',
    text: 'text-status-applied',
    dot: 'bg-status-applied',
  },
  [ApplicationStatus.INTERVIEW]: {
    bg: 'bg-status-interview/10',
    text: 'text-status-interview',
    dot: 'bg-status-interview',
  },
  [ApplicationStatus.OFFER]: {
    bg: 'bg-status-offer/10',
    text: 'text-status-offer',
    dot: 'bg-status-offer',
  },
  [ApplicationStatus.REJECTED]: {
    bg: 'bg-status-rejected/10',
    text: 'text-status-rejected',
    dot: 'bg-status-rejected',
  },
  [ApplicationStatus.WITHDRAWN]: {
    bg: 'bg-status-withdrawn/10',
    text: 'text-status-withdrawn',
    dot: 'bg-status-withdrawn',
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES[ApplicationStatus.WITHDRAWN];
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}
    >
      <span className={`w-2 h-2 mr-2 rounded-full ${styles.dot}`}></span>
      {status}
    </span>
  );
};

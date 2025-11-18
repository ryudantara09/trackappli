import { ApplicationStatus } from '@/types/frontend.types';
import { 
  BriefcaseIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentCheckIcon, 
  NoSymbolIcon 
} from '@/components/ui/Icon';
import React from 'react';

export const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
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

export const STATUS_DETAILS: Record<ApplicationStatus, { 
  icon: React.FC<React.SVGProps<SVGSVGElement>>; 
  color: string; 
  border: string; 
}> = {
  [ApplicationStatus.APPLIED]: {
    icon: BriefcaseIcon,
    color: 'text-status-applied',
    border: 'border-status-applied',
  },
  [ApplicationStatus.INTERVIEW]: {
    icon: ChatBubbleLeftRightIcon,
    color: 'text-status-interview',
    border: 'border-status-interview',
  },
  [ApplicationStatus.OFFER]: {
    icon: DocumentCheckIcon,
    color: 'text-status-offer',
    border: 'border-status-offer',
  },
  [ApplicationStatus.REJECTED]: {
    icon: NoSymbolIcon,
    color: 'text-status-rejected',
    border: 'border-status-rejected',
  },
  [ApplicationStatus.WITHDRAWN]: {
    icon: NoSymbolIcon,
    color: 'text-status-withdrawn',
    border: 'border-status-withdrawn',
  },
};

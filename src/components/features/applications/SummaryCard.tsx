'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { ApplicationStatus } from '@/types/frontend.types';

interface SummaryCardProps {
  title: string;
  value: number;
  status?: ApplicationStatus;
  onClick?: () => void;
  isActive?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, status, onClick, isActive }) => {
  const isTotal = title === 'Total Applications';

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-300 ${isActive
          ? 'bg-primary-blue text-white shadow-xl shadow-primary-blue/20'
          : 'bg-white dark:bg-neutral-surface-dark shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
        }`}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-primary-blue/5 text-primary-blue'
          }`}>
          {isTotal ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-current" />
          )}
        </div>

        <div>
          <p className={`text-sm font-medium mb-0.5 ${isActive ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'
            }`}>
            {title}
          </p>
          <h3 className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-neutral-900 dark:text-white'
            }`}>
            <CountUp end={value} duration={1.5} />
          </h3>
        </div>
      </div>

      {/* Soft decorative glow */}
      <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-2xl opacity-20 ${isActive ? 'bg-white' : 'bg-primary-blue'
        }`} />
    </motion.div>
  );
};

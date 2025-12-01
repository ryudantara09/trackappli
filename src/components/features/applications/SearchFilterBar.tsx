'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@/components/ui/Icon';
import { ApplicationStatus } from '@/types/frontend.types';

export type SortOption = 'date-desc' | 'date-asc' | 'company-asc' | 'position-asc';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: ApplicationStatus | 'all';
  onStatusChange: (status: ApplicationStatus | 'all') => void;
  viewMode: 'kanban' | 'list';
  onViewModeChange: (mode: 'kanban' | 'list') => void;
  dateRange: 'all' | '7days' | '30days' | '90days';
  onDateRangeChange: (range: 'all' | '7days' | '30days' | '90days') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = selectedStatus !== 'all' || dateRange !== 'all';

  return (
    <div className="mb-8">
      {/* Search and View Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-4">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-0 group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-primary-blue transition-colors" />
          <input
            type="text"
            placeholder="Search by position, company, or skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 border-none rounded-full bg-white dark:bg-neutral-800 shadow-[0_2px_8px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-primary-blue/20 transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-3 flex-shrink-0">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-4 py-3 border-none rounded-full bg-white dark:bg-neutral-800 shadow-[0_2px_8px_rgb(0,0,0,0.04)] text-neutral-600 dark:text-neutral-300 hover:text-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/20 appearance-none cursor-pointer pr-10 bg-no-repeat bg-right transition-all"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5' /%3E%3C/svg%3E")`,
                backgroundSize: '1.25rem',
                backgroundPosition: 'right 0.75rem center'
              }}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="company-asc">Company A-Z</option>
              <option value="position-asc">Position A-Z</option>
            </select>
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-full flex items-center gap-2 transition-all whitespace-nowrap shadow-[0_2px_8px_rgb(0,0,0,0.04)] ${hasActiveFilters
              ? 'bg-primary-blue text-white shadow-primary-blue/20'
              : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-primary-blue'
              }`}
          >
            <FunnelIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden xs:inline">Filters</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-white text-primary-blue text-xs font-bold rounded-full">
                {(selectedStatus !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-white dark:bg-neutral-800 rounded-full shadow-[0_2px_8px_rgb(0,0,0,0.04)] p-1 gap-1">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`px-3 py-2 flex items-center gap-2 rounded-full transition-all ${viewMode === 'kanban'
                ? 'bg-primary-blue text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              title="Kanban View"
            >
              <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium hidden md:inline">Kanban</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 flex items-center gap-2 rounded-full transition-all ${viewMode === 'list'
                ? 'bg-primary-blue text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              title="List View"
            >
              <ListBulletIcon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium hidden md:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="bg-white dark:bg-neutral-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 overflow-hidden mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | 'all')}
                  className="w-full px-4 py-2.5 border-none rounded-xl bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 text-neutral-900 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value={ApplicationStatus.APPLIED}>Applied</option>
                  <option value={ApplicationStatus.INTERVIEW}>Interview</option>
                  <option value={ApplicationStatus.OFFER}>Offer</option>
                  <option value={ApplicationStatus.REJECTED}>Rejected</option>
                  <option value={ApplicationStatus.WITHDRAWN}>Withdrawn</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => onDateRangeChange(e.target.value as any)}
                  className="w-full px-4 py-2.5 border-none rounded-xl bg-neutral-50 dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 text-neutral-900 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                <button
                  onClick={() => {
                    onStatusChange('all');
                    onDateRangeChange('all');
                  }}
                  className="text-sm text-primary-blue hover:text-primary-light font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

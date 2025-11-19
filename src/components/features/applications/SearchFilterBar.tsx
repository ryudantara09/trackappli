'use client';

import React, { useState } from 'react';
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
    <div className="mb-6">
      {/* Search and View Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-3">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-0">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by position, company, or skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-shadow bg-white dark:bg-neutral-surface-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark placeholder:text-neutral-gray"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-3 flex-shrink-0">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2.5 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg text-neutral-gray dark:text-neutral-text-primary-dark hover:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue appearance-none bg-white dark:bg-neutral-surface-dark cursor-pointer pr-8 bg-no-repeat bg-right"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5' /%3E%3C/svg%3E")`,
              backgroundSize: '1.25rem',
              backgroundPosition: 'right 0.5rem center'
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="company-asc">Company A-Z</option>
            <option value="position-asc">Position A-Z</option>
          </select>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 sm:px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${
              hasActiveFilters
                ? 'bg-primary-blue text-white border-primary-blue'
                : 'border-neutral-border-light dark:border-neutral-border-dark text-neutral-gray dark:text-neutral-text-secondary-dark hover:border-primary-blue hover:text-primary-blue'
            }`}
          >
            <FunnelIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden xs:inline">Filters</span>
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-white dark:bg-neutral-surface-dark text-primary-blue dark:text-primary-light text-xs font-bold rounded-full">
                {(selectedStatus !== 'all' ? 1 : 0) + (dateRange !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-neutral-border-light dark:border-neutral-border-dark rounded-lg overflow-hidden flex-shrink-0">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`px-2 sm:px-3 py-2.5 flex items-center gap-1 sm:gap-2 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white dark:bg-neutral-surface-dark text-neutral-gray dark:text-neutral-text-secondary-dark hover:bg-gray-50 dark:hover:bg-neutral-border-dark'
              }`}
              title="Kanban View"
            >
              <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium hidden md:inline">Kanban</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-2 sm:px-3 py-2.5 flex items-center gap-1 sm:gap-2 border-l border-neutral-border-light dark:border-neutral-border-dark transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white dark:bg-neutral-surface-dark text-neutral-gray dark:text-neutral-text-secondary-dark hover:bg-gray-50 dark:hover:bg-neutral-border-dark'
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
      {showFilters && (
        <div className="bg-neutral-surface-light dark:bg-neutral-surface-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-lg p-4 space-y-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | 'all')}
                className="w-full px-3 py-2 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
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
              <label className="block text-sm font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-neutral-border-light dark:border-neutral-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white dark:bg-neutral-bg-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
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
            <div className="flex justify-end">
              <button
                onClick={() => {
                  onStatusChange('all');
                  onDateRangeChange('all');
                }}
                className="text-sm text-primary-blue hover:text-primary-dark font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
      `}</style>
    </div>
  );
};

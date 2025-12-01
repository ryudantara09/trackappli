'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/ui/PageHeader';
import { KanbanColumn } from '@/components/features/applications/KanbanColumn';
import { ListView } from '@/components/features/applications/ListView';
import { AddApplicationModal } from '@/components/features/applications/AddApplicationModal';
import { EditApplicationModal } from '@/components/features/applications/EditApplicationModal';
import { SearchFilterBar, SortOption } from '@/components/features/applications/SearchFilterBar';
import { EmptyState } from '@/components/features/applications/EmptyState';
import { useApplications } from '@/hooks/useApplications';
import { useToastContext } from '@/contexts/ToastContext';
import { FrontendApplication, ApplicationStatus, ApplicationFormData } from '@/types/frontend.types';

// Pagination constants
const ITEMS_PER_PAGE = 20;

const ApplicationsPage: React.FC = () => {
  // Search and filter state for API
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');

  // Fetch applications from API with filters
  const {
    applications,
    loading,
    error,
    addApplication,
    updateApplication,
    deleteApplication,
    refresh
  } = useApplications({
    q: searchQuery,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  });

  // Toast notifications
  const { showSuccess, showError } = useToastContext();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<FrontendApplication | null>(null);

  // Undo delete state
  const [deletedApplication, setDeletedApplication] = useState<FrontendApplication | null>(null);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Local filter state (not sent to API)
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddApplication = useCallback(async (newApplication: ApplicationFormData) => {
    try {
      await addApplication(newApplication);
      setIsModalOpen(false);
      showSuccess('Application added successfully!');
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      showError('Failed to add application. Please try again.');
      console.error('Error adding application:', err);
    }
  }, [addApplication, showSuccess, showError]);

  const handleDeleteApplication = useCallback(async (id: string) => {
    const appToDelete = applications.find(app => app.id === id);
    if (!appToDelete) return;

    // Clear any existing undo timer
    if (undoTimer) {
      clearTimeout(undoTimer);
    }

    // Store for potential undo
    setDeletedApplication(appToDelete);

    // Set up undo timer
    const timer = setTimeout(async () => {
      try {
        // Actually delete from backend after undo window
        await deleteApplication(id);
        setDeletedApplication(null);
        showSuccess('Application permanently deleted');
      } catch (err) {
        showError('Failed to delete application');
        console.error('Error deleting application:', err);
      }
    }, 5000);

    setUndoTimer(timer);
    showSuccess('Application deleted');
  }, [applications, undoTimer, deleteApplication, showSuccess, showError]);

  const handleUndoDelete = useCallback(() => {
    if (deletedApplication) {
      // Clear the timer
      if (undoTimer) {
        clearTimeout(undoTimer);
        setUndoTimer(null);
      }

      // Restore is automatic since we didn't actually delete yet
      setDeletedApplication(null);
      showSuccess('Application restored!');
    }
  }, [deletedApplication, undoTimer, showSuccess]);

  const handleEditApplication = useCallback((id: string) => {
    const app = applications.find(a => a.id === id);
    if (app) {
      setEditingApplication(app);
      setIsEditModalOpen(true);
    }
  }, [applications]);

  const handleUpdateApplication = useCallback(async (updatedApp: FrontendApplication) => {
    try {
      await updateApplication(updatedApp.id, {
        position: updatedApp.position,
        company: updatedApp.company,
        location: updatedApp.location,
        status: updatedApp.status,
        url: updatedApp.url,
        description: updatedApp.description,
        notes: updatedApp.notes,
        skills: updatedApp.skills,
      });
      setIsEditModalOpen(false);
      setEditingApplication(null);
      showSuccess('Application updated successfully!');
    } catch (err) {
      showError('Failed to update application. Please try again.');
      console.error('Error updating application:', err);
    }
  }, [updateApplication, showSuccess, showError]);

  const handleStatusChange = useCallback(async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplication(applicationId, { status: newStatus });
      showSuccess(`Application status updated to ${newStatus}!`);
    } catch (err) {
      showError('Failed to update status. Please try again.');
      console.error('Error updating status:', err);
    }
  }, [updateApplication, showSuccess, showError]);

  const handleExport = async () => {
    if (filteredApplications.length === 0) {
      showError('No applications to export');
      return;
    }

    try {
      // Call the export API endpoint
      const response = await fetch('/api/export');

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the CSV blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showSuccess(`Exported ${filteredApplications.length} applications successfully!`);
    } catch (err) {
      showError('Failed to export applications');
      console.error('Error exporting:', err);
    }
  };

  // Client-side filtering and sorting
  const filteredApplications = useMemo(() => {
    // Filter out deleted application during undo window
    let filtered = deletedApplication
      ? applications.filter(app => app.id !== deletedApplication.id)
      : applications;

    // Date range filter (client-side)
    if (dateRange !== 'all') {
      const now = new Date();
      const daysAgo = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(app => {
        const appDate = new Date(app.dateApplied);
        return appDate >= cutoffDate;
      });
    }

    // Sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime());
        break;
      case 'company-asc':
        sorted.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'position-asc':
        sorted.sort((a, b) => a.position.localeCompare(b.position));
        break;
    }

    return sorted;
  }, [applications, deletedApplication, dateRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredApplications.slice(startIndex, endIndex);
  }, [filteredApplications, currentPage]);

  const kanbanColumns = useMemo(() => {
    // For kanban view, show all filtered applications (no pagination)
    return Object.values(ApplicationStatus).map(status => ({
      status,
      apps: filteredApplications.filter(app => app.status === status)
    }));
  }, [filteredApplications]);

  const hasApplications = applications.length > 0;
  const hasFilteredResults = filteredApplications.length > 0;
  const hasActiveFilters = searchQuery.trim() !== '' || selectedStatus !== 'all' || dateRange !== 'all';

  // Reset to page 1 when filters change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleStatusChange_Filter = useCallback((status: ApplicationStatus | 'all') => {
    setSelectedStatus(status);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((range: 'all' | '7days' | '30days' | '90days') => {
    setDateRange(range);
    setCurrentPage(1);
  }, []);

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header onAddApplicationClick={() => setIsModalOpen(true)} onExportClick={handleExport} />

        {/* Page Title Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* List Skeleton */}
        <div className="bg-white border border-neutral-border-light rounded-lg overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 border-b border-neutral-border-light">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header onAddApplicationClick={() => setIsModalOpen(true)} onExportClick={handleExport} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-neutral-text-primary-light mb-2">Failed to Load Applications</h3>
            <p className="text-neutral-gray mb-4">{error}</p>
            <button
              onClick={() => refresh()}
              className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" sm:px-6 lg:px-8 py-8 text-neutral-text-primary-light dark:text-neutral-text-primary-dark bg-neutral-bg-light dark:bg-neutral-bg-dark">
      <Header onAddApplicationClick={() => setIsModalOpen(true)} onExportClick={handleExport} />

      <PageHeader
        title="All Applications"
        description="Manage and track all your job applications"
      />

      {/* Application Counter */}
      {hasApplications && (
        <div className="mb-4 text-sm text-neutral-gray">
          {hasActiveFilters ? (
            <>
              Showing <span className="font-semibold text-neutral-text-primary-light">{filteredApplications.length}</span> of{' '}
              <span className="font-semibold text-neutral-text-primary-light">{applications.length}</span> applications
            </>
          ) : (
            <>
              Total: <span className="font-semibold text-neutral-text-primary-light">{applications.length}</span> applications
            </>
          )}
        </div>
      )}

      {/* Search and Filters */}
      {hasApplications && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange_Filter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      )}

      {/* Content Area */}
      {!hasApplications ? (
        <EmptyState type="no-applications" onAction={() => setIsModalOpen(true)} />
      ) : !hasFilteredResults ? (
        <EmptyState type="no-results" searchQuery={searchQuery} />
      ) : viewMode === 'kanban' ? (
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4">
          {kanbanColumns.map(({ status, apps }) => (
            <KanbanColumn
              key={status}
              status={status}
              applications={apps}
              onDelete={handleDeleteApplication}
              onEdit={handleEditApplication}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="pb-4">
            <ListView
              applications={paginatedApplications}
              onDelete={handleDeleteApplication}
              onEdit={handleEditApplication}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-border-light pt-4 pb-8">
              <div className="text-sm text-neutral-gray">Page {currentPage} of {totalPages}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-neutral-border-light rounded-lg text-sm font-medium text-neutral-gray hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="hidden sm:flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-primary-blue text-white' : 'text-neutral-gray hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-neutral-border-light rounded-lg text-sm font-medium text-neutral-gray hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AddApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddApplication={handleAddApplication}
      />

      <EditApplicationModal
        isOpen={isEditModalOpen}
        application={editingApplication}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApplication(null);
        }}
        onUpdateApplication={handleUpdateApplication}
      />
    </div>
  );
};

export default ApplicationsPage;


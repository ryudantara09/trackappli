'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { PageHeader } from '@/components/ui/PageHeader';
import { SummaryCard } from '@/components/features/applications/SummaryCard';
import { KanbanColumn } from '@/components/features/applications/KanbanColumn';
import { ListView } from '@/components/features/applications/ListView';
import { AddApplicationModal } from '@/components/features/applications/AddApplicationModal';
import { EditApplicationModal } from '@/components/features/applications/EditApplicationModal';
import { SearchFilterBar, SortOption } from '@/components/features/applications/SearchFilterBar';
import { EmptyState } from '@/components/features/applications/EmptyState';
import { ActivityChart } from '@/components/features/applications/ActivityChart';
import { useApplications } from '@/hooks/useApplications';
import { useToastContext } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/Button';
import { FrontendApplication, ApplicationStatus, ApplicationFormData } from '@/types/frontend.types';

const DashboardPage: React.FC = () => {
  // Fetch applications from API
  const { applications, loading, error, addApplication, updateApplication, deleteApplication, refresh } = useApplications();

  // Toast notifications
  const { showSuccess, showError } = useToastContext();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<FrontendApplication | null>(null);

  // Undo delete state
  const [deletedApplication, setDeletedApplication] = useState<FrontendApplication | null>(null);
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const handleAddApplication = useCallback(async (newApplication: ApplicationFormData) => {
    try {
      await addApplication(newApplication);
      setIsModalOpen(false);
      showSuccess('Application added successfully!');
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

  // Base filtered applications (without status filter) for stats
  const baseFilteredApplications = useMemo(() => {
    // Filter out deleted application during undo window
    let filtered = deletedApplication
      ? applications.filter(app => app.id !== deletedApplication.id)
      : applications;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.position.toLowerCase().includes(query) ||
        app.company.toLowerCase().includes(query) ||
        app.location?.toLowerCase().includes(query) ||
        app.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const daysAgo = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(app => {
        const appDate = new Date(app.dateApplied);
        return appDate >= cutoffDate;
      });
    }

    return filtered;
  }, [applications, deletedApplication, searchQuery, dateRange]);

  // Final filtered applications (with status filter and sorting)
  const filteredApplications = useMemo(() => {
    let filtered = baseFilteredApplications;

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(app => app.status === selectedStatus);
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
  }, [baseFilteredApplications, selectedStatus, sortBy]);

  const summaryStats = useMemo(() => {
    return Object.values(ApplicationStatus).map(status => ({
      status,
      count: baseFilteredApplications.filter(app => app.status === status).length
    }));
  }, [baseFilteredApplications]);

  const stats = useMemo(() => ({
    total: baseFilteredApplications.length,
    interview: summaryStats.find(s => s.status === ApplicationStatus.INTERVIEW)?.count || 0,
    offer: summaryStats.find(s => s.status === ApplicationStatus.OFFER)?.count || 0,
    rejected: summaryStats.find(s => s.status === ApplicationStatus.REJECTED)?.count || 0,
  }), [baseFilteredApplications.length, summaryStats]);

  const kanbanColumns = useMemo(() => {
    return Object.values(ApplicationStatus).map(status => ({
      status,
      apps: filteredApplications.filter(app => app.status === status)
    }));
  }, [filteredApplications]);

  const hasApplications = applications.length > 0;
  const hasFilteredResults = filteredApplications.length > 0;
  const hasActiveFilters = searchQuery.trim() !== '' || selectedStatus !== 'all' || dateRange !== 'all';

  const handleSummaryCardClick = useCallback((status?: ApplicationStatus) => {
    if (status) {
      setSelectedStatus(selectedStatus === status ? 'all' : status);
    }
  }, [selectedStatus]);

  // Loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Header onAddApplicationClick={() => setIsModalOpen(true)} onExportClick={handleExport} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="mt-4 text-neutral-gray">Loading applications...</p>
          </div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 sm:px-6 lg:px-8 py-8 text-neutral-text-primary-light dark:text-neutral-text-primary-dark bg-neutral-bg-light dark:bg-neutral-bg-dark min-h-screen"
    >
      <Header onAddApplicationClick={() => setIsModalOpen(true)} onExportClick={handleExport} />

      <PageHeader
        title="Dashboard"
        description="Overview of your job applications and progress"
      />

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-primary-blue to-brand-highlight rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-xl shadow-primary-blue/20"
      >
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-4 border border-white/10">
            PREMIUM DASHBOARD
          </span>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Manage Your Applications <br /> with <span className="text-blue-100">Confidence</span>
          </h1>
          <p className="text-blue-50 text-lg mb-8 max-w-lg">
            Track, organize, and optimize your job search workflow in one beautiful place.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-primary-blue hover:bg-blue-50 border-none rounded-full px-8 py-3 font-bold shadow-lg shadow-black/10"
          >
            Add New Application
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-brand-highlight/30 rounded-full blur-2xl" />

        {/* Star/Sparkle decorations similar to reference */}
        <svg className="absolute top-10 right-20 w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        <svg className="absolute bottom-10 right-1/3 w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          title="Total Applications"
          value={stats.total}
          onClick={() => setViewMode('list')}
          isActive={viewMode === 'list'}
        />
        <SummaryCard
          title="Interviews"
          value={stats.interview}
          status={ApplicationStatus.INTERVIEW}
          onClick={() => { }}
        />
        <SummaryCard
          title="Offers"
          value={stats.offer}
          status={ApplicationStatus.OFFER}
          onClick={() => { }}
        />
        <SummaryCard
          title="Rejected"
          value={stats.rejected}
          status={ApplicationStatus.REJECTED}
          onClick={() => { }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>

        {/* Recent Activity / Mentor style list */}
        <div className="bg-white dark:bg-neutral-surface-dark rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[300px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Recent Activity</h3>
            <button className="text-primary-blue text-sm font-medium hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-lg">
                  {i === 1 ? '🚀' : i === 2 ? '📅' : '❌'}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">Application Updated</p>
                  <p className="text-xs text-neutral-500">2 hours ago</p>
                </div>
                <button className="ml-auto px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Counter */}
      {hasApplications && hasActiveFilters && (
        <div className="mb-4 text-sm text-neutral-gray">
          Showing <span className="font-semibold text-neutral-text-primary-light">{filteredApplications.length}</span> of{' '}
          <span className="font-semibold text-neutral-text-primary-light">{applications.length}</span> applications
        </div>
      )}

      {/* Search and Filters */}
      {hasApplications && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
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
        /* Kanban Board */
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
        /* List View */
        <div className="pb-8">
          <ListView applications={filteredApplications} onDelete={handleDeleteApplication} onEdit={handleEditApplication} />
        </div>
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
    </motion.div>
  );
};

export default DashboardPage;

import type { FrontendApplication } from '@/types/frontend.types';

/**
 * Export applications to CSV format
 */
export const exportToCSV = (applications: FrontendApplication[], filename: string = 'applications.csv') => {
  if (applications.length === 0) {
    return;
  }

  // Define CSV headers
  const headers = [
    'Position',
    'Company',
    'Location',
    'Status',
    'Date Applied',
    'URL',
    'Description',
    'Skills',
    'Soft Skills',
    'Job Type',
    'Tags',
    'Notes'
  ];

  // Convert applications to CSV rows
  const rows = applications.map(app => [
    escapeCSVField(app.position),
    escapeCSVField(app.company),
    escapeCSVField(app.location),
    escapeCSVField(app.status),
    escapeCSVField(app.dateApplied),
    escapeCSVField(app.url),
    escapeCSVField(app.description || ''),
    escapeCSVField(app.skills?.join(', ') || ''),
    escapeCSVField(app.softSkills?.join(', ') || ''),
    escapeCSVField(app.jobType || ''),
    escapeCSVField(app.tags?.join(', ') || ''),
    escapeCSVField(app.notes || '')
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Escape special characters in CSV fields
 */
const escapeCSVField = (field: string): string => {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
};

/**
 * Export applications to JSON format
 */
export const exportToJSON = (applications: FrontendApplication[], filename: string = 'applications.json') => {
  if (applications.length === 0) {
    return;
  }

  const jsonContent = JSON.stringify(applications, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

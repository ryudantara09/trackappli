/**
 * Export Service
 * 
 * Business logic for exporting application data to various formats
 * Currently supports CSV export with proper formatting and escaping
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../core/database/types';
import { ApplicationsRepository, Application } from '../repositories/applications.repository';
import { generateCSV, formatDateForCSV, formatArrayForCSV } from '../utils/csv';

export interface ExportOptions {
  status?: string;
  includeNotes?: boolean;
  includeDescription?: boolean;
}

/**
 * Format application data for CSV export
 */
interface ApplicationCSVRow {
  'Position Title': string;
  'Company': string;
  'Location': string;
  'Status': string;
  'Applied Date': string;
  'Job Type': string;
  'Tech Stack': string;
  'Soft Skills': string;
  'Tags': string;
  'Notes': string;
  'Description': string;
  'Position URL': string;
}

/**
 * Export Service
 */
export class ExportService {
  private repository: ApplicationsRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new ApplicationsRepository(supabase);
  }

  /**
   * Format a single application for CSV export
   */
  private formatApplicationForCSV(
    application: Application,
    options: ExportOptions
  ): ApplicationCSVRow {
    return {
      'Position Title': application.position_title || '',
      'Company': application.company_name || '',
      'Location': application.job_location || '',
      'Status': application.status || '',
      'Applied Date': formatDateForCSV(application.applied_at),
      'Job Type': application.job_type || '',
      'Tech Stack': formatArrayForCSV(Array.isArray(application.tech_stack) ? application.tech_stack : null),
      'Soft Skills': formatArrayForCSV(Array.isArray(application.soft_skills) ? application.soft_skills : null),
      'Tags': formatArrayForCSV(Array.isArray(application.tags) ? application.tags : null),
      'Notes': options.includeNotes !== false ? (application.notes || '') : '',
      'Description': options.includeDescription !== false ? (application.description || '') : '',
      'Position URL': application.position_url || '',
    };
  }

  /**
   * Generate CSV export for user's applications
   */
  async generateApplicationsCSV(
    userId: string,
    options: ExportOptions = {}
  ): Promise<string> {
    // Fetch applications with optional status filter
    const applications = await this.repository.findByUserId(userId, {
      status: options.status,
    });

    // Define CSV headers
    const headers = [
      { key: 'Position Title', label: 'Position Title' },
      { key: 'Company', label: 'Company' },
      { key: 'Location', label: 'Location' },
      { key: 'Status', label: 'Status' },
      { key: 'Applied Date', label: 'Applied Date' },
      { key: 'Job Type', label: 'Job Type' },
      { key: 'Tech Stack', label: 'Tech Stack' },
      { key: 'Soft Skills', label: 'Soft Skills' },
      { key: 'Tags', label: 'Tags' },
    ];

    // Add optional columns
    if (options.includeNotes !== false) {
      headers.push({ key: 'Notes', label: 'Notes' });
    }
    if (options.includeDescription !== false) {
      headers.push({ key: 'Description', label: 'Description' });
    }
    
    headers.push({ key: 'Position URL', label: 'Position URL' });

    // Generate CSV
    const csv = generateCSV(
      applications,
      (app) => this.formatApplicationForCSV(app, options),
      headers
    );

    return csv;
  }

  /**
   * Generate CSV export as a stream (for large datasets)
   * This is a simplified version - for true streaming, you'd use Node.js streams
   */
  async generateApplicationsCSVStream(
    userId: string,
    options: ExportOptions = {}
  ): Promise<ReadableStream<Uint8Array>> {
    // For now, generate the full CSV and convert to stream
    // In a production environment with very large datasets,
    // you'd want to implement true streaming with pagination
    const csv = await this.generateApplicationsCSV(userId, options);
    
    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(csv);

    // Create a simple readable stream
    return new ReadableStream({
      start(controller) {
        controller.enqueue(data);
        controller.close();
      },
    });
  }

  /**
   * Get export filename with timestamp
   */
  getExportFilename(prefix: string = 'applications', extension: string = 'csv'): string {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}_${timestamp}.${extension}`;
  }

  /**
   * Get application count for export preview
   */
  async getExportCount(userId: string, status?: string): Promise<number> {
    return this.repository.count(userId, status);
  }
}

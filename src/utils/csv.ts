/**
 * CSV Utility Functions
 * 
 * Provides utilities for generating CSV files with proper escaping and formatting
 */

/**
 * Escape a CSV field value
 * Handles special characters like quotes, commas, and newlines
 */
export function escapeCsvField(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Convert to string
  let str = String(value);

  // If the field contains quotes, commas, or newlines, it needs to be quoted
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    // Escape quotes by doubling them
    str = str.replace(/"/g, '""');
    // Wrap in quotes
    return `"${str}"`;
  }

  return str;
}

/**
 * Convert an array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers: { key: keyof T; label: string }[]
): string {
  // UTF-8 BOM for Excel compatibility
  const BOM = '\uFEFF';

  // Create header row
  const headerRow = headers.map(h => escapeCsvField(h.label)).join(',');

  // Create data rows
  const dataRows = data.map(row => {
    return headers
      .map(h => {
        const value = row[h.key];
        
        // Handle arrays (join with semicolons)
        if (Array.isArray(value)) {
          return escapeCsvField(value.join('; '));
        }
        
        // Handle dates
        if (value && typeof value === 'object' && 'toISOString' in value) {
          return escapeCsvField(value.toISOString().split('T')[0]);
        }
        
        return escapeCsvField(value);
      })
      .join(',');
  });

  // Combine all rows
  return BOM + [headerRow, ...dataRows].join('\n');
}

/**
 * Generate CSV from data with custom formatter
 */
export function generateCSV<T>(
  data: T[],
  formatter: (item: T) => Record<string, any>,
  headers: { key: string; label: string }[]
): string {
  const formattedData = data.map(formatter);
  return arrayToCSV(formattedData, headers);
}

/**
 * Create a CSV download response headers
 */
export function createCSVHeaders(filename: string): Record<string, string> {
  return {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-cache',
  };
}

/**
 * Format date for CSV export
 */
export function formatDateForCSV(date: Date | string | null | undefined): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  
  return d.toISOString().split('T')[0];
}

/**
 * Format array for CSV export
 */
export function formatArrayForCSV(arr: any[] | null | undefined): string {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
  
  return arr.join('; ');
}

'use client';

import type { TriageResultData } from './definitions';

interface LogEntry extends TriageResultData {
  timestamp: string;
}

const LOG_KEY = 'ai4care-interactions';

export function logInteraction(data: LogEntry): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const existingLogsRaw = localStorage.getItem(LOG_KEY);
    const existingLogs: LogEntry[] = existingLogsRaw
      ? JSON.parse(existingLogsRaw)
      : [];
    
    // Keep logs to a reasonable number, e.g., last 50 interactions
    const updatedLogs = [data, ...existingLogs].slice(0, 50);

    localStorage.setItem(LOG_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Failed to log interaction to localStorage:', error);
  }
}

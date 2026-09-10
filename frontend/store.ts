import { create } from 'zustand';
import { RadarReport, MonitorEntry } from './types';
import { generateMockReport, generateMockMonitorData } from './utils/mockData';

interface RadarState {
  // Radar Estratégico State
  report: RadarReport | null;
  isGenerating: boolean;
  lastRunDate: string | null;
  generateReport: () => Promise<void>;
  clearReport: () => void;

  // Monitor Judicial State
  monitorEntries: MonitorEntry[] | null;
  isScanningMonitor: boolean;
  lastMonitorRunDate: string | null;
  scanMonitor: () => Promise<void>;
}

export const useRadarStore = create<RadarState>((set) => ({
  // Radar Estratégico Implementation
  report: null,
  isGenerating: false,
  lastRunDate: null,
  generateReport: async () => {
    set({ isGenerating: true });
    // Simulate API/AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    const newReport = generateMockReport();
    set({ 
      report: newReport, 
      isGenerating: false,
      lastRunDate: new Date().toISOString()
    });
  },
  clearReport: () => set({ report: null }),

  // Monitor Judicial Implementation
  monitorEntries: null,
  isScanningMonitor: false,
  lastMonitorRunDate: null,
  scanMonitor: async () => {
    set({ isScanningMonitor: true });
    // Simulate web scraping time
    await new Promise(resolve => setTimeout(resolve, 3000));
    const newEntries = generateMockMonitorData();
    set({
      monitorEntries: newEntries,
      isScanningMonitor: false,
      lastMonitorRunDate: new Date().toISOString()
    });
  }
}));

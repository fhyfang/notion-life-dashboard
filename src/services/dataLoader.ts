import type { DatabaseName } from './databases';
import type { NotionPage } from '../types/notion';
import { 
  loadRealtimeNotionData, 
  getRealtimeDatabaseData, 
  isRealtimeModeAvailable,
  clearRealtimeCache 
} from './realtimeDataLoader';

export interface NotionData {
  [key: string]: {
    name: string;
    data: NotionPage[];
    lastUpdated: string;
    error?: string;
  };
}

let cachedData: NotionData | null = null;
let lastFetchPromise: Promise<NotionData> | null = null;
let useRealtimeMode = false;

// Enable/disable realtime mode
export function setRealtimeMode(enabled: boolean): void {
  useRealtimeMode = enabled && isRealtimeModeAvailable();
  if (useRealtimeMode) {
    // Clear static cache when switching to realtime
    cachedData = null;
    lastFetchPromise = null;
    clearRealtimeCache();
  }
}

// Check if realtime mode is currently active
export function isRealtimeMode(): boolean {
  return useRealtimeMode;
}

// Auto-enable realtime mode if API key is available
if (isRealtimeModeAvailable()) {
  setRealtimeMode(true);
}

export async function loadNotionData(): Promise<NotionData> {
  // Force realtime mode for dynamic updates
  if (useRealtimeMode) {
    try {
      console.log('Loading realtime Notion data...');
      return await loadRealtimeNotionData();
    } catch (error) {
      console.error('Realtime data loading failed:', error);
      throw error; // Don't fall back to static data, force realtime
    }
  }

  // If realtime is not available, throw error to force enabling it
  throw new Error('Realtime mode is required for dynamic updates. Please check your API configuration.');
}

export async function getDatabaseData(databaseName: DatabaseName): Promise<NotionPage[]> {
  try {
    console.log(`Getting realtime data for database: ${databaseName}`);
    
    // Always use realtime data for all databases to ensure dynamic updates
    if (useRealtimeMode) {
      try {
        return await getRealtimeDatabaseData(databaseName);
      } catch (error) {
        console.error(`Realtime data fetch failed for ${databaseName}:`, error);
        throw error; // Don't fall back, force realtime
      }
    }
    
    // If realtime mode is not enabled, throw error
    throw new Error(`Realtime mode is required for ${databaseName}. Please check your API configuration.`);
  } catch (error) {
    console.error(`Error getting database data for '${databaseName}':`, error);
    throw error; // Propagate error to show user that realtime is required
  }
}

export async function getLastUpdateTime(): Promise<string | null> {
  const allData = await loadNotionData();
  const firstDbKey = Object.keys(allData)[0];
  if (firstDbKey) {
    const lastUpdated = allData[firstDbKey]?.lastUpdated;
    if (lastUpdated) {
      const updateTime = new Date(lastUpdated).toLocaleString('zh-CN', { hour12: false });
      const mode = useRealtimeMode ? '实时' : '静态';
      return `${updateTime} (${mode})`;
    }
  }
  return 'N/A';
}

// Force refresh data (clear all caches)
export async function refreshData(): Promise<void> {
  cachedData = null;
  lastFetchPromise = null;
  if (useRealtimeMode) {
    clearRealtimeCache();
  }
}

// Get data source info
export function getDataSourceInfo(): { mode: 'realtime' | 'static'; available: boolean } {
  return {
    mode: useRealtimeMode ? 'realtime' : 'static',
    available: isRealtimeModeAvailable()
  };
}
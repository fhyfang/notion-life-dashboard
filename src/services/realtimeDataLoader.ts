import type { DatabaseName } from './databases';
import type { NotionPage } from '../types/notion';
import type { NotionData } from './dataLoader';

// API configuration - use vite proxy in development, direct path in production
const API_BASE = '/api';

// Get API headers for local server
function getApiHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}

// Database ID mapping
const DATABASE_IDS: Record<DatabaseName, string> = {
  '每日复盘': import.meta.env.VITE_NOTION_DAILY_REVIEW_ID || '',
  '人生主数据': import.meta.env.VITE_NOTION_LIFE_DATA_ID || '',
  '价值观': import.meta.env.VITE_NOTION_VALUES_ID || '',
  '价值观检验': import.meta.env.VITE_NOTION_VALUES_TEST_ID || '',
  '目标库': import.meta.env.VITE_NOTION_GOALS_ID || '',
  '项目库': import.meta.env.VITE_NOTION_PROJECTS_ID || '',
  '行动库': import.meta.env.VITE_NOTION_ACTIONS_ID || '',
  '每日日志': import.meta.env.VITE_NOTION_DAILY_LOG_ID || '',
  '情绪记录': import.meta.env.VITE_NOTION_EMOTIONS_ID || '',
  '健康日记': import.meta.env.VITE_NOTION_HEALTH_ID || '',
  '注意力记录': import.meta.env.VITE_NOTION_ATTENTION_ID || '',
  '创造记录': import.meta.env.VITE_NOTION_CREATION_ID || '',
  '互动记录': import.meta.env.VITE_NOTION_INTERACTION_ID || '',
  '财务记录': import.meta.env.VITE_NOTION_FINANCE_ID || '',
  '成长复盘': import.meta.env.VITE_NOTION_GROWTH_ID || '',
  '欲望数据库': import.meta.env.VITE_NOTION_DESIRES_ID || '',
  '知识库': import.meta.env.VITE_NOTION_KNOWLEDGE_ID || '',
  '思维模型': import.meta.env.VITE_NOTION_MODELS_ID || '',
  '关系网': import.meta.env.VITE_NOTION_RELATIONS_ID || '',
};

// Cache for real-time data with shorter duration for dynamic updates
let realtimeCache: NotionData | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache for more frequent updates

// Fetch data from a specific database via our API server
export async function fetchDatabaseData(databaseName: DatabaseName): Promise<NotionPage[]> {
  try {
    const response = await fetch(`${API_BASE}/database/${encodeURIComponent(databaseName)}`, {
      method: 'POST',
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data as NotionPage[];
  } catch (error) {
    console.error(`Error fetching data for ${databaseName}:`, error);
    return [];
  }
}

// Load all databases with real-time data via our API server
export async function loadRealtimeNotionData(): Promise<NotionData> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (realtimeCache && (now - lastCacheTime) < CACHE_DURATION) {
    return realtimeCache;
  }

  try {
    console.log('Fetching all databases from API server...');
    const response = await fetch(`${API_BASE}/databases`, {
      method: 'GET',
      headers: getApiHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update cache
    realtimeCache = data;
    lastCacheTime = now;
    
    console.log('Successfully loaded all databases:', Object.keys(data).length);
    return data;
  } catch (error) {
    console.error('Failed to load realtime data from API server:', error);
    
    // If we have cached data, return it even if expired
    if (realtimeCache) {
      console.log('Returning expired cache data due to API error');
      return realtimeCache;
    }
    
    // Otherwise return empty data
    return {};
  }
}

// Get real-time data for a specific database
export async function getRealtimeDatabaseData(databaseName: DatabaseName): Promise<NotionPage[]> {
  try {
    // For frequently accessed data, fetch directly
    if (databaseName === '每日日志' || databaseName === '情绪记录' || databaseName === '健康日记') {
      return await fetchDatabaseData(databaseName);
    }
    
    // For other data, use cached version
    const allData = await loadRealtimeNotionData();
    return allData[databaseName]?.data || [];
  } catch (error) {
    console.error(`Error getting realtime data for ${databaseName}:`, error);
    return [];
  }
}

// Clear cache to force refresh
export function clearRealtimeCache(): void {
  realtimeCache = null;
  lastCacheTime = 0;
}

// Check if real-time mode is available
export function isRealtimeModeAvailable(): boolean {
  return !!import.meta.env.VITE_NOTION_API_KEY;
}
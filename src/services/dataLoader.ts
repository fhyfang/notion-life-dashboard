import type { DatabaseName } from './databases';

export interface NotionData {
  [key: string]: {
    name: string;
    data: any[];
    lastUpdated: string;
    error?: string;
  };
}

let cachedData: NotionData | null = null;
let lastFetchPromise: Promise<NotionData> | null = null;

export async function loadNotionData(): Promise<NotionData> {
  if (cachedData) return cachedData;
  if (lastFetchPromise) return lastFetchPromise;

  lastFetchPromise = (async () => {
    try {
      const response = await fetch('/Notion-Life-仪表板/notion-data.json'); // Adjusted for GitHub Pages
      if (!response.ok) throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      
      const data = await response.json();
      cachedData = data;
      return data;
    } catch (error) {
      console.error('Error loading Notion data:', error);
      lastFetchPromise = null; 
      return {};
    }
  })();
  return lastFetchPromise;
}

export async function getDatabaseData(databaseName: DatabaseName): Promise<any[]> {
  const allData = await loadNotionData();
  return allData[databaseName]?.data || [];
}

export async function getLastUpdateTime(): Promise<string | null> {
  const allData = await loadNotionData();
  const firstDbKey = Object.keys(allData)[0];
  if (firstDbKey) {
    const lastUpdated = allData[firstDbKey]?.lastUpdated;
    if (lastUpdated) return new Date(lastUpdated).toLocaleString('zh-CN', { hour12: false });
  }
  return 'N/A';
}

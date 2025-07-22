// 数据加载服务
export interface NotionData {
  [key: string]: {
    name: string;
    data: any[];
    lastUpdated: string;
    error?: string;
  };
}

let cachedData: NotionData | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export async function loadNotionData(): Promise<NotionData> {
  const now = Date.now();
  
  // 如果缓存有效，返回缓存数据
  if (cachedData && (now - lastFetch) < CACHE_DURATION) {
    return cachedData;
  }
  
  try {
    const response = await fetch('/data/notion-data.json');
    if (!response.ok) {
      throw new Error('Failed to load data');
    }
    
    cachedData = await response.json();
    lastFetch = now;
    return cachedData!;
  } catch (error) {
    console.error('Error loading Notion data:', error);
    // 返回空数据结构
    return {};
  }
}

// 获取特定数据库的数据
export async function getDatabaseData(databaseName: string) {
  const allData = await loadNotionData();
  return allData[databaseName]?.data || [];
}

// 获取数据最后更新时间
export async function getLastUpdateTime(): Promise<string | null> {
  const allData = await loadNotionData();
  const firstDb = Object.values(allData)[0];
  return firstDb?.lastUpdated || null;
}

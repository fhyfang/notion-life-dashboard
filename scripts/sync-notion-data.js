import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

if (!process.env.NOTION_API_KEY) {
  throw new Error('NOTION_API_KEY environment variable is not set.');
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASES = {
  价值观: '235b6a1ba40681369b6cf6dc2ddd4aee',
  价值观检验: '235b6a1ba40681299abaffe6f8c0cf2a',
  目标库: '235b6a1ba40681958663f66a8f7c415e',
  项目库: '235b6a1ba40681c5a1fff21434479d7f',
  行动库: '235b6a1ba40681709066ffc71e397670',
  每日日志: '235b6a1ba40681f6bb1aef4d6b297e44',
  情绪记录: '235b6a1ba40681e49a28d1ac5c544175',
  健康日记: '235b6a1ba40681d68417e04382f4a415',
  注意力记录: '235b6a1ba4068155a4a5fb159817c0a7',
  创造记录: '235b6a1ba4068119a758ca37fff85a61',
  互动记录: '235b6a1ba406811399b4d712954ed9b0',
  财务记录: '235b6a1ba406811780d3f4befebe85c9',
  成长复盘: '235b6a1ba406816682b9cd596d63eb84',
  欲望数据库: '236b6a1ba40680e8bc09ef708acd9c34',
  知识库: '235b6a1ba40681b1877ffd6e3ba0e78d',
  思维模型: '235b6a1ba40681e1a6c9cbbb95c13a45',
  关系网: '235b6a1ba40681e49ce5debe17b5262c'
};

async function fetchAllPages(databaseId) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;
  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
      page_size: 100,
    });
    results = results.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }
  return results;
}

async function fetchDatabase(name, databaseId) {
  try {
    console.log(`Fetching ${name}...`);
    const results = await fetchAllPages(databaseId);
    console.log(`Fetched ${results.length} items from ${name}.`);
    return { name, data: results, lastUpdated: new Date().toISOString() };
  } catch (error) {
    console.error(`Error fetching ${name}:`, error.body || error.message);
    return { name, data: [], error: error.message, lastUpdated: new Date().toISOString() };
  }
}

async function syncAllData() {
  console.log('Starting Notion data sync...');
  const results = {};
  const promises = Object.entries(DATABASES).map(([name, id]) => fetchDatabase(name, id));
  const dataResults = await Promise.all(promises);
  
  dataResults.forEach(result => {
    results[result.name] = {
      name: result.name,
      data: result.data,
      lastUpdated: result.lastUpdated,
      ...(result.error && { error: result.error })
    };
  });
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

  const outputPath = path.join(publicDir, 'notion-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`Data saved to ${outputPath}`);
  console.log(`Sync completed at ${new Date().toISOString()}`);
}

syncAllData().catch(console.error);

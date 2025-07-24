// Database names used in the Notion workspace - 19个核心数据库
export type DatabaseName = 
  | '每日复盘'
  | '人生主数据'
  | '价值观'
  | '价值观检验'
  | '目标库'
  | '项目库'
  | '行动库'
  | '每日日志'
  | '情绪记录'
  | '健康日记'
  | '注意力记录'
  | '创造记录'
  | '互动记录'
  | '财务记录'
  | '成长复盘'
  | '欲望数据库'
  | '知识库'
  | '思维模型'
  | '关系网';

// Database configuration
export const DATABASE_CONFIG: Record<DatabaseName, { displayName: string; color: string }> = {
  '每日复盘': { displayName: '每日复盘', color: '#3B82F6' },
  '人生主数据': { displayName: '人生主数据', color: '#10B981' },
  '价值观': { displayName: '价值观', color: '#F59E0B' },
  '价值观检验': { displayName: '价值观检验', color: '#EF4444' },
  '目标库': { displayName: '目标库', color: '#8B5CF6' },
  '项目库': { displayName: '项目库', color: '#06B6D4' },
  '行动库': { displayName: '行动库', color: '#84CC16' },
  '每日日志': { displayName: '每日日志', color: '#F97316' },
  '情绪记录': { displayName: '情绪记录', color: '#EC4899' },
  '健康日记': { displayName: '健康日记', color: '#6366F1' },
  '注意力记录': { displayName: '注意力记录', color: '#14B8A6' },
  '创造记录': { displayName: '创造记录', color: '#F59E0B' },
  '互动记录': { displayName: '互动记录', color: '#8B5CF6' },
  '财务记录': { displayName: '财务记录', color: '#10B981' },
  '成长复盘': { displayName: '成长复盘', color: '#3B82F6' },
  '欲望数据库': { displayName: '欲望数据库', color: '#F97316' },
  '知识库': { displayName: '知识库', color: '#EF4444' },
  '思维模型': { displayName: '思维模型', color: '#06B6D4' },
  '关系网': { displayName: '关系网', color: '#84CC16' }
};
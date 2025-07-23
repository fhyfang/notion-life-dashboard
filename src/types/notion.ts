// Notion Rich Text type
export interface NotionRichText {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  href?: string | null;
}

// Notion Date property
export interface NotionDate {
  start: string;
  end?: string | null;
  time_zone?: string | null;
}

// Notion Select property
export interface NotionSelect {
  id?: string;
  name: string;
  color?: string;
}

// Notion Number property
export interface NotionNumber {
  number: number;
}

// Notion Formula property
export interface NotionFormula {
  type: string;
  number?: number;
  string?: string;
  boolean?: boolean;
  date?: NotionDate;
}

// Base Notion Page object
export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, any>;
}

// Specific database item types
export interface HealthDiaryItem extends NotionPage {
  properties: {
    "日期"?: { date?: NotionDate };
    "睡眠评分"?: { formula?: NotionFormula };
    "运动评分"?: { formula?: NotionFormula };
    "冥想评分"?: { formula?: NotionFormula };
    "精力水平"?: { formula?: NotionFormula };
    [key: string]: any;
  };
}

export interface EmotionRecordItem extends NotionPage {
  properties: {
    "日期"?: { date?: NotionDate };
    "记录时间"?: { created_time?: string };
    "当前心情评分"?: { select?: NotionSelect };
    "触发类型"?: { select?: NotionSelect };
    [key: string]: any;
  };
}

export interface ActionItem extends NotionPage {
  properties: {
    "任务名称"?: { title?: NotionRichText[] };
    "状态"?: { select?: NotionSelect };
    "计划完成日期"?: { date?: NotionDate };
    "优先级"?: { select?: NotionSelect };
    "完成时间"?: { date?: NotionDate };
    [key: string]: any;
  };
}

export interface LogItem extends NotionPage {
  properties: {
    "名称"?: { title?: NotionRichText[] };
    "开始时间"?: { date?: NotionDate };
    "结束时间"?: { date?: NotionDate };
    "记录时间"?: { created_time?: string };
    "类型"?: { select?: NotionSelect };
    [key: string]: any;
  };
}

export interface GoalItem extends NotionPage {
  properties: {
    "目标名称"?: { title?: NotionRichText[] };
    "状态"?: { select?: NotionSelect };
    "优先级"?: { number?: NotionNumber };
    "进度"?: { number?: NotionNumber };
    "开始日期"?: { date?: NotionDate };
    "截止日期"?: { date?: NotionDate };
    [key: string]: any;
  };
}

export interface SkillItem extends NotionPage {
  properties: {
    "技能名称"?: { title?: NotionRichText[] };
    "熟练度"?: { select?: NotionSelect };
    "练习时长"?: { number?: NotionNumber };
    "最后练习"?: { date?: NotionDate };
    [key: string]: any;
  };
}

export interface RelationshipItem extends NotionPage {
  properties: {
    "姓名"?: { title?: NotionRichText[] };
    "互动质量"?: { select?: NotionSelect };
    "最后互动"?: { date?: NotionDate };
    "互动频率"?: { select?: NotionSelect };
    [key: string]: any;
  };
}

export interface ResourceItem extends NotionPage {
  properties: {
    "名称"?: { title?: NotionRichText[] };
    "类型"?: { select?: NotionSelect };
    "金额"?: { number?: NotionNumber };
    "日期"?: { date?: NotionDate };
    [key: string]: any;
  };
}

// Chart data types
export interface DailyEnergyData {
  date: string;
  sleep: number | null;
  exercise: number | null;
  meditation: number | null;
  energy: number | null;
  avgMood: number | null;
}

export interface EmotionTrigger {
  name: string;
  count: number;
}

export interface TimeDistributionData {
  name: string;
  value: number;
  percentage: number;
}

export interface SkillData {
  name: string;
  熟练度: string;
  练习时长: number;
  最后练习: string;
}

export interface RelationshipData {
  name: string;
  互动质量: string;
  最后互动: string;
  互动频率: string;
  互动次数: number;
}

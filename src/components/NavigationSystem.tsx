import { Target } from 'lucide-react'

import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';

interface ValueItem {
  name: string;
  priority: number;
  completion: number;
  color: string;
  icon: string;
}

interface GoalItem {
  name: string;
  progress: number;
}

const NavigationSystem = () => {
  const [values, setValues] = useState<ValueItem[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 获取价值观数据
      const data = await getDatabaseData('价值观');
      const loadedValues = data.map((item: any) => {
        // 解析优先级，例如 "5分" -> 5
        const priorityName = item.properties["优先级"]?.select?.name || '0分';
        const priority = parseInt(priorityName.replace('分', '')) * 20; // 转换为百分比 (5分 = 100%)
        
        // 根据优先级设置颜色
        const colors = ['bg-gray-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
        const colorIndex = Math.min(Math.floor(priority / 20), colors.length - 1);
        
        return {
          name: item.properties["价值观名称"]?.title[0]?.plain_text || '未命名',
          priority: priority,
          completion: priority, // 使用优先级作为完成度的临时值
          color: colors[colorIndex],
          icon: item.icon?.emoji || '🔵',
        };
      });
      setValues(loadedValues);
      
      // 获取目标数据
      const goalsData = await getDatabaseData('目标库');
      const loadedGoals = goalsData.slice(0, 4).map((item: any) => ({
        name: item.properties["理想状态"]?.title[0]?.plain_text?.trim() || '未命名目标',
        progress: item.properties["目标进度"]?.rollup?.number || 0
      }));
      setGoals(loadedGoals);
      setLoading(false);
    };

    fetchData().catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">导向系统</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">价值观矩阵</h3>
          {values.map((value, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1">
                  <span>{value.icon}</span>
                  {value.name}
                </span>
                <span className="text-sm text-gray-500">{value.priority}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${value.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${value.completion}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-600">年度目标完成情况</h3>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal, index) => (
              <div key={index} className="bg-gray-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {goal.progress}%
                </div>
                <div className="text-xs text-gray-600">{goal.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationSystem

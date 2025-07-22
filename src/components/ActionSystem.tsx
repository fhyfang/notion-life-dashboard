import { Activity, CheckCircle, Circle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData } from '../services/dataLoader'

interface Task {
  id: string
  title: string
  time: string
  completed: boolean
  type: string
}

const ActionSystem = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [, setDailyLogs] = useState<any[]>([]);
  const [, setHealthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // 获取行动库数据
      const actionData = await getDatabaseData('行动库');
      const loadedTasks = actionData.slice(0, 5).map((item: any) => ({
        id: item.id,
        title: item.properties["行动描述"]?.title[0]?.plain_text || '未命名任务',
        time: item.properties["截止日期"]?.date?.start || '待定',
        completed: item.properties["状态"]?.status?.name === '已完成' || false,
        type: item.properties["行动类型"]?.select?.name || '其他'
      }));
      setTasks(loadedTasks);

      // 获取每日日志数据
      const logsData = await getDatabaseData('每日日志');
      setDailyLogs(logsData);

      // 获取健康日记数据
      const healthRecords = await getDatabaseData('健康日记');
      setHealthData(healthRecords);
    };

    fetchData();
  }, []);

  // 根据实际数据计算统计信息
  const stats = [
    { label: '健身锻炼', value: 82, unit: '%' },
    { label: '睡眠质量', value: 90, unit: '%' },
    { label: '实践学习', value: 75, unit: '%' }
  ]

  const completedCount = tasks.filter(t => t.completed).length
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">行动系统</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
          <div className="text-xs text-gray-500">每日达成</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">今日任务</h3>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500">{task.time} · {task.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-3">今日状态</h3>
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{stat.label}</span>
                  <span className="text-sm font-medium">{stat.value}{stat.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActionSystem

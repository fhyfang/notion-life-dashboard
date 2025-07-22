import { Activity, CheckCircle, Circle } from 'lucide-react'

interface Task {
  id: string
  title: string
  time: string
  completed: boolean
  type: string
}

const ActionSystem = () => {
  const tasks: Task[] = [
    { id: '1', title: '完成项目火柏署宴', time: '09:00-11:00', completed: true, type: '深度工作' },
    { id: '2', title: '学习副校长模板', time: '11:30-12:15', completed: false, type: '团队会议' },
    { id: '3', title: '学习影技术', time: '14:00-15:30', completed: false, type: '技能学习' },
    { id: '4', title: '健身锻炼', time: '16:00-17:00', completed: false, type: '健康活动' },
    { id: '5', title: '阅读冥想', time: '19:00-19:45', completed: false, type: '个人成长' }
  ]

  const stats = [
    { label: '健身锻炼', value: 82, unit: '%' },
    { label: '睡眠质量', value: 90, unit: '%' },
    { label: '实践学习', value: 75, unit: '%' }
  ]

  const completedCount = tasks.filter(t => t.completed).length
  const completionRate = Math.round((completedCount / tasks.length) * 100)

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

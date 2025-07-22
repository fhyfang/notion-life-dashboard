import { Flag } from 'lucide-react'

interface Goal {
  name: string
  progress: number
  deadline: string
  remainingDays: number
}

const GoalSystem = () => {
  const goals: Goal[] = [
    { name: '个人博客建成', progress: 75, deadline: '2024-02-15', remainingDays: 208 },
    { name: '技能学习计划', progress: 45, deadline: '2024-03-01', remainingDays: 23 },
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Flag className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">目标系统</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{goal.name}</span>
              <span className="text-sm text-gray-500">{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              完成日期: {goal.deadline} (还有 {goal.remainingDays} 天)
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoalSystem


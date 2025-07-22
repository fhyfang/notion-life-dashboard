import { Target } from 'lucide-react'

interface ValueItem {
  name: string
  priority: number
  completion: number
  color: string
  icon: string
}

const NavigationSystem = () => {
  const values: ValueItem[] = [
    { name: '诚信正直', priority: 75, completion: 75, color: 'bg-green-500', icon: '🎯' },
    { name: '身心健康体魄', priority: 68, completion: 68, color: 'bg-blue-500', icon: '💪' },
    { name: '获得新奇见识', priority: 65, completion: 45, color: 'bg-purple-500', icon: '👁' },
    { name: '创造力', priority: 60, completion: 60, color: 'bg-yellow-500', icon: '💡' },
    { name: '家庭和睦快立', priority: 55, completion: 50, color: 'bg-pink-500', icon: '👨‍👩‍👧‍👦' }
  ]

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
            {['Web3', 'React', 'TypeScript', '阅读'].map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {[65, 70, 65, 50][index]}%
                </div>
                <div className="text-xs text-gray-600">{skill}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationSystem

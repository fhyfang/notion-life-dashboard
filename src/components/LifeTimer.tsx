import { Clock } from 'lucide-react'

interface LifeTimerProps {
  currentTime: Date
}

const LifeTimer = ({ currentTime }: LifeTimerProps) => {
  // 假设生日是 1990-01-01，你可以根据实际情况修改
  const birthDate = new Date('1990-01-01')
  const daysSinceBirth = Math.floor((currentTime.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
        <Clock className="w-5 h-5" />
        <span className="text-sm">生命计时器</span>
      </div>
      
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-2">
          今天是我人生的第 {daysSinceBirth.toLocaleString()} 天
        </h1>
        <p className="text-gray-500">
          未来已来，只是不均匀分布；第 {Math.floor(daysSinceBirth / 365)} 年 11 月 29 日还有 {9091 - daysSinceBirth} 天
        </p>
        <p className="text-blue-500 mt-2 italic">
          "今天，你计划如何使用这珍贵的一天？"
        </p>
      </div>
    </div>
  )
}

export default LifeTimer

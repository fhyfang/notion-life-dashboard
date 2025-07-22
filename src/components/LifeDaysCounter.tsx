import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface LifeDaysCounterProps {
  birthDate: string // 格式: 'YYYY-MM-DD'
}

const LifeDaysCounter = ({ birthDate }: LifeDaysCounterProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const birth = new Date(birthDate)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // 计算天数
  const daysSinceBirth = Math.floor((currentTime.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  
  // 格式化数字，添加逗号
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN')
  }
  
  // 获取当前日期信息
  const currentYear = currentTime.getFullYear()
  const currentMonth = currentTime.getMonth() + 1
  const currentDay = currentTime.getDate()
  // const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  // const currentWeekDay = weekDays[currentTime.getDay()]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 shadow-lg border border-orange-100"
    >
      <div className="text-center">
        {/* 时钟图标 */}
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full p-3 shadow-md">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
        </div>
        
        {/* 主标题 */}
        <h2 className="text-2xl font-medium text-gray-600 mb-2">
          生命计时器
        </h2>
        
        {/* 天数显示 */}
        <div className="mb-4">
          <span className="text-4xl font-bold text-green-600">
            今天是我人生的第 {formatNumber(daysSinceBirth)} 天
          </span>
        </div>
        
        {/* 日期信息 */}
        <p className="text-gray-500 text-sm">
          未来已来，只是不均匀分布。第 {currentYear} 年 {currentMonth} 月 {currentDay} 日定有 {formatNumber(daysSinceBirth + 1)} 天
        </p>
        
        {/* 引言 */}
        <p className="text-gray-400 text-xs mt-2 italic">
          "今天，你计划如何使用这珍贵的一天？"
        </p>
      </div>
    </motion.div>
  )
}

export default LifeDaysCounter

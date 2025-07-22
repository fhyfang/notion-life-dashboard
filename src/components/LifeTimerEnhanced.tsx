import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, Zap, Heart } from 'lucide-react'

interface LifeTimerEnhancedProps {
  birthDate?: string // 格式: 'YYYY-MM-DD'
}

const LifeTimerEnhanced = ({ birthDate = '1990-01-01' }: LifeTimerEnhancedProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const birth = new Date(birthDate)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // 计算各种时间数据
  const daysSinceBirth = Math.floor((currentTime.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const yearsSinceBirth = Math.floor(daysSinceBirth / 365)
  const monthsSinceBirth = Math.floor(daysSinceBirth / 30)
  const weeksSinceBirth = Math.floor(daysSinceBirth / 7)
  const hoursSinceBirth = Math.floor((currentTime.getTime() - birth.getTime()) / (1000 * 60 * 60))
  const minutesSinceBirth = Math.floor((currentTime.getTime() - birth.getTime()) / (1000 * 60))
  
  // 计算今天的进度
  const todayProgress = (currentTime.getHours() * 60 + currentTime.getMinutes()) / (24 * 60) * 100
  
  // 计算到特定日期的倒计时
  const targetDate = new Date(birth)
  targetDate.setFullYear(birth.getFullYear() + 35)
  targetDate.setMonth(10) // 11月
  targetDate.setDate(29)
  const daysToTarget = Math.floor((targetDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24))
  
  const timeStats = [
    { label: '年', value: yearsSinceBirth, icon: Calendar, color: 'text-purple-500' },
    { label: '月', value: monthsSinceBirth, icon: Calendar, color: 'text-blue-500' },
    { label: '周', value: weeksSinceBirth, icon: Clock, color: 'text-green-500' },
    { label: '天', value: daysSinceBirth, icon: Zap, color: 'text-yellow-500' },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90" />
      
      {/* 装饰性图案 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative px-8 py-12 text-white">
        {/* 主标题 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold mb-4">
            第 {daysSinceBirth.toLocaleString()} 天
          </h1>
          <p className="text-xl opacity-90">
            生命的每一天都是独一无二的礼物
          </p>
        </motion.div>
        
        {/* 时间统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {timeStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* 今日进度 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex justify-between text-sm mb-2">
            <span>今日进度</span>
            <span>{todayProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${todayProgress}%` }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </div>
        </motion.div>
        
        {/* 倒计时 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4"
        >
          <Heart className="w-6 h-6 mx-auto mb-2" />
          <p className="text-lg">
            距离第 {yearsSinceBirth + (35 - yearsSinceBirth)} 年 11 月 29 日
          </p>
          <p className="text-2xl font-bold mt-1">
            还有 {daysToTarget.toLocaleString()} 天
          </p>
        </motion.div>
        
        {/* 激励语句 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-6 text-lg italic"
        >
          "今天，你计划如何使用这珍贵的一天？"
        </motion.p>
      </div>
    </motion.div>
  )
}

export default LifeTimerEnhanced

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Target, Sparkles } from 'lucide-react'

interface CountdownProps {
  birthDate?: string // 格式: 'YYYY-MM-DD'
  targetDate?: string // 格式: 'YYYY-MM-DD'
}

const TenThousandDaysCountdown = ({ 
  birthDate = '1987-08-25', 
  targetDate = '2052-11-29' 
}: CountdownProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  // 计算关键数据
  const birth = new Date(birthDate)
  const target = new Date(targetDate)
  
  // 计算已经过去的天数 (today - 生日)
  const daysPassed = Math.floor((currentTime.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算总航程 (目标日期 - 生日)
  const totalJourney = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算剩余天数
  const daysRemaining = Math.floor((target.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24))
  
  // 计算进度百分比
  const progressPercentage = (daysPassed / totalJourney * 100).toFixed(1)
  
  // 格式化日期显示
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl"
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      </div>
      
      <div className="relative px-8 py-12 text-white">
        {/* 主倒计时数字 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="text-8xl md:text-9xl font-bold mb-2"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {daysRemaining.toLocaleString()}
          </motion.div>
          <p className="text-xl md:text-2xl opacity-90 font-light">
            Days of Potential Remaining
          </p>
        </motion.div>
        
        {/* 里程碑日期 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Target className="w-5 h-5" />
            <span className="text-lg">Ends on: {formatDate(target)}</span>
          </div>
        </motion.div>
        
        {/* 经验值进度条 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-lg font-medium">我的人生已探索 {daysPassed.toLocaleString()} 天</span>
            </div>
            <span className="text-lg font-bold text-yellow-300">
              经验值 {progressPercentage}%
            </span>
          </div>
          
          <div className="relative h-6 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </motion.div>
            
            {/* 进度条上的光效 */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-1 h-full bg-white/50"
              animate={{ 
                left: ["0%", `${progressPercentage}%`],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
          </div>
          
          <div className="flex justify-between text-sm mt-2 opacity-80">
            <span>起点: {formatDate(birth)}</span>
            <span>总航程: {totalJourney.toLocaleString()} 天</span>
          </div>
        </motion.div>
        
        {/* 每日反思箴言 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <Calendar className="w-5 h-5" />
            <p className="text-lg italic">
              "今天，我如何为这万分之一的旅程增添价值？"
            </p>
          </div>
        </motion.div>
        
        {/* 额外的统计信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{Math.floor(daysPassed / 365)}</div>
            <div className="text-sm opacity-80">年已逝</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{Math.floor(daysRemaining / 365)}</div>
            <div className="text-sm opacity-80">年可期</div>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="text-2xl font-bold">{(daysRemaining / 10000).toFixed(1)}</div>
            <div className="text-sm opacity-80">万天</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TenThousandDaysCountdown

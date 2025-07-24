import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Calendar } from 'lucide-react'

interface CountdownProps {
  birthDate: string
  targetDate: string
}

const TenThousandDaysCountdownEnhanced: React.FC<CountdownProps> = ({ birthDate, targetDate }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  
  const today = new Date()
  const birth = new Date(birthDate)
  const target = new Date(targetDate)
  
  const daysLived = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const daysToMilestone = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  // 每日箴言
  const dailyQuotes = [
    "今天，我如何与自己和世界温柔地连接？",
    "今天，我想体验什么样的感觉？"
  ]
  
  // 格式化数字，添加逗号
  const formatNumber = (num: number) => {
    return num.toLocaleString('zh-CN')
  }
  
  // 轮播箴言
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % dailyQuotes.length)
    }, 4000) // 每4秒切换一次
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-4 mb-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255,245,235,0.9) 0%, rgba(254,235,200,0.9) 50%, rgba(255,237,213,0.9) 100%)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)'
      }}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/25 to-yellow-200/25 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-200/25 to-orange-200/25 rounded-full blur-xl" />
      
      <div className="relative">
        {/* 上半部分：标题和主要数据 */}
        <div className="flex items-center justify-between mb-3">
          {/* 左侧：标题和天数 */}
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center mb-1"
            >
              <Heart className="w-4 h-4 text-rose-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-700">生命日记</h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                {formatNumber(daysLived)}
              </div>
              <p className="text-sm text-gray-600 font-medium">天的生命旅程</p>
            </motion.div>
          </div>
          
          {/* 右侧：Today is a Gift 和里程碑 */}
          <div className="flex flex-col items-end gap-2">
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 font-medium rounded-full text-xs border border-orange-200/50">
                Today is a Gift
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center text-gray-600"
            >
              <Calendar className="w-3 h-3 mr-1" />
              <span className="text-xs">
                距离里程碑还有 <span className="font-semibold text-orange-600">{formatNumber(daysToMilestone)}</span> 天
              </span>
            </motion.div>
          </div>
        </div>
        
        {/* 下半部分：每日箴言轮播 */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="relative border-t border-white/20 pt-2"
        >
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-gray-500 text-sm italic font-light text-center leading-relaxed"
              >
                {dailyQuotes[currentQuoteIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          {/* 轮播指示器 */}
          <div className="flex justify-center space-x-1 mt-1">
            {dailyQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentQuoteIndex 
                    ? 'bg-orange-400 w-4' 
                    : 'bg-orange-200 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TenThousandDaysCountdownEnhanced
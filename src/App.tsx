import { useState, useEffect } from 'react'
import './App.css'
import TenThousandDaysCountdownEnhanced from './components/TenThousandDaysCountdownEnhanced'
import NavigationSystemEnhanced from './components/NavigationSystemEnhanced'
import ExecutionCenter from './components/ExecutionCenter'
import GoalSystem from './components/GoalSystem'
import ResourceSystem from './components/ResourceSystem'
import DeepAnalysisNav from './components/DeepAnalysisNav'
import { getLastUpdateTime } from './services/dataLoader'
import { motion } from 'framer-motion'

function App() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null)

  useEffect(() => {
    const fetchUpdateTime = async () => {
      const lastUpdate = await getLastUpdateTime()
      setLastUpdatedTime(lastUpdate)
    }

    fetchUpdateTime()
  }, [])

  // 设置您的生日和目标日期
  const birthDate = '1987-08-25'
  const targetDate = '2052-11-29'

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 背景装饰元素 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* 主容器 - 使用全宽度 */}
      <div className="relative z-10 w-full px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        {/* 模块1：10000天倒计时 - 全宽度 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full mb-12"
        >
          <TenThousandDaysCountdownEnhanced birthDate={birthDate} targetDate={targetDate} />
        </motion.div>
        
        {/* 主要内容区域 - 使用全宽度 */}
        <div className="w-full space-y-12">
          {/* 模块2：导向系统 - 价值观与目标 */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <NavigationSystemEnhanced />
          </motion.section>
          
          {/* 模块3：执行中心 - 今天做什么？ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center justify-center">
              <span className="mr-3 text-3xl">🎯</span> 
              <span>执行中心 - "今天做什么？"</span>
            </h2>
            <ExecutionCenter />
          </motion.section>
          
          {/* 模块4：目标系统 - 全宽度 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full"
          >
            <GoalSystem />
          </motion.section>
          
          {/* 模块5：资源系统 - 全宽度 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full"
          >
            <ResourceSystem />
          </motion.section>
          
          {/* 底部导航：深度分析 - 全宽度 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full mt-16"
          >
            <DeepAnalysisNav />
          </motion.section>
        </div>
        
        {/* 页脚 */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-full mt-24 py-8 text-center border-t border-gray-200"
        >
          <div className="text-sm text-gray-500">
            最后同步：{lastUpdatedTime ?? '加载中...'} | 数据来源：Notion API
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default App

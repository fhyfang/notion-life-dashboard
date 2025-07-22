import { useState, useEffect } from 'react'
import './App.css'
import LifeTimerEnhanced from './components/LifeTimerEnhanced'
import NavigationSystem from './components/NavigationSystem'
import ActionSystem from './components/ActionSystem'
import GoalSystem from './components/GoalSystem'
import ResourceSystem from './components/ResourceSystem'
import DeepAnalysis from './components/DeepAnalysis'
import DashboardLayout from './components/DashboardLayout'
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

  // 设置您的生日（请根据实际情况修改）
  const birthDate = '1990-01-01'

  return (
    <DashboardLayout 
      title="生命仪表板"
      subtitle="让每一天都充满意义"
    >
      {/* 生命计时器 */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <LifeTimerEnhanced birthDate={birthDate} />
      </div>
      
      <div className="space-y-8">
        {/* 核心系统网格布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NavigationSystem />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ActionSystem />
          </motion.div>
        </div>
        
        {/* 目标系统 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GoalSystem />
        </motion.div>
        
        {/* 底部网格布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ResourceSystem />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <DeepAnalysis />
          </motion.div>
        </div>
      </div>
      
      {/* 页脚 */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 pb-8 text-center"
      >
        <div className="text-sm text-gray-500">
          最后同步：{lastUpdatedTime ?? '加载中...'} | 数据来源：Notion API
        </div>
      </motion.footer>
    </DashboardLayout>
  )
}

export default App

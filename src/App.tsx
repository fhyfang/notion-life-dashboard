import { useState, useEffect } from 'react'
import './App.css'
import LifeTimer from './components/LifeTimer'
import NavigationSystem from './components/NavigationSystem'
import ActionSystem from './components/ActionSystem'
import GoalSystem from './components/GoalSystem'
import ResourceSystem from './components/ResourceSystem'
import DeepAnalysis from './components/DeepAnalysis'
import { getLastUpdateTime } from './services/dataLoader'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null)

  useEffect(() => {
    const fetchUpdateTime = async () => {
      const lastUpdate = await getLastUpdateTime()
      setLastUpdatedTime(lastUpdate)
    }

    fetchUpdateTime()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 生命计时器 */}
      <LifeTimer currentTime={currentTime} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* 导向系统 */}
        <NavigationSystem />
        
        {/* 行动系统 */}
        <ActionSystem />
        
        {/* 目标系统 */}
        <GoalSystem />
        
        {/* 资源系统 */}
        <ResourceSystem />
        
        {/* 深度分析 */}
        <DeepAnalysis />
      </div>
      
      {/* 页脚 */}
      <footer className="bg-white border-t mt-12 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          最后同步：{lastUpdatedTime ?? '加载中...'} | 数据来源：Notion API
        </div>
      </footer>
    </div>
  )
}

export default App

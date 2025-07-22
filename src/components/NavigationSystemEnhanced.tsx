import { Compass, Target, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData } from '../services/dataLoader'
import { motion } from 'framer-motion'

interface ValueItem {
  name: string
  description: string
  priority: number
  icon: string
}

interface GoalItem {
  name: string
  linkedValues: string[]
  progress: number
  weeklyHours: number
  deadline: string
  status: string
}

// interface MetricItem {
//   name: string
//   value: number
//   color: string
//   bgColor: string
//   icon: any
//   description: string
// }

const NavigationSystemEnhanced = () => {
  const [values, setValues] = useState<ValueItem[]>([])
  const [goals, setGoals] = useState<GoalItem[]>([])
  const [currentValueIndex, setCurrentValueIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  // const [selectedTab, setSelectedTab] = useState('完成进度情况')

  useEffect(() => {
    const fetchData = async () => {
      // 获取价值观数据 - 只显示优先级4或5的核心价值观
      const valuesData = await getDatabaseData('价值观')
      const coreValues = valuesData
        .filter((item: any) => {
          const priorityName = item.properties["优先级"]?.select?.name || '0分'
          const priority = parseInt(priorityName.replace('分', ''))
          return priority >= 4
        })
        .map((item: any) => ({
          name: item.properties["价值观名称"]?.title[0]?.plain_text || '未命名',
          description: item.properties["核心描述"]?.rich_text[0]?.plain_text || '',
          priority: parseInt(item.properties["优先级"]?.select?.name?.replace('分', '') || '0'),
          icon: item.icon?.emoji || '🎯'
        }))
      setValues(coreValues)
      
      // 获取目标数据 - 本季/本年核心目标
      const goalsData = await getDatabaseData('目标库')
      const activeGoals = goalsData
        .filter((item: any) => {
          const status = item.properties["状态"]?.status?.name
          return status === '进行中' || status === 'In Progress'
        })
        .slice(0, 4) // 只显示前4个目标
        .map((item: any) => ({
          name: item.properties["理想状态"]?.title[0]?.plain_text?.trim() || '未命名目标',
          linkedValues: item.properties["关联价值观"]?.relation?.map((r: any) => r.id) || [],
          progress: item.properties["目标进度"]?.rollup?.number || 0,
          weeklyHours: 0, // 需要从项目库汇总
          deadline: item.properties["截止日期"]?.date?.start || '',
          status: item.properties["状态"]?.status?.name || ''
        }))
      setGoals(activeGoals)
      setLoading(false)
    }

    fetchData().catch(() => setLoading(false))
  }, [])

  // 自动轮播价值观
  useEffect(() => {
    if (values.length > 0) {
      const interval = setInterval(() => {
        setCurrentValueIndex((prev) => (prev + 1) % values.length)
      }, 5000) // 每5秒切换
      return () => clearInterval(interval)
    }
  }, [values.length])

  if (loading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 模块1：我的价值观与北极星 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1 bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center mb-4">
          <Compass className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">我的价值观与北极星</h3>
        </div>
        
        {values.length > 0 && (
          <motion.div
            key={currentValueIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="text-center py-4">
              <div className="text-4xl mb-3">{values[currentValueIndex].icon}</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {values[currentValueIndex].name}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {values[currentValueIndex].description}
              </p>
            </div>
            
            {/* 轮播指示器 */}
            <div className="flex justify-center space-x-2">
              {values.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentValueIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentValueIndex 
                      ? 'bg-indigo-600 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 模块2：本季/本年核心目标 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-3 bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold">本季/本年核心目标</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800 flex-1">{goal.name}</h4>
                <span className="text-sm font-semibold text-green-600">{goal.progress}%</span>
              </div>
              
              <div className="space-y-2">
                {/* 进度条 */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                
                {/* 元信息 */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{goal.weeklyHours}h/周</span>
                  </div>
                  {goal.deadline && (
                    <span>截止: {new Date(goal.deadline).toLocaleDateString('zh-CN')}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default NavigationSystemEnhanced

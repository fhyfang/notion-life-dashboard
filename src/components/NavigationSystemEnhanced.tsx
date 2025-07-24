import { Compass, Target, Clock, RefreshCw, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData, refreshData } from '../services/dataLoader'
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
  category?: string
  linkedProjects?: string[]
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
  const [currentSafetyGoalIndex, setCurrentSafetyGoalIndex] = useState(0)
  const [currentLifeGoalIndex, setCurrentLifeGoalIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  // const [selectedTab, setSelectedTab] = useState('完成进度情况')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        
        // 获取价值观数据 - 只显示优先级4或5的核心价值观
        console.log('开始获取价值观数据...')
        const valuesData = await getDatabaseData('价值观')
        console.log('价值观原始数据:', valuesData)
        
        if (Array.isArray(valuesData)) {
          console.log('价值观数据是数组，长度:', valuesData.length)
          const coreValues = valuesData
            .filter((item: any) => {
              try {
                const priorityName = item?.properties?.["优先级"]?.select?.name || '0分'
                const priority = parseInt(priorityName.replace('分', ''))
                console.log('价值观项目:', item?.properties?.["价值观名称"]?.title?.[0]?.plain_text, '优先级:', priority)
                return priority >= 4
              } catch (e) {
                console.warn('Error filtering value item:', item, e)
                return false
              }
            })
            .map((item: any) => {
              try {
                const valueItem = {
                  name: item?.properties?.["价值观名称"]?.title?.[0]?.plain_text || '未命名',
                  description: item?.properties?.["正面行为 (Do's)"]?.rich_text?.[0]?.plain_text || '',
                  priority: parseInt(item?.properties?.["优先级"]?.select?.name?.replace('分', '') || '0'),
                  icon: item?.icon?.emoji || '⭐'
                }
                console.log('处理后的价值观项目:', valueItem)
                return valueItem
              } catch (e) {
                console.warn('Error processing value item:', item, e)
                return null
              }
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
          console.log('最终核心价值观:', coreValues)
          setValues(coreValues)
        } else {
          console.warn('Values data is not an array:', valuesData)
          setValues([])
        }
        
        // 获取目标数据 - 本季/本年核心目标
        console.log('开始获取目标数据...')
        const goalsData = await getDatabaseData('目标库')
        console.log('目标库原始数据:', goalsData)
        
        // 获取项目数据用于关联
        const projectsData = await getDatabaseData('项目库')
        console.log('项目库原始数据:', projectsData)
        
        // 创建项目ID到项目名称的映射
        const projectMap = new Map()
        if (Array.isArray(projectsData)) {
          projectsData.forEach((project: any) => {
            const projectId = project?.id
            const projectName = project?.properties?.["项目名称"]?.title?.[0]?.plain_text || '未命名项目'
            if (projectId) {
              projectMap.set(projectId, projectName)
            }
          })
        }
        
        if (Array.isArray(goalsData)) {
          console.log('目标数据是数组，长度:', goalsData.length)
          
          const activeGoals = goalsData
            .filter((item: any) => {
              try {
                // 检查目标是否有效（有标题且未归档）
                return item?.properties?.["理想状态"]?.title?.[0]?.plain_text && !item?.archived
              } catch (e) {
                console.warn('Error filtering goal item:', item, e)
                return false
              }
            })
            .slice(0, 4) // 只显示前4个目标
            .map((item: any) => {
              try {
                // 获取关联项目的名称
                const linkedProjectIds = item?.properties?.["关联项目"]?.relation?.map((r: any) => r.id) || []
                const linkedProjectNames = linkedProjectIds.map((id: string) => projectMap.get(id)).filter(Boolean)
                
                const domain = item?.properties?.["领域"]?.select?.name || '未分类';
                console.log('目标领域:', domain)
                
                const goalItem = {
                  name: (item?.properties?.["理想状态"]?.title?.[0]?.plain_text || '未命名目标').replace(/\n/g, '').trim(),
                  linkedValues: item?.properties?.["关联价值观"]?.relation?.map((r: any) => r.id) || [],
                  progress: item?.properties?.["目标进度"]?.rollup?.number || 0,
                  weeklyHours: item?.properties?.["每周投入时间"]?.number || 0,
                  deadline: item?.properties?.["截止日期"]?.date?.start || '',
                  status: '进行中', // 默认状态，因为目标数据中没有状态字段
                  category: (() => {
                    if (domain === '职业发展' || domain === '技能提升' || domain === '财务管理') {
                      return '安全建构核';
                    } else if (domain === '兴趣娱乐' || domain === '健康生活' || domain === '人际关系') {
                      return '生命滋养核';
                    }
                    return '生命滋养核'; // 默认分类到生命滋养核
                  })(),
                  linkedProjects: linkedProjectNames
                }
                console.log('处理后的目标:', goalItem)
                return goalItem
              } catch (e) {
                console.warn('Error processing goal item:', item, e)
                return null
              }
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
          console.log('最终目标列表:', activeGoals)
          setGoals(activeGoals)
        } else {
          console.warn('Goals data is not an array:', goalsData)
          setGoals([])
        }
        
      } catch (error) {
        console.error('Error fetching navigation data:', error)
        setError('数据加载失败，请检查网络连接或刷新页面重试')
        setValues([])
        setGoals([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshKey])

  // 自动轮播价值观
  useEffect(() => {
    if (values.length > 0) {
      const interval = setInterval(() => {
        setCurrentValueIndex((prev) => (prev + 1) % values.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [values.length])

  // 自动轮播目标
  useEffect(() => {
    const safetyGoals = goals.filter(goal => goal.category === '安全建构核')
    const lifeGoals = goals.filter(goal => goal.category === '生命滋养核')
    
    if (safetyGoals.length > 0) {
      const interval = setInterval(() => {
        setCurrentSafetyGoalIndex((prev) => (prev + 1) % safetyGoals.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [goals])

  useEffect(() => {
    const lifeGoals = goals.filter(goal => goal.category === '生命滋养核')
    
    if (lifeGoals.length > 0) {
      const interval = setInterval(() => {
        setCurrentLifeGoalIndex((prev) => (prev + 1) % lifeGoals.length)
      }, 4500)
      return () => clearInterval(interval)
    }
  }, [goals])

  const handleRefresh = async () => {
    setLoading(true)
    await refreshData()
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-48"></div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-800">数据加载失败</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          重新加载
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* 模块1：我的价值观与北极星 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/90 transition-all duration-300"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">北极星</h3>
        </div>
        
        {values.length > 0 ? (
          <motion.div
            key={currentValueIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="text-center py-6">
              <h4 className="text-base font-semibold text-gray-800 px-1 leading-tight">
                {values[currentValueIndex].name}
              </h4>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">暂无价值观数据</p>
          </div>
        )}
      </motion.div>

      {/* 模块2：本季/本年核心目标 - 两个并列的列表视图 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/90 transition-all duration-300"
      >
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">本季/本年核心目标</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6 h-48">
          {/* 安全建构核 */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-800 mb-3 text-center">🛡️ 安全建构核</h3>
            {(() => {
              const safetyGoals = goals.filter(goal => goal.category === '安全建构核')
              if (safetyGoals.length === 0) {
                return <div className="text-center text-gray-500 py-8">暂无目标</div>
              }
              const currentGoal = safetyGoals[currentSafetyGoalIndex]
              return (
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 leading-tight">{currentGoal.name}</h4>
                    {currentGoal.linkedProjects && currentGoal.linkedProjects.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        <p className="font-medium">关联项目:</p>
                        <div className="space-y-1">
                          {currentGoal.linkedProjects.map((projectName: string, index: number) => (
                            <p key={index} className="text-xs bg-blue-100 px-2 py-1 rounded">{projectName}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>进度:</span>
                      <span className="font-medium">{currentGoal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${currentGoal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>本周投入:</span>
                      <span className="font-medium">{currentGoal.weeklyHours}h</span>
                    </div>
                  </div>
                  {safetyGoals.length > 1 && (
                    <div className="flex justify-center space-x-1 mt-3">
                      {safetyGoals.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentSafetyGoalIndex ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
          
          {/* 生命滋养核 */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-medium text-green-800 mb-3 text-center">🌱 生命滋养核</h3>
            {(() => {
              const lifeGoals = goals.filter(goal => goal.category === '生命滋养核')
              if (lifeGoals.length === 0) {
                return <div className="text-center text-gray-500 py-8">暂无目标</div>
              }
              const currentGoal = lifeGoals[currentLifeGoalIndex]
              return (
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="font-medium text-gray-800 leading-tight">{currentGoal.name}</h4>
                    {currentGoal.linkedProjects && currentGoal.linkedProjects.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        <p className="font-medium">关联项目:</p>
                        <div className="space-y-1">
                          {currentGoal.linkedProjects.map((projectName: string, index: number) => (
                            <p key={index} className="text-xs bg-green-100 px-2 py-1 rounded">{projectName}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>进度:</span>
                      <span className="font-medium">{currentGoal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${currentGoal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>本周投入:</span>
                      <span className="font-medium">{currentGoal.weeklyHours}h</span>
                    </div>
                  </div>
                  {lifeGoals.length > 1 && (
                    <div className="flex justify-center space-x-1 mt-3">
                      {lifeGoals.map((_, index) => (
                        <div 
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentLifeGoalIndex ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default NavigationSystemEnhanced
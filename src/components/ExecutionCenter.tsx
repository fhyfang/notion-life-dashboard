import { CheckCircle, Circle, Clock, Activity, Heart, Brain, Dumbbell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData } from '../services/dataLoader'
import { motion } from 'framer-motion'

interface Task {
  id: string
  title: string
  priority: number
  deadline: string
  status: string
  type: string
}

interface LogEntry {
  id: string
  startTime: string
  endTime: string
  activity: string
  duration: number
  valueScore: number
}

interface Vitals {
  mood: number
  energy: number
  sleep: number
  meditation: number
  exercise: number
}

interface Goal {
  name: string
  progress: number
  timeSpan: string
}

const ExecutionCenter = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [vitals, setVitals] = useState<Vitals>({
    mood: 0,
    energy: 0,
    sleep: 0,
    meditation: 0,
    exercise: 0
  })
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // 获取今日行动
      const actionData = await getDatabaseData('行动库')
      const todayTasks = actionData
        .filter((item: any) => {
          const status = item.properties["状态"]?.status?.name
          const deadline = item.properties["截止日期"]?.date?.start
          return status !== '已完成' && deadline // 只显示未完成且有截止日期的任务
        })
        .map((item: any) => ({
          id: item.id,
          title: item.properties["行动描述"]?.title[0]?.plain_text || '未命名任务',
          priority: parseInt(item.properties["优先级"]?.select?.name || '0'),
          deadline: item.properties["截止日期"]?.date?.start || '',
          status: item.properties["状态"]?.status?.name || '',
          type: item.properties["行动类型"]?.select?.name || '其他'
        }))
        .sort((a: Task, b: Task) => b.priority - a.priority) // 按优先级排序
      setTasks(todayTasks)
      
      // 获取今日日志
      const logsData = await getDatabaseData('每日日志')
      const todayLogs = logsData
        .filter((item: any) => {
          const date = item.properties["日期"]?.date?.start
          return date && new Date(date).toDateString() === new Date().toDateString()
        })
        .map((item: any) => ({
          id: item.id,
          startTime: item.properties["开始时间"]?.date?.start || '',
          endTime: item.properties["结束时间"]?.date?.start || '',
          activity: item.properties["活动名称"]?.title[0]?.plain_text || '',
          duration: item.properties["实际时长"]?.number || 0,
          valueScore: item.properties["价值评分"]?.number || 0
        }))
        .sort((a: LogEntry, b: LogEntry) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        )
      setLogs(todayLogs)
      
      // 获取生命体征数据
      const healthData = await getDatabaseData('健康日记')
      const emotionData = await getDatabaseData('情绪记录')
      
      // 获取目标数据
      const goalsData = await getDatabaseData('目标库')
      const currentYear = new Date().getFullYear()
      const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3)
      
      const activeGoals = goalsData
        .filter((item: any) => {
          const status = item.properties["状态"]?.status?.name
          const timeSpan = item.properties["时间跨度"]?.select?.name
          // 只显示进行中的、本年或本季度的目标
          return (status === '进行中' || status === 'In Progress') && 
                 (timeSpan === `${currentYear}年` || 
                  timeSpan === `${currentYear}Q${currentQuarter}` ||
                  timeSpan === '本年' || 
                  timeSpan === '本季' ||
                  timeSpan === '季度目标')
        })
        .map((item: any) => ({
          name: item.properties["理想状态"]?.title[0]?.plain_text || '未命名目标',
          progress: Math.round((item.properties["目标进度"]?.rollup?.number || 0) * 100),
          timeSpan: item.properties["时间跨度"]?.select?.name || ''
        }))
        .slice(0, 3) // 只显示前3个目标
      
      setGoals(activeGoals)
      
      // 获取最新的健康数据
      if (healthData.length > 0) {
        const latestHealth = healthData[0]
        setVitals(prev => ({
          ...prev,
          sleep: latestHealth.properties["睡眠评分"]?.number || 0,
          exercise: latestHealth.properties["运动评分"]?.number || 0,
          meditation: latestHealth.properties["冥想评分"]?.number || 0
        }))
      }
      
      // 获取最新的情绪数据
      if (emotionData.length > 0) {
        const latestEmotion = emotionData[0]
        setVitals(prev => ({
          ...prev,
          mood: latestEmotion.properties["情绪评分"]?.number || 0,
          energy: latestEmotion.properties["精力水平"]?.number || 0
        }))
      }
      
      setLoading(false)
    }

    fetchData().catch(() => setLoading(false))
  }, [])

  const toggleTaskStatus = (taskId: string) => {
    // 这里应该调用API更新任务状态
    console.log('Toggle task:', taskId)
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-100 rounded-lg h-96"></div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 左栏：今日行动 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1 bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 text-blue-600 mr-2" />
          今日行动
        </h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">暂无今日任务</p>
          ) : (
            tasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => toggleTaskStatus(task.id)}
              >
                <div className="mt-1">
                  {task.status === '已完成' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${task.status === '已完成' ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span className={`px-2 py-0.5 rounded-full ${
                      task.priority >= 4 ? 'bg-red-100 text-red-700' :
                      task.priority >= 3 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      P{task.priority}
                    </span>
                    <span className="ml-2">{task.type}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* 中栏：日志流 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-2 bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 text-green-600 mr-2" />
          日志流
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">今日还未开始记录</p>
          ) : (
            logs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="border-l-4 border-green-500 pl-4 py-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{log.activity}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(log.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        {log.endTime && ` - ${new Date(log.endTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{log.duration}分钟</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      价值 {log.valueScore}/5
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* 右栏：生命体征 */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-1 bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 text-red-600 mr-2" />
          生命体征
        </h3>
        
        <div className="space-y-4">
          {/* 今日心情 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">今日心情</span>
              <span className="text-sm font-semibold">{vitals.mood}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full"
                style={{ width: `${vitals.mood * 10}%` }}
              />
            </div>
          </div>

          {/* 今日精力 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">今日精力</span>
              <span className="text-sm font-semibold">{vitals.energy}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full"
                style={{ width: `${vitals.energy * 10}%` }}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            {/* 睡眠评分 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                  💤
                </div>
                <span>睡眠质量</span>
              </div>
              <span className="text-lg font-semibold text-blue-600">{vitals.sleep}/10</span>
            </div>

            {/* 冥想评分 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <span>冥想评分</span>
              </div>
              <span className="text-lg font-semibold text-purple-600">{vitals.meditation}/10</span>
            </div>

            {/* 运动评分 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                  <Dumbbell className="w-4 h-4 text-green-600" />
                </div>
                <span>运动评分</span>
              </div>
              <span className="text-lg font-semibold text-green-600">{vitals.exercise}/10</span>
            </div>
          </div>
          
          {/* 目标进度 */}
          {goals.length > 0 && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">核心目标</h4>
              {goals.map((goal, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-600 flex-1 mr-2">{goal.name}</span>
                    <span className="text-xs font-semibold text-indigo-600">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{goal.timeSpan}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ExecutionCenter

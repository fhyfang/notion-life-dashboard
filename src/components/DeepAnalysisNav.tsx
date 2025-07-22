import { Zap, Clock, TrendingUp, Heart, Brain, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalysisModule {
  id: string
  title: string
  subtitle: string
  icon: any
  color: string
  bgGradient: string
  link: string
}

const DeepAnalysisNav = () => {
  const modules: AnalysisModule[] = [
    {
      id: 'energy',
      title: '能量分析',
      subtitle: '我的能量系统如何运作？',
      icon: Zap,
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      link: '/analysis/energy'
    },
    {
      id: 'time',
      title: '时间分析',
      subtitle: '我的时间投入是否有效？',
      icon: Clock,
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100',
      link: '/analysis/time'
    },
    {
      id: 'skills',
      title: '能力提升分析',
      subtitle: '我的核心能力资产如何增长？',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      link: '/analysis/skills'
    },
    {
      id: 'relationships',
      title: '关系构建分析',
      subtitle: '如何更有效地利用外部杠杆？',
      icon: Heart,
      color: 'text-red-600',
      bgGradient: 'from-red-50 to-red-100',
      link: '/analysis/relationships'
    },
    {
      id: 'metalearning',
      title: '元认知提升',
      subtitle: '我是否在持续从经验中学习？',
      icon: Brain,
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      link: '/analysis/metalearning'
    },
    {
      id: 'weekly',
      title: '周度复盘',
      subtitle: '上周发生了什么？下周做什么？',
      icon: FileText,
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      link: '/analysis/weekly'
    }
  ]

  const handleNavigation = (link: string) => {
    // 这里应该处理导航逻辑
    console.log('Navigate to:', link)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6 text-center">深度分析</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {modules.map((module, index) => {
          const Icon = module.icon
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation(module.link)}
              className="cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${module.bgGradient} rounded-lg p-4 text-center hover:shadow-lg transition-all duration-200`}>
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <h4 className="text-sm font-semibold text-gray-800 mb-1">{module.title}</h4>
                <p className="text-xs text-gray-500 mt-1 overflow-hidden">{module.subtitle}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default DeepAnalysisNav

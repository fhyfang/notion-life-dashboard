import { TrendingUp, Clock, Zap, Target, Heart, FileText } from 'lucide-react'

interface AnalysisCard {
  title: string
  icon: any
  color: string
  description: string
}

const DeepAnalysis = () => {
  const analysisCards: AnalysisCard[] = [
    { title: '能量分析', icon: Zap, color: 'bg-blue-100 text-blue-600', description: '能量分配与恢复' },
    { title: '时间分析', icon: Clock, color: 'bg-green-100 text-green-600', description: '时间使用与效率' },
    { title: '能力提升分析', icon: TrendingUp, color: 'bg-purple-100 text-purple-600', description: '技能成长轨迹' },
    { title: '关系构建分析', icon: Heart, color: 'bg-red-100 text-red-600', description: '人际网络质量' },
    { title: '成就回顾分析', icon: Target, color: 'bg-yellow-100 text-yellow-600', description: '目标达成情况' },
    { title: '周周复盘', icon: FileText, color: 'bg-indigo-100 text-indigo-600', description: '每周总结回顾' }
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">深度分析</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {analysisCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded-lg p-4 text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        最后同步：7/20/2025, 3:31:45 PM | 数据源：Notion API
      </div>
    </div>
  )
}

export default DeepAnalysis

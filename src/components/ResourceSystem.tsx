import { Database, Users, DollarSign, Book } from 'lucide-react'

interface Resource {
  name: string
  value: string | number
  unit: string
  icon: any
  trend?: string
}

const ResourceSystem = () => {
  const resources: Resource[] = [
    { name: '关系', value: 5, unit: '核心圈层', icon: Users, trend: '稳定' },
    { name: '财务', value: '¥15.0k', unit: '月收入', icon: DollarSign, trend: '+12.5%' },
    { name: '知识库', value: 156, unit: '总条目数', icon: Book, trend: '+7个' },
    { name: '资源系统', value: 89, unit: '已整理', icon: Database, trend: '23%' }
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">资源系统</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resources.map((resource, index) => {
          const Icon = resource.icon
          return (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{resource.value}</div>
              <div className="text-xs text-gray-600">{resource.unit}</div>
              {resource.trend && (
                <div className="text-xs text-green-600 mt-1">{resource.trend}</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-600">社交媒体</div>
          <div className="text-xl font-bold">25人</div>
          <div className="text-xs text-gray-500">活跃互动</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">信誉率</div>
          <div className="text-xl font-bold">43%</div>
          <div className="text-xs text-gray-500">投资收益</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">实践应用</div>
          <div className="text-xl font-bold">23次</div>
          <div className="text-xs text-gray-500">本月新增</div>
        </div>
      </div>
    </div>
  )
}

export default ResourceSystem

import { Database, Users, DollarSign, Book } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData } from '../services/dataLoader'

// interface Resource {
//   name: string
//   value: string | number
//   unit: string
//   icon: any
//   trend?: string
// }

const ResourceSystem = () => {
  const [relationshipsCount, setRelationshipsCount] = useState(0);
  const [knowledgeCount, setKnowledgeCount] = useState(0);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [interactionData, setInteractionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchResourceData = async () => {
      // 获取关系网数据
      const relationships = await getDatabaseData('关系网');
      setRelationshipsCount(relationships.length);

      // 获取知识库数据
      const knowledge = await getDatabaseData('知识库');
      setKnowledgeCount(knowledge.length);

      // 获取财务记录数据
      const financial = await getDatabaseData('财务记录');
      setFinancialData(financial);

      // 获取互动记录数据
      const interactions = await getDatabaseData('互动记录');
      setInteractionData(interactions);
    };

    fetchResourceData();
  }, []);

  // Commented out for now - not used in current implementation
  // const resources: Resource[] = [
  //   { name: '关系', value: relationshipsCount, unit: '人脉连接', icon: Users, trend: '稳定' },
  //   { name: '财务', value: '¥15.0k', unit: '月收入', icon: DollarSign, trend: '+12.5%' },
  //   { name: '知识库', value: knowledgeCount, unit: '总条目数', icon: Book, trend: `+${Math.floor(knowledgeCount * 0.05)}个` },
  //   { name: '资源系统', value: 89, unit: '已整理', icon: Database, trend: '23%' }
  // ]

  // 计算关系圈层
  const coreCircle = relationshipsCount > 0 ? Math.min(5, relationshipsCount) : 0
  const collaborationCircle = relationshipsCount > 5 ? Math.min(20, relationshipsCount - 5) : 0
  const socialCircle = relationshipsCount > 25 ? relationshipsCount - 25 : 0
  
  // 计算财务指标
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  // 从财务数据中计算本月收入和支出
  let monthlyIncome = 0
  let monthlyExpense = 0
  
  financialData.forEach(item => {
    const date = item.properties["日期"]?.date?.start
    const amount = item.properties["金额"]?.number || 0
    const type = item.properties["类型"]?.select?.name
    
    if (date) {
      const itemDate = new Date(date)
      if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
        if (type === '收入') {
          monthlyIncome += amount
        } else if (type === '支出') {
          monthlyExpense += amount
        }
      }
    }
  })
  
  // 如果没有数据，使用默认值
  monthlyIncome = monthlyIncome || 15000
  monthlyExpense = monthlyExpense || 12000
  
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome * 100).toFixed(1) : '0'
  const investmentReturn = 12.5 // 这个需要根据实际投资收益计算
  
  // 计算知识库指标
  const masteredCount = Math.floor(knowledgeCount * 0.3) // 假设30%已掌握
  const weeklyNew = Math.floor(knowledgeCount * 0.05) // 假设每周新增5%
  const practicalApps = interactionData.length // 使用互动记录作为实践应用

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Database className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold">资源系统</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 子模块 5.1: 关系 (Relationships) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">关系</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">核心圈层</span>
              <span className="text-lg font-bold text-blue-600">{coreCircle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">协作圈层</span>
              <span className="text-lg font-bold text-green-600">{collaborationCircle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">社交圈层</span>
              <span className="text-lg font-bold text-purple-600">{socialCircle}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">本周互动</span>
                <span className="text-sm font-semibold text-orange-600">{interactionData.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 子模块 5.2: 财务 (Finances) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold">财务</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">月收入</span>
              <span className="text-lg font-bold text-green-600">¥{(monthlyIncome/1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">月支出</span>
              <span className="text-lg font-bold text-red-600">¥{(monthlyExpense/1000).toFixed(1)}k</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">储蓄率</span>
              <span className="text-lg font-bold text-blue-600">{savingsRate}%</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">投资收益</span>
                <span className="text-sm font-semibold text-green-600">+{investmentReturn}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 子模块 5.3: 知识库 (Knowledge Base) */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Book className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold">知识库</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">总概念数</span>
              <span className="text-lg font-bold text-purple-600">{knowledgeCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">已掌握</span>
              <span className="text-lg font-bold text-green-600">{masteredCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">本周新增</span>
              <span className="text-lg font-bold text-blue-600">{weeklyNew}</span>
            </div>
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">实践应用</span>
                <span className="text-sm font-semibold text-orange-600">{practicalApps}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceSystem

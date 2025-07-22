import { Flag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDatabaseData } from '../services/dataLoader'
import { motion } from 'framer-motion'

interface Goal {
  name: string
  progress: number
  deadline: string
  remainingDays: number
}

const GoalSystem = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const data = await getDatabaseData('目标库');
      const loadedGoals = data.map((item: any) => {
        const deadline = item.properties["截止日期"]?.date?.start || '';
        const remainingDays = deadline ? Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;
        // const progress = item.properties["进度"]?.number || 0;
        
        return {
          name: item.properties["理想状态"]?.title[0]?.plain_text || '未命名目标',
          progress: item.properties["目标进度"]?.rollup?.number || 0,
          deadline: deadline,
          remainingDays: Math.max(0, remainingDays)
        };
      });
      setGoals(loadedGoals);
    };

    fetchGoals();
  }, []);

  return (
    <div className="w-full bg-white shadow-lg rounded-2xl p-8">
      <div className="flex items-center justify-center mb-8">
        <Flag className="w-6 h-6 text-amber-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">目标系统</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {goals.map((goal, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{goal.name}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">进度</span>
                  <span className="text-lg font-bold text-amber-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {goal.deadline && (
                    <>
                      <span className="block">截止: {new Date(goal.deadline).toLocaleDateString('zh-CN')}</span>
                      <span className="block font-medium text-gray-800">
                        {goal.remainingDays > 0 ? `剩余 ${goal.remainingDays} 天` : '已过期'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default GoalSystem


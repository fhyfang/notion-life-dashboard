import { Zap, Clock, Star, Users, Bot, FileText, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

type Page = 'dashboard' | 'energy' | 'time' | 'skills' | 'relationships' | 'metalearning' | 'weekly';

interface AnalysisModule {
  id: Page;
  title: string
  icon: React.ElementType
  bg: string
  border: string
  text: string
}

interface DeepAnalysisNavProps {
  onNavigate: (page: Page) => void;
}

const modules: AnalysisModule[] = [
  { id: 'energy', title: '能量分析', icon: Zap, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  { id: 'time', title: '时间分析', icon: Clock, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
  { id: 'skills', title: '能力提升分析', icon: Star, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
  { id: 'relationships', title: '关系构建分析', icon: Users, bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600' },
  { id: 'metalearning', title: '元认知提升', icon: Bot, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  { id: 'weekly', title: '周度复盘', icon: FileText, bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
];

const DeepAnalysisNav: React.FC<DeepAnalysisNavProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center mb-2">
        <BarChart3 className="w-5 h-5 text-gray-700 mr-2" />
        <h3 className="text-lg font-bold text-gray-800">深度分析</h3>
      </div>
      <div className="mb-6 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-cyan-400 rounded-full" />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer text-center p-4 rounded-xl border transition-all duration-200 ${module.bg} ${module.border} hover:shadow-lg`}
            onClick={() => onNavigate(module.id)}
          >
            <div className="flex flex-col items-center justify-center h-full">
                <module.icon className={`w-7 h-7 mb-2 ${module.text}`} />
                <h4 className={`text-sm font-semibold ${module.text}`}>{module.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DeepAnalysisNav;

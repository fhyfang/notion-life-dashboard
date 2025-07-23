import { Zap, Clock, Star, Heart, Brain, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

type Page = 'dashboard' | 'energy' | 'time' | 'skills' | 'relationships' | 'metalearning' | 'weekly';

interface AnalysisModule {
  id: Page;
  title: string
  icon: React.ElementType
  bg: string
  color: string
}

interface DeepAnalysisNavProps {
  onNavigate: (page: Page) => void;
}

const modules: AnalysisModule[] = [
  { id: 'energy', title: '能量分析', icon: Zap, bg: 'bg-blue-100', color: 'text-blue-600' },
  { id: 'time', title: '时间分析', icon: Clock, bg: 'bg-green-100', color: 'text-green-600' },
  { id: 'skills', title: '能力提升分析', icon: Star, bg: 'bg-purple-100', color: 'text-purple-600' },
  { id: 'relationships', title: '关系构建分析', icon: Heart, bg: 'bg-red-100', color: 'text-red-600' },
  { id: 'metalearning', title: '元认知提升', icon: Brain, bg: 'bg-orange-100', color: 'text-orange-600' },
  { id: 'weekly', title: '周度复盘', icon: FileText, bg: 'bg-indigo-100', color: 'text-indigo-600' },
];

const DeepAnalysisNav: React.FC<DeepAnalysisNavProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-center"
            onClick={() => onNavigate(module.id)}
          >
            <div className={`p-4 rounded-lg ${module.bg}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <module.icon className={`w-6 h-6 ${module.color}`} />
              </div>
              <h4 className="text-sm font-semibold text-gray-700">{module.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DeepAnalysisNav;

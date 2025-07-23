import { useState, useEffect, lazy, Suspense } from 'react';
import { getLastUpdateTime } from './services/dataLoader';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';

// 使用动态导入优化代码分割
const TenThousandDaysCountdownEnhanced = lazy(() => import('./components/TenThousandDaysCountdownEnhanced'));
const NavigationSystemEnhanced = lazy(() => import('./components/NavigationSystemEnhanced'));
const ExecutionCenter = lazy(() => import('./components/ExecutionCenter'));
const GoalSystem = lazy(() => import('./components/GoalSystem'));
const ResourceSystem = lazy(() => import('./components/ResourceSystem'));
const DeepAnalysisNav = lazy(() => import('./components/DeepAnalysisNav'));
const EnergyAnalysis = lazy(() => import('./components/EnergyAnalysis'));
const TimeAnalysis = lazy(() => import('./components/TimeAnalysis'));
const SkillsAnalysis = lazy(() => import('./components/SkillsAnalysis'));
const RelationshipsAnalysis = lazy(() => import('./components/RelationshipsAnalysis'));
const MetaLearningAnalysis = lazy(() => import('./components/MetaLearningAnalysis'));
const WeeklyReview = lazy(() => import('./components/WeeklyReview'));

type Page = 'dashboard' | 'energy' | 'time' | 'skills' | 'relationships' | 'metalearning' | 'weekly';

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">加载中...</span>
  </div>
);

function App() {
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    const fetchUpdateTime = async () => {
      const lastUpdate = await getLastUpdateTime();
      setLastUpdatedTime(lastUpdate);
    };
    fetchUpdateTime();
  }, []);

  const birthDate = '1987-08-25';
  const targetDate = '2052-11-29';

  const sections = [
    { id: 'countdown', Component: <TenThousandDaysCountdownEnhanced birthDate={birthDate} targetDate={targetDate} /> },
    { id: 'navigation', title: '导向系统', Component: <NavigationSystemEnhanced /> },
    { id: 'execution', title: '行动系统', Component: <ExecutionCenter /> },
    { id: 'goals', title: '目标系统', Component: <GoalSystem /> },
    { id: 'resources', title: '资源系统', Component: <ResourceSystem /> },
    { id: 'analysis', title: '深度分析', Component: <DeepAnalysisNav onNavigate={setCurrentPage} /> },
  ];

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return (
        <div className="space-y-8">
          {sections.map(({ id, title, Component }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {title && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-700">{title}</h2>
                  <div className="mt-2 h-1 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
                </div>
              )}
              {Component}
            </motion.div>
          ))}
        </div>
      );
    }
    if (currentPage === 'energy') return <EnergyAnalysis />;
    if (currentPage === 'time') return <TimeAnalysis />;
    if (currentPage === 'skills') return <SkillsAnalysis />;
    if (currentPage === 'relationships') return <RelationshipsAnalysis />;
    if (currentPage === 'metalearning') return <MetaLearningAnalysis />;
    if (currentPage === 'weekly') return <WeeklyReview />;

    return <div className="text-center p-8 bg-white rounded-lg shadow-sm"><h2 className="text-2xl font-bold">页面正在建设中...</h2><p>即将推出 {currentPage} 分析页面。</p></div>;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage !== 'dashboard' && (
          <motion.button
            onClick={() => setCurrentPage('dashboard')}
            className="mb-6 flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <Home className="w-4 h-4 mr-2" />
            返回主仪表盘
          </motion.button>
        )}
        <Suspense fallback={<LoadingSpinner />}>
          {renderContent()}
        </Suspense>
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mt-12 py-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <span>最后同步: {lastUpdatedTime ?? '加载中...'} | 数据来源: Notion API</span>
            <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> API连接正常</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;

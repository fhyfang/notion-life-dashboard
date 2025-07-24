import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Home, Heart, Calendar } from 'lucide-react';

// 使用动态导入优化代码分割
const TenThousandDaysCountdownEnhanced = lazy(() => import('./components/TenThousandDaysCountdownEnhanced'));
const NavigationSystemEnhanced = lazy(() => import('./components/NavigationSystemEnhanced'));
const ExecutionCenter = lazy(() => import('./components/ExecutionCenter'));
const GoalSystem = lazy(() => import('./components/GoalSystem'));
// const ResourceSystem = lazy(() => import('./components/ResourceSystem')); // 暂时注释掉，组件不存在
const DeepAnalysisNav = lazy(() => import('./components/DeepAnalysisNav'));
const EnergyAnalysis = lazy(() => import('./components/EnergyAnalysis'));
const TimeAnalysis = lazy(() => import('./components/TimeAnalysis'));
const WeeklyReview = lazy(() => import('./components/WeeklyReview'));
const SkillsAnalysis = lazy(() => import('./components/SkillsAnalysis'));
const RelationshipsAnalysis = lazy(() => import('./components/RelationshipsAnalysis'));
const MetaLearningAnalysis = lazy(() => import('./components/MetaLearningAnalysis'));
const DatabaseTest = lazy(() => import('./components/DatabaseTest'));
const DataDebugger = lazy(() => import('./components/DataDebugger'));


type Page = 'dashboard' | 'energy' | 'time' | 'skills' | 'relationships' | 'metalearning' | 'weekly' | 'database-test' | 'api-test';

// 加载组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <span className="ml-3 text-gray-600">加载中...</span>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // 每日箴言数据
  const dailyQuotes = [
    "今天，我如何与自己和世界温柔地连接？",
    "今天，我想体验什么样的感觉？"
  ];

  // 箴言轮播逻辑
  useState(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % dailyQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  const birthDate = '1987-08-25';
  const targetDate = '2052-11-29';

  // 计算生命天数
  const calculateDaysLived = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 计算距离目标天数
  const calculateDaysToTarget = () => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLived = calculateDaysLived();
  const daysToTarget = calculateDaysToTarget();

  const sections = [
    { id: 'navigation', title: '导向系统', Component: <NavigationSystemEnhanced /> },
    { id: 'execution', title: '行动系统', Component: <ExecutionCenter /> },
    { id: 'goals', title: '目标系统', Component: <GoalSystem /> },
    { id: 'analysis', title: '深度分析', Component: <DeepAnalysisNav onNavigate={setCurrentPage} /> },
  ];

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return (
        <div className="space-y-8">
          {/* 合并的价值观和生命日记模块 */}
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: 15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.01, 
              rotateX: -1,
              boxShadow: '0 25px 70px rgba(0,0,0,0.15)',
              transition: { duration: 0.3 }
            }}
            className="relative overflow-hidden rounded-3xl p-6 mb-8 transform-gpu"
            style={{
              background: 'linear-gradient(135deg, rgba(255,0,150,0.12) 0%, rgba(255,154,0,0.12) 25%, rgba(255,206,84,0.12) 50%, rgba(34,193,195,0.12) 75%, rgba(253,187,45,0.12) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.4)',
              perspective: '1000px',
              minHeight: '300px'
            }}
          >
            {/* 主要内容区域 */}
            <div className="h-full flex gap-6 p-4">
              {/* 左侧：价值观模块 - 调整宽度确保文字不换行 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-[3] rounded-2xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.6)'
                }}
              >
                <div className="text-left space-y-4 h-full flex flex-col justify-center">
                  <motion.p 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-sm font-medium text-gray-800 leading-relaxed whitespace-nowrap"
                  >
                    我，生而有价。我的行动是内在价值的表达，而非对价值的追寻。
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-sm font-medium text-gray-800 leading-relaxed whitespace-nowrap"
                  >
                    我，视关系为花园。我将用微小的、真实的连接去浇灌它，并允许它自然生长。
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-sm font-medium text-gray-800 leading-relaxed whitespace-nowrap"
                  >
                    我，是我人生的首席能量官。我将驾驶我的'双核'战车，在滋养与创造的平衡中，享受这段充满探索的旅程。
                  </motion.p>
                </div>
              </motion.div>

              {/* 右侧：调整宽度 */}
              <div className="flex-[2] flex flex-col gap-4">
                {/* 上半部分：生命旅程信息 */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex-[2] flex flex-col items-center justify-center space-y-3"
                >
                  {/* Today is a Gift */}
                  <div className="px-4 py-2 bg-gradient-to-r from-orange-400/80 to-pink-400/80 text-white font-semibold rounded-full text-sm shadow-lg backdrop-blur-sm">
                    Today is a Gift
                  </div>
                  
                  {/* 生命旅程描述 - 突出数字 */}
                  <div className="text-center">
                    <div className="text-base text-gray-700 font-medium leading-relaxed">
                      我的生命已有<span className="text-3xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mx-1">{daysLived.toLocaleString()}</span>天的生命旅程
                    </div>
                  </div>
                  
                  {/* 里程碑倒计时 */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      距离里程碑还有 <span className="font-bold text-orange-600">{daysToTarget}</span> 天
                    </span>
                  </div>
                </motion.div>

                {/* 下半部分：每日箴言 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  <div className="h-16 flex items-center justify-center">
                    <motion.p
                      key={currentQuoteIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg text-gray-700 font-medium italic text-center leading-relaxed"
                    >
                      {dailyQuotes[currentQuoteIndex]}
                    </motion.p>
                  </div>
                  
                  {/* 指示器 */}
                  <div className="flex justify-center gap-2 mt-3">
                    {dailyQuotes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuoteIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentQuoteIndex
                            ? 'bg-orange-400 w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
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
    if (currentPage === 'database-test') return <DatabaseTest />;


    return <div className="text-center p-8 bg-white rounded-lg shadow-sm"><h2 className="text-2xl font-bold">页面正在建设中...</h2><p>即将推出 {currentPage} 分析页面。</p></div>;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-50/30 via-transparent to-cyan-50/30"></div>
      
      {/* 动态背景元素 */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-300/15 to-purple-300/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex items-center justify-center space-x-6 flex-wrap">
            <span>数据来源: Notion API</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Clock, TrendingUp } from 'lucide-react';

const getWeekNumber = (d: Date) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  return weekNo;
}

const getStartAndEndOfWeek = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    
    // Set to last week's Sunday
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - dayOfWeek - 7);

    // Set to last week's Saturday
    const endOfLastWeek = new Date(today);
    endOfLastWeek.setDate(today.getDate() - dayOfWeek - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);

    return { start: startOfLastWeek, end: endOfLastWeek };
}

const ReviewCard = ({ title, children, icon: Icon, color }: { title: string, children: React.ReactNode, icon: React.ElementType, color: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <div className={`flex items-center mb-3 ${color}`}>
            <Icon className="w-5 h-5 mr-2" />
            <h3 className="text-md font-bold">{title}</h3>
        </div>
        {children}
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const WeeklyReview = () => {
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentWeek = getWeekNumber(today) -1;

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const { start, end } = getStartAndEndOfWeek();
            
            const [health, emotions, logs, actions, financials, knowledge, interactions] = await Promise.all([
                getDatabaseData('健康日记'), getDatabaseData('情绪记录'), getDatabaseData('每日日志'),
                getDatabaseData('行动库'), getDatabaseData('财务记录'), getDatabaseData('知识库'),
                getDatabaseData('互动记录')
            ]);
            
            // Filter data for the last week
            const lastWeekHealth = health.filter(d => new Date(d.properties["日期"]?.date?.start) >= start && new Date(d.properties["日期"]?.date?.start) <= end);
            const lastWeekEmotions = emotions.filter(d => new Date(d.properties["日期"]?.date?.start) >= start && new Date(d.properties["日期"]?.date?.start) <= end);
            const lastWeekLogs = logs.filter(d => new Date(d.properties["日期"]?.date?.start) >= start && new Date(d.properties["日期"]?.date?.start) <= end);
            const lastWeekActions = actions.filter(d => d.properties["完成日期"]?.date?.start && new Date(d.properties["完成日期"]?.date?.start) >= start && new Date(d.properties["完成日期"]?.date?.start) <= end);
            const lastWeekFinancials = financials.filter(d => new Date(d.properties["日期"]?.date?.start) >= start && new Date(d.properties["日期"]?.date?.start) <= end);
            const lastWeekKnowledge = knowledge.filter(d => new Date(d.created_time) >= start && new Date(d.created_time) <= end);
            const lastWeekInteractions = interactions.filter(d => new Date(d.properties["日期"]?.date?.start) >= start && new Date(d.properties["日期"]?.date?.start) <= end);
            
            // Process Metrics
            const avgSleep = lastWeekHealth.reduce((acc, curr) => acc + (curr.properties["睡眠时长"]?.number || 0), 0) / (lastWeekHealth.length || 1) / 60;
            const exerciseDays = new Set(lastWeekHealth.filter(d => (d.properties["运动时长"]?.number || 0) > 0).map(d => d.properties["日期"]?.date?.start)).size;
            
            const timeAllocation: { [key: string]: number } = {};
            lastWeekLogs.forEach(l => {
                const category = l.properties["活动类别"]?.select?.name || '未分类';
                const duration = l.properties["实际时长（分钟）"]?.formula?.number || 0;
                timeAllocation[category] = (timeAllocation[category] || 0) + duration;
            });

            const netFinancial = lastWeekFinancials.reduce((acc, curr) => {
                const amount = curr.properties["金额"]?.number || 0;
                return curr.properties["类型"]?.select?.name === '收入' ? acc + amount : acc - amount;
            }, 0);

            setStats({
                avgSleep: avgSleep.toFixed(1),
                exerciseDays,
                avgEnergy: (lastWeekHealth.reduce((acc, curr) => acc + (curr.properties["精力水平"]?.formula?.number || 0), 0) / (lastWeekHealth.length || 1)).toFixed(0),
                moodExtremes: {
                    high: lastWeekEmotions.sort((a,b) => (b.properties["当前心情评分"]?.select?.name || '0').localeCompare(a.properties["当前心情评分"]?.select?.name || '0'))[0],
                    low: lastWeekEmotions.sort((a,b) => (a.properties["当前心情评分"]?.select?.name || '0').localeCompare(b.properties["当前心情评分"]?.select?.name || '0'))[0]
                },
                timeAllocation: Object.entries(timeAllocation).map(([name, value]) => ({ name, value: Math.round(value/60) })),
                actionsCompleted: lastWeekActions.length,
                netFinancial: netFinancial.toFixed(2),
                newKnowledge: lastWeekKnowledge.length,
                importantInteractions: lastWeekInteractions.length,
            });

            setLoading(false);
        };
        processData();
    }, []);

    if (loading) return <div className="text-center p-8">生成周度复盘报告中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">{currentYear} W{currentWeek} - 每周回顾与规划</h1>

            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">第一部分：上周数据快照</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReviewCard title="基座与能量" icon={Droplets} color="text-blue-600">
                        <div className="space-y-3 text-sm">
                            <p>平均睡眠: <span className="font-bold">{stats.avgSleep}h</span></p>
                            <p>运动天数: <span className="font-bold">{stats.exerciseDays} 天</span></p>
                            <p>平均精力: <span className="font-bold">{stats.avgEnergy}/100</span></p>
                            <p className="border-t pt-2 mt-2">高光情绪: <span className="font-semibold">{stats.moodExtremes?.high && getPlainText(stats.moodExtremes.high.properties["记录标题"]?.title)}</span></p>
                            <p>低谷情绪: <span className="font-semibold">{stats.moodExtremes?.low && getPlainText(stats.moodExtremes.low.properties["记录标题"]?.title)}</span></p>
                        </div>
                    </ReviewCard>
                    <ReviewCard title="时间与目标投入" icon={Clock} color="text-green-600">
                       <ResponsiveContainer width="100%" height={150}>
                            <PieChart>
                                <Pie data={stats.timeAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5}>
                                    {stats.timeAllocation?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `${value} 小时`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <p className="text-center text-sm mt-2">已完成行动: <span className="font-bold">{stats.actionsCompleted}</span> 项</p>
                    </ReviewCard>
                    <ReviewCard title="杠杆与资源积累" icon={TrendingUp} color="text-purple-600">
                         <div className="space-y-3 text-sm">
                            <p>本周净收支: <span className={`font-bold ${stats.netFinancial > 0 ? 'text-green-600' : 'text-red-600'}`}>¥{stats.netFinancial}</span></p>
                            <p>新增知识点: <span className="font-bold">{stats.newKnowledge}</span> 个</p>
                            <p>重要互动: <span className="font-bold">{stats.importantInteractions}</span> 次</p>
                        </div>
                    </ReviewCard>
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">第二部分：洞察与反思 (So What?)</h2>
                 <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-green-600 mb-2">✅ 本周成就 (Wins)</h3>
                        <textarea className="w-full h-32 p-2 border rounded bg-green-50 border-green-200 focus:ring-green-500 focus:border-green-500" placeholder="记录下让你感到自豪的事情，无论大小..."></textarea>
                    </div>
                    <div>
                        <h3 className="font-bold text-red-600 mb-2">🤔 本周挑战 (Challenges)</h3>
                        <textarea className="w-full h-32 p-2 border rounded bg-red-50 border-red-200 focus:ring-red-500 focus:border-red-500" placeholder="遇到了哪些困难？哪些事情没有按计划进行？"></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="font-bold text-yellow-600 mb-2">💡 核心洞察 (Key Learnings)</h3>
                        <textarea className="w-full h-24 p-2 border rounded bg-yellow-50 border-yellow-200 focus:ring-yellow-500 focus:border-yellow-500" placeholder="从本周的经历中学到了什么最重要的教训？"></textarea>
                    </div>
                </div>
            </section>
            
             <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">第三部分：下周规划 (Now What?)</h2>
                 <div className="bg-white rounded-lg shadow-sm p-6">
                     <h3 className="font-bold text-blue-600 mb-2">🎯 下周三大聚焦 (Top 3 Focus Areas)</h3>
                     <div className="space-y-2">
                         <input type="text" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="1. " />
                         <input type="text" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="2. " />
                         <input type="text" className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" placeholder="3. " />
                     </div>
                </div>
            </section>
        </motion.div>
    );
};

export default WeeklyReview;

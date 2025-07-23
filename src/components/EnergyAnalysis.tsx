import { useEffect, useState } from 'react';
import { getDatabaseData } from '../../services/dataLoader';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, BarChart } from 'recharts';
import { Zap, Activity, Brain, BedDouble } from 'lucide-react';

// Helper to get plain text from Notion rich text
const getPlainText = (richText: any[] | undefined) => richText?.map(t => t.plain_text).join('') || '';

const AnalysisCard = ({ title, children, icon: Icon, color }: { title: string, children: React.ReactNode, icon: React.ElementType, color: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <div className={`flex items-center mb-4 ${color}`}>
            <Icon className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        {children}
    </div>
);

const EnergyAnalysis = () => {
    const [dailyData, setDailyData] = useState<any[]>([]);
    const [emotionTriggers, setEmotionTriggers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const healthData = await getDatabaseData('健康日记');
            const emotionData = await getDatabaseData('情绪记录');

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const dataMap = new Map();

            // Initialize map with last 30 days
            for (let i = 0; i < 30; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const key = d.toISOString().split('T')[0];
                dataMap.set(key, { date: key, sleep: null, exercise: null, meditation: null, energy: null, mood: [] });
            }

            // Process Health Data
            healthData.forEach(item => {
                const date = item.properties["日期"]?.date?.start;
                if (date && new Date(date) >= thirtyDaysAgo) {
                    const entry = dataMap.get(date) || { date, sleep: null, exercise: null, meditation: null, energy: null, mood: [] };
                    entry.sleep = item.properties["睡眠评分"]?.formula?.number || entry.sleep;
                    entry.exercise = item.properties["运动评分"]?.formula?.number || entry.exercise;
                    entry.meditation = item.properties["冥想评分"]?.formula?.number || entry.meditation;
                    entry.energy = item.properties["精力水平"]?.formula?.number || entry.energy;
                    dataMap.set(date, entry);
                }
            });

            // Process Emotion Data
            const triggerCounts: { [key: string]: number } = {};
            emotionData.forEach(item => {
                const date = item.properties["日期"]?.date?.start || new Date(item.properties["记录时间"]?.created_time).toISOString().split('T')[0];
                 if (date && new Date(date) >= thirtyDaysAgo) {
                    const moodScore = parseInt((item.properties["当前心情评分"]?.select?.name || '0').replace(' 分', ''));
                    if (dataMap.has(date)) {
                        dataMap.get(date).mood.push(moodScore);
                    }
                    const trigger = item.properties["触发类型"]?.select?.name;
                    if (trigger) {
                        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
                    }
                }
            });

            // Calculate average mood
            dataMap.forEach(value => {
                if (value.mood.length > 0) {
                    value.avgMood = value.mood.reduce((a: number, b: number) => a + b, 0) / value.mood.length;
                } else {
                    value.avgMood = null;
                }
                delete value.mood;
            });
            
            const formattedTriggers = Object.entries(triggerCounts).map(([name, count]) => ({ name, count }));
            setEmotionTriggers(formattedTriggers);

            const sortedData = Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setDailyData(sortedData);
            setLoading(false);
        };

        processData();
    }, []);

    if (loading) return <div className="text-center p-8">加载分析数据中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">能量分析仪表盘</h1>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: '精力水平', dataKey: 'energy', color: "#3B82F6", icon: Zap },
                    { title: '运动评分', dataKey: 'exercise', color: "#10B981", icon: Activity },
                    { title: '睡眠评分', dataKey: 'sleep', color: "#8B5CF6", icon: BedDouble },
                    { title: '冥想评分', dataKey: 'meditation', color: "#EC4899", icon: Brain },
                ].map(metric => (
                    <AnalysisCard key={metric.title} title={metric.title} icon={metric.icon} color={`text-[${metric.color}]`}>
                        <ResponsiveContainer width="100%" height={150}>
                            <LineChart data={dailyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(tick) => new Date(tick).getDate().toString()} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey={metric.dataKey} stroke={metric.color} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </AnalysisCard>
                ))}
            </div>

            {/* Health & Energy Correlation */}
            <AnalysisCard title="健康-精力-情绪关联分析" icon={Activity} color="text-green-600">
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(tick) => new Date(tick).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}/>
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="avgMood" name="平均心情" fill="#FBBF24" />
                        <Line yAxisId="right" type="monotone" dataKey="sleep" name="睡眠评分" stroke="#8B5CF6" />
                        <Line yAxisId="right" type="monotone" dataKey="energy" name="精力水平" stroke="#3B82F6" />
                    </ComposedChart>
                </ResponsiveContainer>
            </AnalysisCard>
            
             {/* Emotion Deep Dive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisCard title="情绪触发源分析" icon={Brain} color="text-purple-600">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={emotionTriggers} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" name="触发次数" fill="#8B5CF6" />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalysisCard>
                {/* Placeholder for other emotion analysis cards */}
                 <AnalysisCard title="高效恢复行动" icon={Activity} color="text-orange-500">
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <p>高效恢复行动排行榜模块正在建设中...</p>
                    </div>
                </AnalysisCard>
            </div>
        </motion.div>
    );
};

export default EnergyAnalysis;

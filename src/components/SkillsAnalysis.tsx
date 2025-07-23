import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BrainCircuit, BookOpen, Clock, AlertTriangle } from 'lucide-react';

// Helper to get plain text from Notion rich text
const getPlainText = (richText: any[] | undefined) => richText?.map(t => t.plain_text).join('') || '';

const AnalysisCard = ({ title, children, icon: Icon, color }: { title: string, children: React.ReactNode, icon: React.ElementType, color: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
        <div className={`flex items-center mb-4 ${color}`}>
            <Icon className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        {children}
    </div>
);

const SkillsAnalysis = () => {
    const [knowledgeDomainData, setKnowledgeDomainData] = useState<any[]>([]);
    const [knowledgeMasteryData, setKnowledgeMasteryData] = useState<any[]>([]);
    const [focusKillersData, setFocusKillersData] = useState<any[]>([]);
    const [modelUsageData, setModelUsageData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const [knowledge, attention, models, logs] = await Promise.all([
                getDatabaseData('知识库'),
                getDatabaseData('注意力记录'),
                getDatabaseData('思维模型'),
                getDatabaseData('每日日志')
            ]);

            // 1. Knowledge Domain Radar Chart
            const domainCounts: { [key: string]: number } = {};
            knowledge.forEach(item => {
                const domain = item.properties["知识领域"]?.select?.name;
                if (domain) domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            });
            setKnowledgeDomainData(Object.entries(domainCounts).map(([subject, count]) => ({ subject, count, fullMark: 10 })));
            
            // 2. Knowledge Mastery Funnel/Bar Chart
            const masteryOrder = ["了解", "理解", "应用", "分析", "评估", "创造"];
            const masteryCounts: { [key: string]: number } = {};
            knowledge.forEach(item => {
                const level = item.properties["理解深度"]?.select?.name;
                if (level) masteryCounts[level] = (masteryCounts[level] || 0) + 1;
            });
            setKnowledgeMasteryData(masteryOrder.map(level => ({ name: level, count: masteryCounts[level] || 0 })));

            // 3. Focus Killers Bar Chart
            const killerCounts: { [key: string]: number } = {};
            attention.forEach(item => {
                const killers = item.properties["干扰类型"]?.multi_select || [];
                killers.forEach((killer: { name: string }) => {
                    killerCounts[killer.name] = (killerCounts[killer.name] || 0) + 1;
                });
            });
            setFocusKillersData(Object.entries(killerCounts).map(([name, count]) => ({ name, count })));

            // 4. Cognitive Toolbox - Model Usage
            const modelNameMap = new Map(models.map(m => [m.id, getPlainText(m.properties["模型名称"]?.title)]));
            const modelUsageCounts: { [key: string]: number } = {};
            logs.forEach(log => {
                const relatedModels = log.properties["关联模型"]?.relation || [];
                relatedModels.forEach((rel: { id: string }) => {
                    const modelName = modelNameMap.get(rel.id);
                    if (modelName) modelUsageCounts[modelName] = (modelUsageCounts[modelName] || 0) + 1;
                });
            });
            setModelUsageData(Object.entries(modelUsageCounts).map(([name, count]) => ({ name, count })));

            setLoading(false);
        };
        processData();
    }, []);

    if (loading) return <div className="text-center p-8">加载能力提升分析数据中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">能力提升分析仪表盘</h1>
            
            <h2 className="text-2xl font-semibold text-gray-700 mt-8 border-b-2 border-purple-300 pb-2">知识体系分析</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisCard title="知识领域雷达图" icon={BrainCircuit} color="text-purple-600">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={knowledgeDomainData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                            <PolarRadiusAxis />
                            <Radar name="知识点数量" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </AnalysisCard>
                <AnalysisCard title="知识掌握漏斗" icon={BookOpen} color="text-purple-600">
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={knowledgeMasteryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="知识点数" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalysisCard>
            </div>

            <h2 className="text-2xl font-semibold text-gray-700 mt-8 border-b-2 border-green-300 pb-2">注意力与心流分析</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisCard title="专注杀手排行榜" icon={AlertTriangle} color="text-red-600">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={focusKillersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" name="干扰次数" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </AnalysisCard>
                <AnalysisCard title="高效专注时段" icon={Clock} color="text-green-600">
                    <div className="h-[300px] flex items-center justify-center text-gray-500">
                        <p>热力图模块正在建设中...</p>
                    </div>
                </AnalysisCard>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-700 mt-8 border-b-2 border-blue-300 pb-2">认知工具箱分析</h2>
            <AnalysisCard title="思维模型应用频率" icon={BrainCircuit} color="text-blue-600">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={modelUsageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="应用次数" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </AnalysisCard>
        </motion.div>
    );
};

export default SkillsAnalysis;

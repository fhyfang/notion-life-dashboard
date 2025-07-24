import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Award, BrainCircuit, Lightbulb, TrendingUp } from 'lucide-react';

// Helper to get plain text from Notion rich text
const getPlainText = (richText: any[] | undefined) => richText?.map(t => t.plain_text).join('') || '';

const AnalysisCard = ({ title, children, icon: Icon, color }: { title: string, children: React.ReactNode, icon: React.ElementType, color: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
        <div className={`flex items-center mb-4 ${color}`}>
            <Icon className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const MetaLearningAnalysis = () => {
    const [eventTypeData, setEventTypeData] = useState<any[]>([]);
    const [skillsRadarData, setSkillsRadarData] = useState<any[]>([]);
    const [failureAnalysisData, setFailureAnalysisData] = useState<any[]>([]);
    const [lessonsHallOfFame, setLessonsHallOfFame] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const debriefs = await getDatabaseData('成长复盘');

            // 1. Growth Event Type Analysis
            const typeCounts: { [key: string]: number } = {};
            debriefs.forEach(item => {
                const type = item.properties["事件类型"]?.select?.name;
                if (type) typeCounts[type] = (typeCounts[type] || 0) + 1;
            });
            setEventTypeData(Object.entries(typeCounts).map(([name, value]) => ({ name, value })));

            // 2. Skills Improvement Radar Chart
            const skillCounts: { [key: string]: number } = {};
            let maxSkillCount = 0;
            debriefs.forEach(item => {
                const skills = item.properties["能力提升"]?.multi_select || [];
                skills.forEach((skill: { name: string }) => {
                    skillCounts[skill.name] = (skillCounts[skill.name] || 0) + 1;
                    if (skillCounts[skill.name] > maxSkillCount) {
                        maxSkillCount = skillCounts[skill.name];
                    }
                });
            });
            setSkillsRadarData(Object.entries(skillCounts).map(([subject, count]) => ({ subject, count, fullMark: maxSkillCount + 1 })));

            // 3. Failure Root Cause Analysis
            setFailureAnalysisData(debriefs
                .filter(item => item.properties["事件类型"]?.select?.name === '失败')
                .map(item => ({
                    event: getPlainText(item.properties["复盘事件"]?.title),
                    lesson: getPlainText(item.properties["核心教训"]?.rich_text),
                    blindSpot: getPlainText(item.properties["能力盲区"]?.rich_text),
                    improvement: getPlainText(item.properties["下次改进"]?.rich_text)
                }))
            );

            // 4. Lessons Hall of Fame
            setLessonsHallOfFame(debriefs
                .filter(item => (item.properties["成长价值"]?.select?.name || '').includes('5'))
                .sort((a, b) => new Date(b.created_time).getTime() - new Date(a.created_time).getTime())
                .slice(0, 3)
                .map(item => ({
                    event: getPlainText(item.properties["复盘事件"]?.title),
                    lesson: getPlainText(item.properties["核心教训"]?.rich_text)
                }))
            );

            setLoading(false);
        };
        processData();
    }, []);

    if (loading) return <div className="text-center p-8">加载元认知分析数据中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">元认知提升分析</h1>
            
            <AnalysisCard title="教训名人堂" icon={Award} color="text-yellow-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lessonsHallOfFame.map((item, index) => (
                        <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <p className="text-sm text-gray-600 mb-2 font-semibold">来自: {item.event}</p>
                            <p className="text-lg text-gray-800 italic">"{item.lesson}"</p>
                        </div>
                    ))}
                </div>
            </AnalysisCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AnalysisCard title="成长事件类型分析" icon={Lightbulb} color="text-blue-600">
                     <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                             <Pie data={eventTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                 {eventTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                             </Pie>
                             <Tooltip />
                             <Legend />
                         </PieChart>
                     </ResponsiveContainer>
                </AnalysisCard>
                <AnalysisCard title="能力提升雷达图" icon={TrendingUp} color="text-green-600">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsRadarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                            <Radar name="提升次数" dataKey="count" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </AnalysisCard>
            </div>
            
            <AnalysisCard title="失败根本原因分析" icon={BrainCircuit} color="text-red-600">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">失败事件</th>
                                <th scope="col" className="px-4 py-3">核心教训</th>
                                <th scope="col" className="px-4 py-3">能力盲区</th>
                                <th scope="col" className="px-4 py-3">下次改进</th>
                            </tr>
                        </thead>
                        <tbody>
                            {failureAnalysisData.map((item, index) => (
                                <tr key={index} className="bg-white border-b hover:bg-red-50">
                                    <th scope="row" className="px-4 py-4 font-medium text-gray-900">{item.event}</th>
                                    <td className="px-4 py-4">{item.lesson}</td>
                                    <td className="px-4 py-4 text-red-700 font-medium">{item.blindSpot}</td>
                                    <td className="px-4 py-4 text-green-700 font-medium">{item.improvement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AnalysisCard>
        </motion.div>
    );
};

export default MetaLearningAnalysis;
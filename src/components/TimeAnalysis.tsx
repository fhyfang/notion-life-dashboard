import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { Clock, BarChart2, AlertCircle } from 'lucide-react';

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4560'];

const TimeAnalysis = () => {
    const [projectRoiData, setProjectRoiData] = useState<any[]>([]);
    const [timeAllocationData, setTimeAllocationData] = useState<any[]>([]);
    const [estimationData, setEstimationData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const [projects, goals, actions, logs] = await Promise.all([
                getDatabaseData('项目库'),
                getDatabaseData('目标库'),
                getDatabaseData('行动库'),
                getDatabaseData('每日日志')
            ]);

            // 1. Project ROI Analysis
            const roiData = projects.map(p => {
                const duration = p.properties["总投入时长（分钟）"]?.rollup?.number || 0;
                const progress = (p.properties["目标进度"]?.formula?.number || 0) * 100;
                return {
                    name: getPlainText(p.properties["项目名称"]?.title),
                    duration: (duration / 60).toFixed(1), // hours
                    progress: progress.toFixed(0),
                    roi: duration > 0 ? (progress / (duration / 60)).toFixed(2) : 0,
                    status: p.properties["状态"]?.select?.name,
                };
            }).filter(p => p.status === '执行中');
            setProjectRoiData(roiData);

            // 2. Time Allocation Analysis
            const goalDomainMap = new Map(goals.map(g => [g.id, g.properties["领域"]?.select?.name || '未分类']));
            const projectGoalMap = new Map(projects.map(p => [p.id, p.properties["关联目标"]?.relation[0]?.id]));
            const actionProjectMap = new Map(actions.map(a => [a.id, a.properties["关联项目"]?.relation[0]?.id]));
            
            const allocation: { [key: string]: number } = {};
            logs.forEach(log => {
                const actionId = log.properties["关联行动"]?.relation[0]?.id;
                if (actionId) {
                    const projectId = actionProjectMap.get(actionId);
                    if (projectId) {
                        const goalId = projectGoalMap.get(projectId);
                        if (goalId) {
                            const domain = goalDomainMap.get(goalId);
                            if (domain) {
                                const duration = log.properties["实际时长（分钟）"]?.formula?.number || 0;
                                allocation[domain] = (allocation[domain] || 0) + duration;
                            }
                        }
                    }
                }
            });
            const allocationData = Object.entries(allocation).map(([name, value]) => ({ name, value: Math.round(value / 60) }));
            setTimeAllocationData(allocationData);

            // 3. Estimation Analysis
            const estData = actions
              .filter(a => (a.properties["预估时长"]?.number) && (a.properties["实际投入时长（分钟）"]?.rollup?.number))
              .map(a => ({
                name: getPlainText(a.properties["行动描述"]?.title),
                estimate: a.properties["预估时长"].number,
                actual: a.properties["实际投入时长（分钟）"].rollup.number,
            }));
            setEstimationData(estData);

            setLoading(false);
        };
        processData();
    }, []);

    if (loading) return <div className="text-center p-8">加载时间分析数据中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">时间分析仪表盘</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisCard title="时间分配概览" icon={Clock} color="text-green-600">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={timeAllocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {timeAllocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} 小时`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </AnalysisCard>
                
                <AnalysisCard title="预估-实际时长偏差" icon={AlertCircle} color="text-yellow-600">
                     <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid />
                            <XAxis type="number" dataKey="estimate" name="预估 (分钟)" />
                            <YAxis type="number" dataKey="actual" name="实际 (分钟)" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="行动" data={estimationData} fill="#f59e0b" />
                            <ReferenceLine y={0} stroke="#000" />
                            <ReferenceLine x={0} stroke="#000" />
                             <ReferenceLine ifOverflow="extendDomain" stroke="red" strokeDasharray="3 3" segment={[{ x: 0, y: 0 }, { x: 500, y: 500 }]}/>
                        </ScatterChart>
                    </ResponsiveContainer>
                </AnalysisCard>
            </div>
            
            <AnalysisCard title="项目投入产出比 (ROI)" icon={BarChart2} color="text-blue-600">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">项目名称</th>
                                <th scope="col" className="px-6 py-3">状态</th>
                                <th scope="col" className="px-6 py-3">总投入 (小时)</th>
                                <th scope="col" className="px-6 py-3">进度 (%)</th>
                                <th scope="col" className="px-6 py-3">ROI (进度/小时)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectRoiData.map(p => (
                                <tr key={p.name} className="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{p.name}</th>
                                    <td className="px-6 py-4">{p.status}</td>
                                    <td className="px-6 py-4">{p.duration}</td>
                                    <td className="px-6 py-4">{p.progress}%</td>
                                    <td className={`px-6 py-4 font-bold ${p.roi > 10 ? 'text-green-600' : p.roi < 2 ? 'text-red-600' : 'text-yellow-600'}`}>{p.roi}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AnalysisCard>

        </motion.div>
    );
};

export default TimeAnalysis;

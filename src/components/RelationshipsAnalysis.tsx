import { useEffect, useState } from 'react';
import { getDatabaseData } from '../../services/dataLoader';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Legend, ReferenceLine, BarChart, Bar } from 'recharts';
import { Users, DollarSign, PhoneOff } from 'lucide-react';

// Helper to get plain text from Notion rich text
const getPlainText = (richText: any[] | undefined) => richText?.map(t => t.plain_text).join('') || '';

const AnalysisCard = ({ title, children, icon: Icon, color, subtitle }: { title: string, children: React.ReactNode, icon: React.ElementType, color: string, subtitle?: string }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
        <div className={`flex items-center mb-1 ${color}`}>
            <Icon className="w-6 h-6 mr-3" />
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
        <div className="flex-grow">{children}</div>
    </div>
);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RelationshipsAnalysis = () => {
    const [circleData, setCircleData] = useState<any[]>([]);
    const [trustData, setTrustData] = useState<any[]>([]);
    const [coldContacts, setColdContacts] = useState<any[]>([]);
    const [expenseData, setExpenseData] = useState<any[]>([]);
    const [financialTrend, setFinancialTrend] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processData = async () => {
            setLoading(true);
            const [contacts, financials] = await Promise.all([
                getDatabaseData('关系网'),
                getDatabaseData('财务记录'),
            ]);

            // 1. Relationship Analysis
            const circleCounts: { [key: string]: number } = {};
            const interestMap: { [key: string]: number } = { "高度一致": 5, "高度互补": 4, "部分重叠": 3, "潜在机会": 2, "无关": 1, "潜在冲突": -1, "竞争": -2 };
            
            const processedTrustData = contacts.map(c => {
                const circle = getPlainText(c.properties["核心圈层"]?.formula?.string);
                if (circle) circleCounts[circle] = (circleCounts[circle] || 0) + 1;
                return {
                    name: getPlainText(c.properties["姓名"]?.title),
                    myTrust: c.properties["我信任对方"]?.number || 0,
                    theirTrust: c.properties["对方信任我(估)"]?.number || 0,
                    interestMatch: interestMap[c.properties["利益匹配度"]?.select?.name] || 1,
                };
            });
            
            const lastContactCutoff = new Date();
            lastContactCutoff.setDate(lastContactCutoff.getDate() - 90); // 90 day cutoff
            const processedColdContacts = contacts.filter(c => {
                const lastContactDateStr = c.properties["最近联系"]?.rollup?.array?.[0]?.date?.start;
                if (!lastContactDateStr) return true; // No contact ever
                return new Date(lastContactDateStr) < lastContactCutoff;
            }).map(c => getPlainText(c.properties["姓名"]?.title));


            setCircleData(Object.entries(circleCounts).map(([name, value]) => ({ name, value })));
            setTrustData(processedTrustData);
            setColdContacts(processedColdContacts);

            // 2. Financial Analysis
            const monthlyData: { [key: string]: { month: string, 收入: number, 支出: number, 投资: number } } = {};
            const expenseCategories: { [key: string]: number } = {};
            financials.forEach(f => {
                const date = f.properties["日期"]?.date?.start;
                if (!date) return;
                const monthKey = new Date(date).toISOString().slice(0, 7); // YYYY-MM
                if (!monthlyData[monthKey]) monthlyData[monthKey] = { month: monthKey, 收入: 0, 支出: 0, 投资: 0 };

                const amount = f.properties["金额"]?.number || 0;
                const type = f.properties["类型"]?.select?.name;
                if(type) monthlyData[monthKey][type] = (monthlyData[monthKey][type] || 0) + amount;

                if (type === '支出') {
                    const category = f.properties["分类(支出)"]?.select?.name || '其他';
                    expenseCategories[category] = (expenseCategories[category] || 0) + amount;
                }
            });
            
            setFinancialTrend(Object.values(monthlyData).sort((a,b) => a.month.localeCompare(b.month)));
            setExpenseData(Object.entries(expenseCategories).map(([name, value]) => ({ name, value })));

            setLoading(false);
        };
        processData();
    }, []);

    if (loading) return <div className="text-center p-8">加载关系与杠杆分析数据中...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">关系构建与财务杠杆分析</h1>
            
            <h2 className="text-2xl font-semibold text-gray-700 mt-8 border-b-2 border-red-300 pb-2">关系网络分析</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <AnalysisCard title="关系圈层分布" icon={Users} color="text-red-600">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={circleData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} fill="#8884d8" paddingAngle={5} label>
                                    {circleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </AnalysisCard>
                </div>
                <div className="lg:col-span-3">
                    <AnalysisCard title="信任-利益四象限" icon={Users} color="text-red-600" subtitle="点的大小代表利益匹配度">
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="myTrust" name="我信任对方" unit="/10" domain={[0, 10]}/>
                                <YAxis type="number" dataKey="theirTrust" name="对方信任我(估)" unit="/10" domain={[0, 10]}/>
                                <ZAxis type="number" dataKey="interestMatch" range={[100, 500]} name="利益匹配度" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <ReferenceLine x={5} stroke="gray" strokeDasharray="3 3" />
                                <ReferenceLine y={5} stroke="gray" strokeDasharray="3 3" />
                                <Scatter name="联系人" data={trustData} fill="#ef4444" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </AnalysisCard>
                </div>
            </div>
             <AnalysisCard title="关系维护提醒 (90天未联系)" icon={PhoneOff} color="text-orange-500">
                {coldContacts.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {coldContacts.map(name => <span key={name} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">{name}</span>)}
                    </div>
                ) : (
                    <p className="text-gray-500">所有核心联系人近期都有互动，做得很好！</p>
                )}
            </AnalysisCard>


            <h2 className="text-2xl font-semibold text-gray-700 mt-8 border-b-2 border-green-300 pb-2">财务健康度分析</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <AnalysisCard title="收入/支出/投资趋势" icon={DollarSign} color="text-green-600">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={financialTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="收入" stackId="a" fill="#22c55e" />
                                <Bar dataKey="支出" stackId="a" fill="#ef4444" />
                                <Bar dataKey="投资" stackId="a" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </AnalysisCard>
                </div>
                <div className="lg:col-span-2">
                    <AnalysisCard title="支出智慧分析" icon={DollarSign} color="text-green-600">
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </AnalysisCard>
                </div>
            </div>
        </motion.div>
    );
};

export default RelationshipsAnalysis;

import React, { useState, useEffect } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { Calendar, Clock, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataStatus {
  database: string;
  totalRecords: number;
  todayRecords: number;
  latestDate: string;
  hasToday: boolean;
}

const DataDebugger: React.FC = () => {
  const [dataStatus, setDataStatus] = useState<DataStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {    
    const today = new Date();
    setCurrentDate(today.toISOString().split('T')[0]);
    
    const checkData = async () => {
      const databases = ['每日日志', '健康日记', '情绪记录', '行动库'];
      const results: DataStatus[] = [];
      
      for (const db of databases) {
        try {
          const data = await getDatabaseData(db);
          
          // 获取今日记录
          const todayRecords = data.filter((item: any) => {
            const date = item.properties["日期"]?.date?.start;
            if (!date) return false;
            return new Date(date).toDateString() === today.toDateString();
          });
          
          // 获取最新记录日期
          let latestDate = '';
          if (data.length > 0) {
            const dates = data
              .map((item: any) => item.properties["日期"]?.date?.start)
              .filter(Boolean)
              .sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime());
            latestDate = dates[0] || '';
          }
          
          results.push({
            database: db,
            totalRecords: data.length,
            todayRecords: todayRecords.length,
            latestDate: latestDate,
            hasToday: todayRecords.length > 0
          });
        } catch (error) {
          results.push({
            database: db,
            totalRecords: 0,
            todayRecords: 0,
            latestDate: '',
            hasToday: false
          });
        }
      }
      
      setDataStatus(results);
      setLoading(false);
    };
    
    checkData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center mb-6">
        <Database className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">数据状态检查</h3>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center text-blue-700">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">当前日期：{currentDate}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {dataStatus.map((status, index) => (
          <motion.div
            key={status.database}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${
              status.hasToday 
                ? 'border-green-200 bg-green-50' 
                : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{status.database}</h4>
              {status.hasToday ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">总记录数：</span>
                <span className="font-medium">{status.totalRecords}</span>
              </div>
              <div>
                <span className="text-gray-600">今日记录：</span>
                <span className={`font-medium ${
                  status.todayRecords > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {status.todayRecords}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">最新记录日期：</span>
                <span className="font-medium ml-1">
                  {status.latestDate ? new Date(status.latestDate).toLocaleDateString('zh-CN') : '无数据'}
                </span>
              </div>
            </div>
            
            {!status.hasToday && status.latestDate && (
              <div className="mt-3 p-2 bg-yellow-100 rounded text-sm text-yellow-800">
                <Clock className="w-4 h-4 inline mr-1" />
                今日暂无记录，最新数据来自 {new Date(status.latestDate).toLocaleDateString('zh-CN')}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">解决方案</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 如果今日暂无记录，请在Notion中添加今日的数据</li>
          <li>• 确保数据库中的"日期"字段格式正确</li>
          <li>• 检查Notion API同步是否正常工作</li>
          <li>• 可以手动触发数据同步更新</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default DataDebugger;
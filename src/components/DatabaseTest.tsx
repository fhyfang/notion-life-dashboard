import { useEffect, useState } from 'react';
import { getDatabaseData } from '../services/dataLoader';
import { DATABASE_CONFIG, DatabaseName } from '../services/databases';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface DatabaseStatus {
  name: DatabaseName;
  displayName: string;
  status: 'loading' | 'success' | 'error';
  recordCount: number;
  error?: string;
}

const DatabaseTest = () => {
  const [databaseStatuses, setDatabaseStatuses] = useState<DatabaseStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testDatabases = async () => {
      setLoading(true);
      const databases = Object.keys(DATABASE_CONFIG) as DatabaseName[];
      
      const initialStatuses: DatabaseStatus[] = databases.map(name => ({
        name,
        displayName: DATABASE_CONFIG[name].displayName,
        status: 'loading',
        recordCount: 0
      }));
      
      setDatabaseStatuses(initialStatuses);

      // Test each database
      for (const dbName of databases) {
        try {
          const data = await getDatabaseData(dbName);
          setDatabaseStatuses(prev => prev.map(status => 
            status.name === dbName 
              ? { ...status, status: 'success', recordCount: data.length }
              : status
          ));
        } catch (error) {
          setDatabaseStatuses(prev => prev.map(status => 
            status.name === dbName 
              ? { 
                  ...status, 
                  status: 'error', 
                  recordCount: 0,
                  error: error instanceof Error ? error.message : '未知错误'
                }
              : status
          ));
        }
      }
      
      setLoading(false);
    };

    testDatabases();
  }, []);

  const getStatusIcon = (status: DatabaseStatus['status']) => {
    switch (status) {
      case 'loading':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const successCount = databaseStatuses.filter(s => s.status === 'success').length;
  const errorCount = databaseStatuses.filter(s => s.status === 'error').length;
  const totalRecords = databaseStatuses.reduce((sum, s) => sum + s.recordCount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">数据库连接测试</h1>
        
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{databaseStatuses.length}</div>
            <div className="text-sm text-blue-600">总数据库数</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-600">连接成功</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-600">连接失败</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{totalRecords}</div>
            <div className="text-sm text-purple-600">总记录数</div>
          </div>
        </div>

        {/* Database List */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">数据库详情</h2>
          {databaseStatuses.map((db, index) => (
            <div 
              key={db.name} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{db.displayName}</div>
                  <div className="text-sm text-gray-500">{db.name}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {db.status === 'success' && (
                  <div className="text-sm text-gray-600">
                    {db.recordCount} 条记录
                  </div>
                )}
                {db.status === 'error' && db.error && (
                  <div className="text-sm text-red-600 max-w-xs truncate">
                    {db.error}
                  </div>
                )}
                {getStatusIcon(db.status)}
              </div>
            </div>
          ))}
        </div>

        {/* User Provided Database URLs */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">用户提供的19个数据库连接</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>• 每日复盘</div>
            <div>• 人生主数据</div>
            <div>• 价值观</div>
            <div>• 价值观检验</div>
            <div>• 目标库</div>
            <div>• 项目库</div>
            <div>• 行动库</div>
            <div>• 每日日志</div>
            <div>• 情绪记录</div>
            <div>• 健康日记</div>
            <div>• 注意力记录</div>
            <div>• 创造记录</div>
            <div>• 互动记录</div>
            <div>• 财务记录</div>
            <div>• 成长复盘</div>
            <div>• 欲望数据库</div>
            <div>• 知识库</div>
            <div>• 思维模型</div>
            <div>• 关系网</div>
          </div>
        </div>

        {!loading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>测试完成！</strong> 
              {successCount === databaseStatuses.length 
                ? '所有数据库连接正常，可以正常调用数据。'
                : `${successCount}/${databaseStatuses.length} 个数据库连接成功。`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseTest;
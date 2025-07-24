import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Database, Clock, AlertCircle } from 'lucide-react';
import { 
  setRealtimeMode, 
  isRealtimeMode, 
  refreshData, 
  getDataSourceInfo, 
  getLastUpdateTime 
} from '../services/dataLoader';

interface DataSourceControlProps {
  onRefresh?: () => void;
}

export default function DataSourceControl({ onRefresh }: DataSourceControlProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('N/A');
  const [dataSourceInfo, setDataSourceInfo] = useState(getDataSourceInfo());
  const [realtimeEnabled, setRealtimeEnabled] = useState(isRealtimeMode());

  // Update last update time
  const updateLastUpdateTime = async () => {
    const time = await getLastUpdateTime();
    setLastUpdate(time || 'N/A');
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      await updateLastUpdateTime();
      onRefresh?.();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Force realtime mode - no toggle needed
  useEffect(() => {
    // Ensure realtime mode is always enabled
    if (!realtimeEnabled) {
      setRealtimeMode(true);
      setRealtimeEnabled(true);
      setDataSourceInfo(getDataSourceInfo());
    }
  }, [realtimeEnabled]);

  // Update data info on mount
  useEffect(() => {
    updateLastUpdateTime();
  }, []);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border p-4 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Data Source Status */}
          <div className="flex items-center space-x-2">
            {dataSourceInfo.mode === 'realtime' ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <Database className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {dataSourceInfo.mode === 'realtime' ? '实时数据' : '静态数据'}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {lastUpdate}
              </div>
            </div>
          </div>

          {/* Realtime Status Indicator */}
          {dataSourceInfo.available && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium">实时模式已启用</span>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {!dataSourceInfo.available && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              需要配置API密钥
            </div>
          )}
          
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '刷新数据'}
          </motion.button>
        </div>
      </div>

      {/* Status Messages */}
      {dataSourceInfo.mode === 'realtime' && (
        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
          ✅ 实时模式已启用，数据将自动从Notion API获取最新内容，每3分钟自动刷新
        </div>
      )}
      
      {!dataSourceInfo.available && (
        <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-800">
          ❌ 实时模式不可用，请在 .env.local 文件中配置 VITE_NOTION_API_KEY 和数据库ID
        </div>
      )}
    </motion.div>
  );
}
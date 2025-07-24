import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
}

export default function ApiConnectionTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'API密钥检查', status: 'pending', message: '检查中...' },
    { name: 'API连接测试', status: 'pending', message: '检查中...' },
    { name: '数据库访问测试', status: 'pending', message: '检查中...' },
  ]);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...updates } : test));
  };

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    // Test 1: API Key Check
    const apiKey = import.meta.env.VITE_NOTION_API_KEY;
    if (!apiKey) {
      updateTest(0, {
        status: 'error',
        message: 'API密钥未配置',
        details: '请在.env.local文件中设置VITE_NOTION_API_KEY'
      });
      updateTest(1, { status: 'error', message: '跳过 - API密钥缺失' });
      updateTest(2, { status: 'error', message: '跳过 - API密钥缺失' });
      return;
    }

    updateTest(0, {
      status: 'success',
      message: 'API密钥已配置',
      details: `密钥长度: ${apiKey.length} 字符`
    });

    // Test 2: API Connection
    try {
      const response = await fetch('https://api.notion.com/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        updateTest(1, {
          status: 'success',
          message: 'API连接成功',
          details: `用户: ${userData.name || userData.id}`
        });
      } else {
        const errorData = await response.json();
        updateTest(1, {
          status: 'error',
          message: `API连接失败 (${response.status})`,
          details: errorData.message || response.statusText
        });
        updateTest(2, { status: 'error', message: '跳过 - API连接失败' });
        return;
      }
    } catch (error) {
      updateTest(1, {
        status: 'error',
        message: 'API连接失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
      updateTest(2, { status: 'error', message: '跳过 - API连接失败' });
      return;
    }

    // Test 3: Database Access
    const testDatabaseId = import.meta.env.VITE_NOTION_VALUES_ID;
    if (!testDatabaseId) {
      updateTest(2, {
        status: 'error',
        message: '测试数据库ID未配置',
        details: '请配置VITE_NOTION_VALUES_ID'
      });
      return;
    }

    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${testDatabaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          page_size: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        updateTest(2, {
          status: 'success',
          message: '数据库访问成功',
          details: `找到 ${data.results?.length || 0} 条记录`
        });
      } else {
        const errorData = await response.json();
        updateTest(2, {
          status: 'error',
          message: `数据库访问失败 (${response.status})`,
          details: errorData.message || response.statusText
        });
      }
    } catch (error) {
      updateTest(2, {
        status: 'error',
        message: '数据库访问失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">API连接诊断</h2>
        </div>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              className={`p-4 rounded-lg border-2 ${getStatusColor(test.status)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(test.status)}
                  <span className="ml-3 font-medium text-gray-900">{test.name}</span>
                </div>
                <span className={`text-sm ${
                  test.status === 'success' ? 'text-green-600' :
                  test.status === 'error' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {test.message}
                </span>
              </div>
              {test.details && (
                <div className="mt-2 text-sm text-gray-600 ml-8">
                  {test.details}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">故障排除建议:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 确保.env.local文件中的VITE_NOTION_API_KEY正确配置</li>
            <li>• 检查Notion集成是否有访问相应数据库的权限</li>
            <li>• 确认数据库ID格式正确（32位十六进制字符）</li>
            <li>• 验证网络连接是否正常</li>
          </ul>
        </div>

        <button
          onClick={runTests}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重新测试
        </button>
      </div>
    </div>
  );
}
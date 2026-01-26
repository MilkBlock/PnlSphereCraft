import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-white mb-8">测试页面</h1>
      <div className="bg-slate-800 p-8 rounded-2xl max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">组件状态检查</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-500/20 rounded-lg border border-green-500">
            <p className="text-green-400 font-bold">✓ React 加载正常</p>
          </div>
          <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500">
            <p className="text-blue-400 font-bold">✓ Tailwind CSS 加载正常</p>
            <p className="text-white text-sm mt-2">这个蓝色框表示Tailwind样式生效</p>
          </div>
          <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500">
            <p className="text-yellow-400 font-bold">测试Remotion Player</p>
            <p className="text-white text-sm mt-2">尝试加载Remotion Player组件...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestApp;
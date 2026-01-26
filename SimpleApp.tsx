import React, { Suspense } from 'react';

// 动态导入Remotion Player组件
const Player = React.lazy(() => import('@remotion/player').then(mod => ({ default: mod.Player })));

// 创建一个简单的测试组件
const SimpleTestComponent: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      Remotion 测试组件
    </div>
  );
};

const SimpleApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Remotion Player 测试</h1>

      <div className="w-full max-w-4xl bg-slate-800 p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">测试 Remotion Player 组件</h2>

        <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center text-white">
              加载 Remotion Player...
            </div>
          }>
            <Player
              component={SimpleTestComponent}
              durationInFrames={300}
              compositionWidth={1280}
              compositionHeight={720}
              fps={30}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              autoPlay={false}
              loop
            />
          </Suspense>
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500">
          <p className="text-blue-400 font-bold">测试说明</p>
          <p className="text-white text-sm mt-2">
            如果上方出现视频播放器控件，说明Remotion Player加载成功。
            如果只有空白，请检查浏览器控制台错误。
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp;
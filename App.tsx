
import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { WalletBattleScene } from './remotion/Composition';
import { VIDEO_WIDTH, VIDEO_HEIGHT, FPS, DURATION_IN_FRAMES } from './constants';
import { Play, Pause, RotateCcw, Download, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Share2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight italic">
            BLOB<span className="text-blue-500">WATCH</span>
          </h1>
        </div>
        <div className="hidden md:flex gap-4">
          <button className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">Docs</button>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium border border-slate-700">Connect Wallet</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Player Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 aspect-video">
            <Player
              component={WalletBattleScene}
              durationInFrames={DURATION_IN_FRAMES}
              compositionWidth={VIDEO_WIDTH}
              compositionHeight={VIDEO_HEIGHT}
              fps={FPS}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              autoPlay={false}
              loop
            />
          </div>

          {/* Player Controls Bar */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-all active:scale-95">
                <Play className="w-5 h-5 fill-current" />
              </button>
              <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-500 font-mono uppercase block">Resolution</span>
                <span className="text-sm text-white font-bold">1080p (HQ)</span>
              </div>
              <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-500 font-mono uppercase block">FPS</span>
                <span className="text-sm text-white font-bold">30</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg">
              <Download className="w-5 h-5" />
              Export Video
            </button>
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h2 className="text-white font-bold text-lg mb-4">Live Performance</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Total Network PnL</p>
                <p className="text-2xl font-black text-green-400">+$2.4M</p>
                <div className="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full w-[70%]" />
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Active Wallets</p>
                <p className="text-2xl font-black text-white">4,812</p>
                <p className="text-xs text-blue-400 mt-1 font-bold">+12% in last 24h</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-900/20 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="font-black text-xl mb-2">PRO MODE</h2>
              <p className="text-sm text-blue-100 opacity-80 leading-relaxed mb-4">
                Connect your wallet to see your own blob in real-time battle!
              </p>
              <button className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl font-bold text-sm hover:bg-white/30 transition-colors border border-white/20">
                Unlock Analytics
              </button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 w-full max-w-6xl text-center">
        <p className="text-slate-600 text-sm">
          © 2024 Wallet PnL Battle. Not financial advice. Blobs are representative of portfolio growth.
        </p>
      </footer>
    </div>
  );
};

export default App;

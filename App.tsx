import React, { useState, useCallback, useRef } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { Search, Wallet, AlertCircle, PlayCircle, Twitter, Video, Check, Loader2, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';
import { fetchWalletHistory } from './services/api';
import { WalletHistoryItem } from './types';
import { AgarComposition } from './components/AgarComposition';
import { getBrowserLanguage, translations, Language } from './utils/i18n';

const DEFAULT_WALLET = 'DADaLQ71Dc8bjvJpbj4wF1Lk7Lvg5ZS4nirGmtbgVB9a';

const App: React.FC = () => {
  const [language] = useState<Language>(getBrowserLanguage());
  const t = translations[language];

  const [walletInput, setWalletInput] = useState(DEFAULT_WALLET);
  const [displayedWallet, setDisplayedWallet] = useState(DEFAULT_WALLET);
  const [xHandle, setXHandle] = useState('');
  const [showWallet, setShowWallet] = useState(true);
  const [data, setData] = useState<WalletHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const playerRef = useRef<PlayerRef>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const handleFetch = useCallback(async () => {
    if (!walletInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const history = await fetchWalletHistory(walletInput.trim());
      if (!history || history.length === 0) {
        setError(t.noHistory);
      } else {
        setData(history);
        setDisplayedWallet(walletInput.trim());
      }
    } catch (err: any) {
      console.error("App Error:", err);
      setError(err.message || t.fetchError);
    } finally {
      setLoading(false);
    }
  }, [walletInput, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  const handleRecord = async () => {
    if (!data) return;

    try {
      // Prompt user to select screen
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: false,
      });

      setIsRecording(true);

      const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
        ? 'video/webm; codecs=vp9' 
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wallet-history-${walletInput}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Stop all tracks to release camera/screen
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start();

      // Reset and play video from start
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      }

      // Stop automatically after 15 seconds (plus small buffer)
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        if (playerRef.current) {
          playerRef.current.pause();
        }
      }, 15000 + 500); // 15s + 0.5s buffer

    } catch (err) {
      console.error("Recording cancelled or failed", err);
      setIsRecording(false);
    }
  };

  const handleSaveImage = async () => {
    if (!playerContainerRef.current || !playerRef.current || !data) return;

    setIsSavingImage(true);

    try {
      // Pause and seek to the last frame (450 frames total, so index 449)
      playerRef.current.pause();
      playerRef.current.seekTo(449);

      // Wait a moment for the renderer to catch up and external images to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dataUrl = await toPng(playerContainerRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Higher quality
        skipAutoScale: true,
        backgroundColor: '#0f172a', // Ensure background is captured if transparent
      });

      const link = document.createElement('a');
      link.download = `wallet-analysis-${walletInput}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error('Failed to save image', err);
      alert('Failed to save image. This may be due to CORS restrictions on external images.');
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="font-bold text-lg">A</span>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              {t.title}
            </h1>
          </div>
          <div className="text-xs text-slate-400 hidden sm:block">
            {t.poweredBy}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 gap-8">
        
        {/* Search Section */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Wallet Input */}
            <div className="flex-grow-[2] relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 overflow-hidden h-12">
                <div className="pl-4 text-slate-400">
                  <Wallet size={20} />
                </div>
                <input
                  type="text"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholderWallet}
                  className="w-full bg-transparent border-none px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0 h-full"
                />
              </div>
            </div>

            {/* X Handle Input */}
            <div className="flex-grow-[1] relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 overflow-hidden h-12">
                <div className="pl-4 text-slate-400">
                  <Twitter size={20} />
                </div>
                <input
                  type="text"
                  value={xHandle}
                  onChange={(e) => setXHandle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholderX}
                  className="w-full bg-transparent border-none px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-0 h-full"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleFetch}
                disabled={loading || isRecording || isSavingImage}
                className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 whitespace-nowrap"
              >
                {loading ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                ) : (
                  <>
                    <Search size={18} />
                    <span>{t.visualize}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleRecord}
                disabled={!data || isRecording || isSavingImage}
                className={`h-12 px-4 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border whitespace-nowrap ${isRecording ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'}`}
              >
                {isRecording ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{t.recording}</span>
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    <span>{t.recordVideo}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveImage}
                disabled={!data || isRecording || isSavingImage}
                className="h-12 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-slate-700 whitespace-nowrap"
              >
                {isSavingImage ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
                <span>{t.saveImage}</span>
              </button>
            </div>
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-end px-1">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showWallet ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 bg-slate-800'}`}>
                {showWallet && <Check size={12} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                checked={showWallet} 
                onChange={(e) => setShowWallet(e.target.checked)} 
                className="hidden"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{t.showWallet}</span>
            </label>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg flex items-start gap-2 text-sm break-all">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Visualization Area */}
        <div className="w-full max-w-6xl flex-grow flex flex-col items-center justify-center min-h-[400px]">
          {data ? (
            <div 
              ref={playerContainerRef}
              className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 relative group"
            >
              <Player
                ref={playerRef}
                component={AgarComposition}
                inputProps={{ data, xHandle, showWallet, walletAddress: displayedWallet, language }}
                durationInFrames={450} // 15 seconds at 30fps
                fps={30}
                compositionWidth={1280}
                compositionHeight={720}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                autoPlay
                loop
              />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 pointer-events-none z-20">
                {data.length} {t.tokensFound}
              </div>
            </div>
          ) : (
            !loading && (
              <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                  <PlayCircle size={48} className="opacity-50" />
                </div>
                <p className="text-lg font-medium">{t.enterWallet}</p>
                <p className="text-sm max-w-md">
                  {t.description}
                </p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

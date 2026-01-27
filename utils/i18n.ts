export type Language = 'en' | 'zh';

export const translations = {
  en: {
    title: "Agar.io Wallet Visualizer",
    poweredBy: "Powered by Remotion & Ant.fun API",
    placeholderWallet: "Solana Wallet Address...",
    placeholderX: "X Handle (Optional)",
    visualize: "Visualize",
    recording: "Recording...",
    recordVideo: "Record Video",
    saveImage: "Save Image",
    showWallet: "Show Wallet Address in Video",
    noHistory: "No history found for this wallet.",
    fetchError: "Failed to fetch data. Ensure the API allows CORS or use a proxy.",
    enterWallet: "Enter a wallet address to generate the animation",
    description: "We will fetch the trading history and visualize each token as a floating cell. Size represents volume/PnL, color represents ROI.",
    tokensFound: "Tokens Found",
    analysisTitle: "Wallet Analysis",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    bestGem: "Best Gem",
    volume: "Volume",
    tokens: "Tokens"
  },
  zh: {
    title: "Agar.io 钱包可视化",
    poweredBy: "由 Remotion & Ant.fun API 提供支持",
    placeholderWallet: "Solana 钱包地址...",
    placeholderX: "X (推特) 账号 (可选)",
    visualize: "生成可视化",
    recording: "录制中...",
    recordVideo: "录制视频",
    saveImage: "保存图片",
    showWallet: "在视频中显示钱包地址",
    noHistory: "未找到该钱包的历史记录。",
    fetchError: "获取数据失败。请确保 API 允许 CORS 或使用代理。",
    enterWallet: "输入钱包地址以生成动画",
    description: "我们将获取交易历史并将每个代币可视化为浮动细胞。大小代表交易量/盈亏，颜色代表投资回报率。",
    tokensFound: "个代币已找到",
    analysisTitle: "钱包分析",
    totalPnl: "总盈亏",
    winRate: "胜率",
    bestGem: "最佳表现",
    volume: "交易量",
    tokens: "代币"
  }
};

export const getBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language.toLowerCase();
  return lang.startsWith('zh') ? 'zh' : 'en';
};

import { Config } from 'remotion';

Config.Rendering.setImageFormat('jpeg');
Config.Rendering.setQuality(90);
Config.Output.setOverwriteOutput(true);

// 设置视频编解码器
Config.Rendering.setCodec('h264');
Config.Rendering.setCrf(18);

// 设置音频编解码器
Config.Rendering.setAudioCodec('aac');

// 设置并发渲染
Config.Rendering.setConcurrency(4);

// 设置超时
Config.Rendering.setTimeoutInMilliseconds(30000);

// 启用日志
Config.Log.setLevel('info');

// 设置浏览器实例
Config.Puppeteer.setBrowserExecutable('/usr/bin/chromium');
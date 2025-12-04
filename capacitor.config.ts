import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pt.djtv.app',
  appName: 'DJTV',
  webDir: 'dist',
  server: {
    url: 'https://5bd0bda0-2783-4551-bbe2-c7fffad7bfb3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Android TV configuration
  android: {
    flavor: 'tv',
    allowMixedContent: true,
  },
  // iOS/tvOS configuration  
  ios: {
    scheme: 'DJTV',
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: '#0a0a0a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0a0a',
    },
  },
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pt.djtv.app',
  appName: 'djtv',
  webDir: 'dist',
  server: {
    url: 'https://5bd0bda0-2783-4551-bbe2-c7fffad7bfb3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Android TV configuration
  android: {
    flavor: 'tv', // Enables TV-specific build variant
    allowMixedContent: true,
  },
  // iOS/tvOS configuration  
  ios: {
    scheme: 'DJTV',
    contentInset: 'automatic',
  },
};

export default config;

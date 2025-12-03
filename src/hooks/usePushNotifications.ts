import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from '@/hooks/use-toast';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const initPushNotifications = async () => {
      // Only run on native platforms
      if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications not supported on web');
        return;
      }

      setIsSupported(true);

      // Request permission
      const permStatus = await PushNotifications.requestPermissions();
      
      if (permStatus.receive === 'granted') {
        // Register with Apple/Google to receive push
        await PushNotifications.register();
      } else {
        console.log('Push notification permission denied');
      }

      // Listen for registration success
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        setToken(token.value);
        // TODO: Send this token to your backend to store for sending notifications
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error:', error);
      });

      // Listen for push notifications received while app is in foreground
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        toast({
          title: notification.title || 'New Notification',
          description: notification.body || '',
        });
      });

      // Listen for push notification action (user tapped on notification)
      PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        console.log('Push notification action performed:', action);
        // Handle navigation or other actions based on notification data
        const data = action.notification.data;
        if (data?.url) {
          window.location.href = data.url;
        }
      });
    };

    initPushNotifications();

    return () => {
      if (Capacitor.isNativePlatform()) {
        PushNotifications.removeAllListeners();
      }
    };
  }, []);

  return { token, isSupported };
}

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { user } = useAuth();

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
      PushNotifications.addListener('registration', async (tokenData) => {
        console.log('Push registration success, token:', tokenData.value);
        setToken(tokenData.value);
        
        // Save token to database if user is logged in
        if (user) {
          await saveTokenToDatabase(tokenData.value);
        }
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

  // Save token when user logs in
  useEffect(() => {
    if (user && token) {
      saveTokenToDatabase(token);
    }
  }, [user, token]);

  const saveTokenToDatabase = async (deviceToken: string) => {
    if (!user) return;

    const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web';
    
    try {
      const { error } = await supabase
        .from('device_tokens')
        .upsert({
          user_id: user.id,
          token: deviceToken,
          platform,
        }, {
          onConflict: 'user_id,token',
        });

      if (error) {
        console.error('Error saving device token:', error);
      } else {
        console.log('Device token saved successfully');
      }
    } catch (err) {
      console.error('Failed to save device token:', err);
    }
  };

  const removeToken = async () => {
    if (!user || !token) return;

    try {
      const { error } = await supabase
        .from('device_tokens')
        .delete()
        .eq('user_id', user.id)
        .eq('token', token);

      if (error) {
        console.error('Error removing device token:', error);
      }
    } catch (err) {
      console.error('Failed to remove device token:', err);
    }
  };

  return { token, isSupported, removeToken };
}

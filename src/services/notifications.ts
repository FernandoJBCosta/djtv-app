import { supabase } from '@/integrations/supabase/client';

interface SendNotificationParams {
  userId?: string;
  title: string;
  body?: string;
  data?: Record<string, string>;
  broadcast?: boolean;
}

export async function sendNotification(params: SendNotificationParams) {
  const { data, error } = await supabase.functions.invoke('send-notification', {
    body: {
      user_id: params.userId,
      title: params.title,
      body: params.body,
      data: params.data,
      broadcast: params.broadcast,
    },
  });

  if (error) {
    console.error('Error sending notification:', error);
    throw error;
  }

  return data;
}

export async function getUserNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }

  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

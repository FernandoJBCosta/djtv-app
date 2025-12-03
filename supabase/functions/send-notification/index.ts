import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  user_id?: string;
  title: string;
  body?: string;
  data?: Record<string, string>;
  broadcast?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");
    if (!fcmServerKey) {
      throw new Error("FCM_SERVER_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { user_id, title, body, data, broadcast }: NotificationRequest = await req.json();

    console.log("Sending notification:", { user_id, title, body, broadcast });

    // Get device tokens
    let tokensQuery = supabase.from("device_tokens").select("token, user_id");
    
    if (!broadcast && user_id) {
      tokensQuery = tokensQuery.eq("user_id", user_id);
    }

    const { data: tokens, error: tokensError } = await tokensQuery;

    if (tokensError) {
      console.error("Error fetching tokens:", tokensError);
      throw new Error("Failed to fetch device tokens");
    }

    if (!tokens || tokens.length === 0) {
      console.log("No device tokens found");
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No device tokens found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${tokens.length} device tokens`);

    // Send to FCM
    const fcmResults = await Promise.allSettled(
      tokens.map(async ({ token, user_id: tokenUserId }) => {
        const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Authorization": `key=${fcmServerKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            notification: {
              title,
              body: body || "",
            },
            data: data || {},
          }),
        });

        const result = await fcmResponse.json();
        
        // Store notification in database
        await supabase.from("notifications").insert({
          user_id: tokenUserId,
          title,
          body,
          data,
        });

        return { token, result };
      })
    );

    const successful = fcmResults.filter((r) => r.status === "fulfilled").length;
    const failed = fcmResults.filter((r) => r.status === "rejected").length;

    console.log(`Notifications sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: successful, 
        failed,
        total: tokens.length 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);

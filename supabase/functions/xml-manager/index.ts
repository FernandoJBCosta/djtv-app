import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-password',
};

const ADMIN_PASSWORD = "djtv2024";
const BUCKET_NAME = "dj-media";
const FILE_PATH = "content/index.xml";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin password
    const adminPassword = req.headers.get('x-admin-password');
    if (adminPassword !== ADMIN_PASSWORD) {
      console.error('Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'GET') {
      // Load XML from storage
      console.log('Loading XML from storage...');
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(FILE_PATH);

      if (error) {
        console.log('File not found, returning empty response');
        return new Response(JSON.stringify({ xml: null, exists: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const xml = await data.text();
      console.log('XML loaded successfully');
      return new Response(JSON.stringify({ xml, exists: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (req.method === 'POST') {
      // Save XML to storage
      const { xml } = await req.json();
      
      if (!xml || typeof xml !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid XML data' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Saving XML to storage...');
      const blob = new Blob([xml], { type: 'application/xml' });
      
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(FILE_PATH, blob, {
          contentType: 'application/xml',
          upsert: true,
        });

      if (error) {
        console.error('Storage error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(FILE_PATH);

      console.log('XML saved successfully');
      return new Response(JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        message: 'XML saved successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in xml-manager:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

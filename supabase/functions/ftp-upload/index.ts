import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-password',
};

const ADMIN_PASSWORD = "djtv2024";

// Simple FTP client implementation for Deno
async function uploadViaFTP(host: string, user: string, pass: string, remotePath: string, content: string): Promise<void> {
  const conn = await Deno.connect({ hostname: host, port: 21 });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  async function readResponse(): Promise<string> {
    const buffer = new Uint8Array(1024);
    const n = await conn.read(buffer);
    if (n === null) throw new Error("Connection closed");
    return decoder.decode(buffer.subarray(0, n));
  }
  
  async function sendCommand(cmd: string): Promise<string> {
    await conn.write(encoder.encode(cmd + "\r\n"));
    return await readResponse();
  }

  try {
    // Read welcome message
    await readResponse();
    
    // Login
    let response = await sendCommand(`USER ${user}`);
    if (!response.startsWith("331")) throw new Error("USER failed: " + response);
    
    response = await sendCommand(`PASS ${pass}`);
    if (!response.startsWith("230")) throw new Error("PASS failed: " + response);
    
    // Set binary mode
    response = await sendCommand("TYPE I");
    
    // Create directory structure if needed
    const pathParts = remotePath.split('/').filter(p => p);
    let currentPath = '';
    for (let i = 0; i < pathParts.length - 1; i++) {
      currentPath += '/' + pathParts[i];
      // Try to create directory (ignore errors if it already exists)
      const mkdResponse = await sendCommand(`MKD ${currentPath}`);
      console.log(`MKD ${currentPath}: ${mkdResponse.trim()}`);
    }
    
    // Enter passive mode
    response = await sendCommand("PASV");
    if (!response.startsWith("227")) throw new Error("PASV failed: " + response);
    
    // Parse PASV response to get data port
    const match = response.match(/\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
    if (!match) throw new Error("Invalid PASV response");
    
    const dataHost = `${match[1]}.${match[2]}.${match[3]}.${match[4]}`;
    const dataPort = parseInt(match[5]) * 256 + parseInt(match[6]);
    
    // Connect to data port
    const dataConn = await Deno.connect({ hostname: dataHost, port: dataPort });
    
    // Send STOR command
    response = await sendCommand(`STOR ${remotePath}`);
    if (!response.startsWith("150") && !response.startsWith("125")) {
      dataConn.close();
      throw new Error("STOR failed: " + response);
    }
    
    // Write file content
    await dataConn.write(encoder.encode(content));
    dataConn.close();
    
    // Read transfer complete response
    response = await readResponse();
    if (!response.startsWith("226")) throw new Error("Transfer failed: " + response);
    
    // Quit
    await sendCommand("QUIT");
    
  } finally {
    conn.close();
  }
}

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

    const ftpHost = Deno.env.get('FTP_HOST');
    const ftpUser = Deno.env.get('FTP_USER');
    const ftpPassword = Deno.env.get('FTP_PASSWORD');

    if (!ftpHost || !ftpUser || !ftpPassword) {
      console.error('FTP credentials not configured');
      return new Response(JSON.stringify({ error: 'FTP credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { xml, path = '/content/index.xml' } = await req.json();
      
      if (!xml || typeof xml !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid XML data' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Uploading XML via FTP to:', ftpHost, path);
      
      await uploadViaFTP(ftpHost, ftpUser, ftpPassword, path, xml);
      
      console.log('XML uploaded successfully via FTP');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'XML uploaded successfully to server',
        path: path
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
    console.error('Error in ftp-upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

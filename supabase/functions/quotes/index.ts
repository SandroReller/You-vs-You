// supabase/functions/quotes/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

// Erlaubte Origins
const allowedOrigins = [
  'https://youvsyou-ten.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
];

serve(async (req) => {
  // Origin aus dem Request holen
  const origin = req.headers.get('Origin') || '';
  
  // Prüfen ob Origin erlaubt ist
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  const corsHeaders = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  // OPTIONS (CORS Preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Blockiere Requests von nicht-erlaubten Origins
  if (!isAllowedOrigin) {
    return new Response(
      JSON.stringify({ error: "Origin not allowed" }), 
      { 
        status: 403,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        }
      }
    );
  }

  try {
    const res = await fetch("https://zenquotes.io/api/quotes");
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to load quotes" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      }
    });
  }
});
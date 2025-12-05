// supabase/functions/quotes/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async () => {
  try {
    const res = await fetch("https://zenquotes.io/api/quotes");
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to load quotes" }), {
      status: 500,
    });
  }
});

// supabase/functions/kai-tutor/index.ts
// Supabase Edge Function: Secure AI Japanese Tutor Proxy
// Protects the Google Gemini API key by storing it server-side in Supabase Secrets.
// Authenticates user JWT before dispatching AI requests.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Enforce Authentication via Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header. Sign-in required.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired session token.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Read secret Gemini API Key exclusively from server-side environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY secret is not set in Supabase. Run: supabase secrets set GEMINI_API_KEY=...'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, level = 'Beginner' } = await req.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Construct Japanese/Telugu Pedagogical System Instruction
    const systemPrompt = `You are KAI (カイ), an elite, encouraging Japanese tutor for an English and Telugu speaker who is at "${level}" level.
Requirements:
1. Provide a direct, encouraging response in clear English.
2. Provide natural Telugu (తెలుగు) translation and guidance where relevant.
3. If Japanese sentences are included, provide Japanese script, Romaji, and Telugu phonetic pronunciation (e.g., కొరె వా).
4. Return a structured JSON with:
{
  "reply": "English explanation with Japanese examples and Romaji",
  "teluguTranslation": "తెలుగు వివరణ లేదా అనువాదం",
  "grammarBreakdown": [{"token": "これ", "furigana": "これ", "pos": "Pronoun", "meaning": "This / ఇది"}],
  "suggestedReplies": ["Suggested question 1", "Suggested question 2"]
}`;

    // 5. Call Google Gemini 1.5 Flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nLearner question: ${prompt}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `Upstream Gemini API error: ${response.status}`, details: errText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const rawContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      return new Response(
        JSON.stringify({ error: 'No content returned from Gemini model.' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const parsedJson = JSON.parse(rawContent);
    return new Response(JSON.stringify(parsedJson), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error: ' + String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

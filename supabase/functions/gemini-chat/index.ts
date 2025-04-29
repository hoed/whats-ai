
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeminiRequest {
  prompt: string;
  systemPrompt?: string;
  history?: Array<{role: string, content: string}>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not found in environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, systemPrompt, history } = await req.json() as GeminiRequest;
    
    // Construct messages array for Gemini
    const messages = [];
    
    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({ role: "system", parts: [{ text: systemPrompt }] });
    }
    
    // Add conversation history if provided
    if (history && history.length > 0) {
      for (const message of history) {
        messages.push({
          role: message.role === 'ai' ? 'model' : 'user',
          parts: [{ text: message.content }]
        });
      }
    }
    
    // Add current user prompt
    messages.push({ role: "user", parts: [{ text: prompt }] });

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'Unknown error from Gemini API');
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(
      JSON.stringify({ text: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Gemini function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

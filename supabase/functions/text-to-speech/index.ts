
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voiceId, stability, similarityBoost } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // Get API key from Supabase secret
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    // Default values if not provided
    const finalVoiceId = voiceId || 'TX3LPaxmHKxFdv7VOQHJ' // Default to Liam voice
    const finalStability = stability !== undefined ? stability : 0.5
    const finalSimilarityBoost = similarityBoost !== undefined ? similarityBoost : 0.5

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: finalStability,
          similarity_boost: finalSimilarityBoost,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', errorText)
      throw new Error('Failed to generate speech: ' + errorText)
    }

    const audioArrayBuffer = await response.arrayBuffer()
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    )

    return new Response(
      JSON.stringify({ audio: audioBase64 }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

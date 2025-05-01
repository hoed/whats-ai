
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get request parameters
    const { phoneNumber, message } = await req.json()

    if (!phoneNumber) {
      throw new Error('Phone number is required')
    }

    // Initialize Supabase client with service role key (from environment variables)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Fetch user settings to get voice preferences
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .limit(1)
      .single()

    if (settingsError) {
      console.error("Error fetching user settings:", settingsError)
      throw new Error('Failed to fetch voice settings')
    }

    // Get AI provider and ElevenLabs settings
    const aiProvider = settingsData?.ai_provider || 'openai'
    const voiceId = settingsData?.voice_id || 'TX3LPaxmHKxFdv7VOQHJ'
    const voiceModel = settingsData?.voice_model || 'eleven_multilingual_v2'
    const stability = settingsData?.stability || 0.5
    const similarityBoost = settingsData?.similarity_boost || 0.5

    // 2. Get API keys
    const { data: apiKeysData, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('key_name, key_value, key_type')

    if (apiKeysError) {
      console.error("Error fetching API keys:", apiKeysError)
      throw new Error('Failed to fetch API keys')
    }

    // Convert to object for easier access
    const apiKeys: Record<string, string> = {}
    apiKeysData?.forEach(key => {
      apiKeys[key.key_name] = key.key_value
    })

    // Check if we have the required API keys
    if (!apiKeys['elevenlabs_key']) {
      throw new Error('ElevenLabs API key is not configured')
    }

    if (aiProvider === 'openai' && !apiKeys['openai_key']) {
      throw new Error('OpenAI API key is not configured')
    }

    if (aiProvider === 'gemini' && !apiKeys['gemini_key']) {
      throw new Error('Gemini API key is not configured')
    }

    // 3. Generate AI response based on the selected provider
    let aiResponse: string
    
    if (aiProvider === 'openai') {
      // Call OpenAI
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys['openai_key']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Use a recent model
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful WhatsApp assistant. Keep responses concise and conversational.'
            },
            { role: 'user', content: message || 'Hello' }
          ],
          max_tokens: 300, // Limit response length for voice conversion
        }),
      })

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        throw new Error(`OpenAI error: ${errorText}`)
      }

      const openaiData = await openaiResponse.json()
      aiResponse = openaiData.choices[0].message.content
    } else {
      // Call Gemini
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKeys['gemini_key']
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful WhatsApp assistant. Please respond to: ${message || 'Hello'}`
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
        })
      })

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text()
        throw new Error(`Gemini error: ${errorText}`)
      }

      const geminiData = await geminiResponse.json()
      aiResponse = geminiData.candidates[0].content.parts[0].text
    }

    // 4. Convert AI text response to speech using ElevenLabs
    const elevenlabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKeys['elevenlabs_key'],
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: aiResponse,
        model_id: voiceModel,
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost,
        },
      }),
    })

    if (!elevenlabsResponse.ok) {
      const errorText = await elevenlabsResponse.text()
      throw new Error(`ElevenLabs error: ${errorText}`)
    }

    // Convert audio to base64
    const audioArrayBuffer = await elevenlabsResponse.arrayBuffer()
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    )

    // 5. Store the conversation in the database
    // Get or create contact
    let contactId: string
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone_number', phoneNumber)
      .maybeSingle()

    if (existingContact) {
      contactId = existingContact.id
    } else {
      // Create new contact
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          name: `WhatsApp User (${phoneNumber})`,
          phone_number: phoneNumber,
        })
        .select('id')
        .single()

      if (contactError) {
        console.error("Error creating contact:", contactError)
        throw new Error('Failed to create contact')
      }
      contactId = newContact.id
    }

    // Get or create chat session
    let sessionId: string
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('contact_id', contactId)
      .eq('status', 'open')
      .maybeSingle()

    if (existingSession) {
      sessionId = existingSession.id
      
      // Update last activity
      await supabase
        .from('chat_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId)
    } else {
      // Create new session
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          contact_id: contactId,
          status: 'open',
          last_activity: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (sessionError) {
        console.error("Error creating session:", sessionError)
        throw new Error('Failed to create chat session')
      }
      sessionId = newSession.id
    }

    // Store the user message
    await supabase
      .from('messages')
      .insert({
        content: message || 'Hello',
        role: 'user',
        contact_id: contactId,
        user_id: 'DEFAULT_USER_ID', // In a real app, use the authenticated user's ID
        timestamp: new Date().toISOString(),
      })

    // Store the AI response
    await supabase
      .from('messages')
      .insert({
        content: aiResponse,
        role: 'ai',
        contact_id: contactId,
        user_id: 'DEFAULT_USER_ID', // In a real app, use the authenticated user's ID
        timestamp: new Date().toISOString(),
      })

    // Return the generated speech and text
    return new Response(
      JSON.stringify({
        audio: audioBase64,
        text: aiResponse,
        sessionId: sessionId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error("Error in WhatsApp voice handler:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

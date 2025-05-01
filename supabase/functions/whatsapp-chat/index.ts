
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppRequest {
  phone: string;
  message: string;
  name?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get API keys from database
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('key_name, key_value, key_type');

    if (apiKeysError) {
      throw new Error(`Error fetching API keys: ${apiKeysError.message}`);
    }

    // Extract keys by type
    const keysMap = apiKeys.reduce((acc, key) => {
      acc[key.key_type] = key.key_value;
      return acc;
    }, {});

    // Check for required API keys
    if (!keysMap.openai && !keysMap.gemini) {
      throw new Error('No AI API key found (OpenAI or Gemini)');
    }

    // Parse request body
    const { phone, message, name = "Customer" }: WhatsAppRequest = await req.json();

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: 'Phone number and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Look up or create contact
    let contactId;
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id')
      .eq('phone_number', phone)
      .maybeSingle();

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      const { data: newContact, error: contactError } = await supabase
        .from('contacts')
        .insert({
          phone_number: phone,
          name: name,
          tags: ['whatsapp']
        })
        .select('id')
        .single();

      if (contactError) {
        throw new Error(`Error creating contact: ${contactError.message}`);
      }
      
      contactId = newContact.id;
    }

    // Get or create a chat session
    let sessionId;
    const { data: existingSession } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('contact_id', contactId)
      .eq('status', 'open')
      .order('last_activity', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingSession) {
      sessionId = existingSession.id;
    } else {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({
          contact_id: contactId,
          status: 'open',
          last_activity: new Date().toISOString()
        })
        .select('id')
        .single();

      if (sessionError) {
        throw new Error(`Error creating session: ${sessionError.message}`);
      }
      
      sessionId = newSession.id;
    }

    // Save the incoming message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        contact_id: contactId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

    if (messageError) {
      throw new Error(`Error saving message: ${messageError.message}`);
    }

    // Get conversation history
    const { data: messageHistory } = await supabase
      .from('messages')
      .select('role, content, timestamp')
      .eq('contact_id', contactId)
      .order('timestamp', { ascending: true })
      .limit(10);

    // Format message history for AI
    const formattedMessages: ChatMessage[] = messageHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    // Get AI profile to use
    const { data: aiProfiles } = await supabase
      .from('ai_profiles')
      .select('*')
      .limit(1)
      .maybeSingle();

    let aiResponse = '';

    // Use OpenAI or Gemini based on available keys
    if (keysMap.openai) {
      // OpenAI API call
      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keysMap.openai}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: aiProfiles?.prompt_system || 'You are a helpful WhatsApp customer service assistant.'
            },
            ...formattedMessages
          ],
          max_tokens: 500
        })
      });

      const openaiData = await openaiResponse.json();
      if (openaiData.choices && openaiData.choices[0]) {
        aiResponse = openaiData.choices[0].message.content;
      } else {
        throw new Error('Failed to get response from OpenAI');
      }
    } else if (keysMap.gemini) {
      // Gemini API call (simplified - would need proper implementation)
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': keysMap.gemini
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: message }]
            }
          ]
        })
      });

      const geminiData = await geminiResponse.json();
      if (geminiData.candidates && geminiData.candidates[0]) {
        aiResponse = geminiData.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Failed to get response from Gemini');
      }
    }

    // Apply text-to-speech if ElevenLabs key is available
    if (keysMap.elevenlabs && aiResponse) {
      // This would be where we send the text to ElevenLabs
      // and get back audio, which we'd then send to WhatsApp
      // For now, we'll just log that we would do this
      console.log('Would convert to speech with ElevenLabs');
    }

    // Save AI response
    await supabase
      .from('messages')
      .insert({
        contact_id: contactId,
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      });

    // Update session last activity
    await supabase
      .from('chat_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', sessionId);

    // If WhatsApp API key is available, we would send the message back to WhatsApp
    if (keysMap.whatsapp) {
      console.log('Would send message to WhatsApp');
      // Implementation would depend on WhatsApp Business API provider
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        session_id: sessionId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

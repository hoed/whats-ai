import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;
const geminiApiKey = Deno.env.get("GEMINI_API_KEY")!;
const elevenlabsApiKey = Deno.env.get("ELEVENLABS_API_KEY")!;
const whatsappToken = Deno.env.get("WHATSAPP_TOKEN")!;
const whatsappKey = Deno.env.get("WHATSAPP_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, contactId, language = 'id' } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Load API keys from the database
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('key_name, key_value');
    
    if (apiKeysError) {
      throw new Error(`Error fetching API keys: ${apiKeysError.message}`);
    }
    
    // Create a map of API keys
    const apiKeysMap = apiKeys.reduce((acc, item) => {
      acc[item.key_name] = item.key_value;
      return acc;
    }, {} as Record<string, string>);
    
    // Use API keys from database if available, otherwise use environment variables
    const openaiKey = apiKeysMap['openai_key'] || openaiApiKey;
    const geminiKey = apiKeysMap['gemini_key'] || geminiApiKey;
    const elevenlabsKey = apiKeysMap['elevenlabs_key'] || elevenlabsApiKey;
    const whatsappKey = apiKeysMap['whatsapp_key'] || whatsappToken;
    
    // Load training data from the database
    const { data: trainingData, error: trainingError } = await supabase
      .from('training_data')
      .select('content');
    
    if (trainingError) {
      throw new Error(`Error fetching training data: ${trainingError.message}`);
    }
    
    // Prepare the context from training data
    const trainingContext = trainingData.map(item => item.content).join("\n\n");
    
    // Load AI profile if specified for the session
    const { data: sessionData, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();
    
    if (sessionError && sessionError.code !== 'PGRST116') {
      throw new Error(`Error fetching session: ${sessionError.message}`);
    }
    
    // Fetch recent conversation history
    const { data: messageHistory, error: messageError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('contact_id', contactId)
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (messageError) {
      throw new Error(`Error fetching message history: ${messageError.message}`);
    }
    
    // Format conversation history for the AI
    const conversationHistory = messageHistory
      .reverse()
      .map(msg => ({ role: msg.role, content: msg.content }));
    
    // Get AI profile system prompt if specified
    let systemPrompt = language === 'id' 
      ? "Anda adalah asisten AI yang membantu untuk akun bisnis WhatsApp."
      : "You are a helpful AI assistant for a WhatsApp business account.";
    
    let aiModel = 'openai'; // Default to OpenAI
    
    if (sessionData?.ai_profile_id) {
      const { data: aiProfile, error: profileError } = await supabase
        .from('ai_profiles')
        .select('prompt_system, ai_model')
        .eq('id', sessionData.ai_profile_id)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(`Error fetching AI profile: ${profileError.message}`);
      }
      
      if (aiProfile) {
        systemPrompt = aiProfile.prompt_system;
        aiModel = aiProfile.ai_model || 'openai';
      }
    }
    
    // Enhance system prompt with training data
    const enhancedSystemPrompt = language === 'id'
      ? `${systemPrompt}\n\nGunakan informasi berikut untuk menjawab pertanyaan pelanggan:\n${trainingContext}`
      : `${systemPrompt}\n\nUse the following information to answer customer questions:\n${trainingContext}`;
    
    let aiReply;
    
    // Choose AI model based on profile setting
    if (aiModel === 'gemini' && geminiKey) {
      // Use Gemini model
      const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiKey
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `System instructions: ${enhancedSystemPrompt}`
                }
              ]
            },
            ...conversationHistory.map(msg => ({
              role: msg.role === "ai" ? "model" : "user",
              parts: [{ text: msg.content }]
            })),
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800
          }
        })
      });
      
      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
      }
      
      const aiResult = await geminiResponse.json();
      aiReply = aiResult.candidates[0].content.parts[0].text;
      
    } else if (openaiKey) {
      // Use OpenAI model (default)
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: enhancedSystemPrompt },
            ...conversationHistory.map(msg => ({ 
              role: msg.role, 
              content: msg.content 
            })),
            { role: "user", content: message }
          ],
        }),
      });
      
      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }
      
      const aiResult = await openaiResponse.json();
      aiReply = aiResult.choices[0].message.content;
    } else {
      throw new Error("No valid AI model API key available");
    }
    
    // Get user_id (in a real app, this would come from auth)
    const user_id = "00000000-0000-0000-0000-000000000000"; // Placeholder
    
    // Store the user message and AI reply in the database
    const { error: insertUserError } = await supabase
      .from('messages')
      .insert({
        contact_id: contactId,
        role: 'user',
        content: message,
        user_id: user_id
      });
    
    if (insertUserError) {
      throw new Error(`Error storing user message: ${insertUserError.message}`);
    }
    
    const { error: insertAIError } = await supabase
      .from('messages')
      .insert({
        contact_id: contactId,
        role: 'ai',
        content: aiReply,
        ai_profile_id: sessionData?.ai_profile_id || null,
        user_id: user_id
      });
    
    if (insertAIError) {
      throw new Error(`Error storing AI message: ${insertAIError.message}`);
    }
    
    // Update session last activity timestamp
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', sessionId);
    
    if (updateError) {
      throw new Error(`Error updating session: ${updateError.message}`);
    }
    
    // Generate speech from text using ElevenLabs if API key is available
    let audioUrl = null;
    if (elevenlabsKey) {
      try {
        const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Sarah voice
        
        const elevenlabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "xi-api-key": elevenlabsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: aiReply,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8,
            }
          }),
        });
        
        if (elevenlabsResponse.ok) {
          // Convert audio to base64
          const audioBlob = await elevenlabsResponse.blob();
          const audioBuffer = await audioBlob.arrayBuffer();
          const audioBase64 = btoa(
            String.fromCharCode(...new Uint8Array(audioBuffer))
          );
          
          audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        } else {
          console.error("Error from ElevenLabs API:", await elevenlabsResponse.text());
        }
      } catch (error) {
        console.error("Error generating speech:", error);
        // Continue without audio if there's an error
      }
    }
    
    return new Response(
      JSON.stringify({ 
        reply: aiReply, 
        audioUrl: audioUrl 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in whatsapp-chat function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});

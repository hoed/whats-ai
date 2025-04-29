
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;
const elevenlabsApiKey = Deno.env.get("ELEVENLABS_API_KEY")!;

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
    const { message, sessionId, contactId } = await req.json();
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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
      .single();
    
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
    let systemPrompt = "You are a helpful AI assistant for a WhatsApp business account.";
    
    if (sessionData?.ai_profile_id) {
      const { data: aiProfile, error: profileError } = await supabase
        .from('ai_profiles')
        .select('prompt_system')
        .eq('id', sessionData.ai_profile_id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(`Error fetching AI profile: ${profileError.message}`);
      }
      
      if (aiProfile) {
        systemPrompt = aiProfile.prompt_system;
      }
    }
    
    // Enhance system prompt with training data
    const enhancedSystemPrompt = `${systemPrompt}\n\nUse the following information to answer customer questions:\n${trainingContext}`;
    
    // Create OpenAI chat completion request
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: enhancedSystemPrompt },
          ...conversationHistory,
          { role: "user", content: message }
        ],
      }),
    });
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    const aiResult = await openaiResponse.json();
    const aiReply = aiResult.choices[0].message.content;
    
    // Store the user message and AI reply in the database
    const { error: insertUserError } = await supabase
      .from('messages')
      .insert({
        contact_id: contactId,
        role: 'user',
        content: message,
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
    
    // Generate speech from text using ElevenLabs if needed
    let audioUrl = null;
    try {
      const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Sarah voice
      
      const elevenlabsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenlabsApiKey,
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

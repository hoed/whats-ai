
import { supabase } from "@/integrations/supabase/client";
import { Contact, Message, AIProfile, Template, ChatSession, Stats } from "@/types";

// Default user_id for development purposes
// In a real app, you'd get this from authentication context
const DEFAULT_USER_ID = "00000000-0000-0000-0000-000000000000";

// Contacts
export const fetchContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Contact[];
};

// Messages
export const fetchMessages = async (sessionId: string) => {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('contact_id')
    .eq('id', sessionId)
    .single();

  if (!session) throw new Error('Session not found');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('contact_id', session.contact_id)
    .order('timestamp', { ascending: true });
  
  if (error) throw error;
  return data as Message[];
};

// Chat Sessions
export const fetchChatSessions = async () => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(`
      *,
      contact:contacts (
        name,
        phone_number,
        tags
      )
    `)
    .order('last_activity', { ascending: false });
  
  if (error) throw error;
  return data as ChatSession[];
};

// AI Profiles
export const fetchAIProfiles = async () => {
  const { data, error } = await supabase
    .from('ai_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as AIProfile[];
};

// Templates
export const fetchTemplates = async () => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Template[];
};

// Stats
export const fetchStats = async (): Promise<Stats> => {
  const { count: total_conversations } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true });

  const { count: active_conversations } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open');

  const { count: resolved_conversations } = await supabase
    .from('chat_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'closed');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: new_contacts_today } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  return {
    total_conversations: total_conversations || 0,
    active_conversations: active_conversations || 0,
    resolved_conversations: resolved_conversations || 0,
    new_contacts_today: new_contacts_today || 0
  };
};

// Update Chat Session Status
export const updateChatSessionStatus = async (sessionId: string, status: 'open' | 'pending' | 'closed') => {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ 
      status,
      last_activity: new Date().toISOString()
    })
    .eq('id', sessionId);
  
  if (error) throw error;
};

// Send Message
export const sendMessage = async (sessionId: string, content: string) => {
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('contact_id')
    .eq('id', sessionId)
    .single();

  if (!session) throw new Error('Session not found');

  const { error } = await supabase
    .from('messages')
    .insert({
      contact_id: session.contact_id,
      role: 'ai',
      content,
      timestamp: new Date().toISOString(),
      user_id: DEFAULT_USER_ID
    });
  
  if (error) throw error;

  // Update session last activity
  await supabase
    .from('chat_sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', sessionId);
};

// Create user settings if they don't exist
export const syncUserSettings = async (userId: string) => {
  const { data: existingSettings, error: checkError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (!existingSettings) {
    const { error: insertError } = await supabase
      .from('user_settings')
      .insert([
        { 
          user_id: userId,
          dark_mode: false,
          notifications: true,
          language: 'id'  // Default to Indonesian
        }
      ]);
    
    if (insertError) throw insertError;
  }
};

// Save API Keys with type
export const saveApiKey = async (keyName: string, keyValue: string, keyType: 'whatsapp' | 'openai' | 'gemini' | 'elevenlabs') => {
  // Check if this key already exists
  const { data: existingKey, error: checkError } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_name', keyName)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existingKey) {
    // Update existing key
    const { error } = await supabase
      .from('api_keys')
      .update({ 
        key_value: keyValue,
        key_type: keyType
      })
      .eq('id', existingKey.id);
    if (error) throw error;
  } else {
    // Create new key
    const { error } = await supabase
      .from('api_keys')
      .insert([
        { 
          key_name: keyName, 
          key_value: keyValue,
          key_type: keyType
        }
      ]);
    if (error) throw error;
  }
};

// Get API Keys
export const getApiKeys = async () => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_name, key_value, key_type');
  
  if (error) throw error;
  
  // Convert to an easy-to-use object
  const keysObject: Record<string, {value: string, type: string}> = {};
  data.forEach(item => {
    keysObject[item.key_name] = {
      value: item.key_value,
      type: item.key_type
    };
  });
  
  return keysObject;
};

// Additional utility function to get the current user ID
export const getCurrentUserId = () => {
  // In a production app, this would come from auth state
  return DEFAULT_USER_ID;
};


import { Database } from '@/integrations/supabase/types';

export interface Contact {
  id: string;
  phone_number: string;
  name: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  contact_id: string;
  role: string; // Changed from 'user' | 'ai' to string to match DB
  content: string;
  timestamp: string;
  ai_profile_id?: string;
  template_id?: string;
  training_data_id?: string;
  user_id: string; // Added required field from DB schema
}

export interface AIProfile {
  id: string;
  name: string;
  description: string;
  prompt_system: string;
  created_at: string;
  user_id: string; // Added required field
  ai_model?: string; // Added optional field
  api_key_id?: string | null; // Added optional fields
  openai_api_key_id?: string | null;
  gemini_api_key_id?: string | null;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  user_id?: string; // Added optional field
  api_key_id?: string | null; // Added optional field
}

export interface ChatSession {
  id: string;
  contact_id: string;
  status: 'open' | 'pending' | 'closed';
  last_activity: string;
  assigned_to: string | null;
  contact?: Contact;
}

export interface Stats {
  total_conversations: number;
  active_conversations: number;
  resolved_conversations: number;
  new_contacts_today: number;
}

// Updated to use DB types consistently
export type TrainingData = {
  id: string;
  title: string;
  content: string;
  category?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  api_key_id?: string | null;
};

// API Keys and settings types to match DB
export interface UserSettings {
  id: string;
  user_id?: string;
  dark_mode: boolean;
  notifications: boolean;
  language: string;
  voice_id?: string;
  voice_model?: string;
  stability?: number;
  similarity_boost?: number;
  auto_voice_responses?: boolean;
  ai_provider?: string;
  preferred_whatsapp_provider?: string;
  elevenlabs_api_key_id?: string;
  whatsapp_api_key_id?: string;
  twilio_api_key_id?: string;
  updated_at?: string;
}

export interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  key_type: string;
  user_id: string;
  created_at: string;
}

export type { Database };

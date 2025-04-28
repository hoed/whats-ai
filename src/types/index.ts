
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
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface AIProfile {
  id: string;
  name: string;
  description: string;
  prompt_system: string;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
}

export interface ChatSession {
  id: string;
  contact_id: string;
  status: 'open' | 'pending' | 'closed';
  last_activity: string;
  assigned_to: string | null;
  contact?: Contact; // For joined data
}

export interface Stats {
  total_conversations: number;
  active_conversations: number;
  resolved_conversations: number;
  new_contacts_today: number;
}


import { Contact, Message, AIProfile, Template, ChatSession, Stats } from '@/types';

// Generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Generate random phone numbers
const generatePhoneNumber = () => `+62${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;

// Generate random timestamps within the last 7 days
const generateTimestamp = (daysAgo: number = 7) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(date.getHours() - Math.floor(Math.random() * 24));
  date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 60));
  return date.toISOString();
};

// Generate mock contacts
export const mockContacts: Contact[] = Array(20).fill(null).map((_, index) => ({
  id: generateId(),
  phone_number: generatePhoneNumber(),
  name: `Customer ${index + 1}`,
  tags: index % 5 === 0 ? ['VIP'] : index % 3 === 0 ? ['New'] : [],
  created_at: generateTimestamp(30),
  updated_at: generateTimestamp(2),
}));

// Generate mock AI profiles
export const mockAIProfiles: AIProfile[] = [
  {
    id: generateId(),
    name: 'Friendly Support Agent',
    description: 'Warm, friendly, and helpful customer support agent',
    prompt_system: 'You are a friendly customer support agent. Be warm, conversational, and helpful. Always greet the customer by name if known.',
    created_at: generateTimestamp(60),
  },
  {
    id: generateId(),
    name: 'Professional Sales Representative',
    description: 'Formal, professional sales representative focused on conversions',
    prompt_system: 'You are a professional sales representative. Be formal, direct, and focused on driving sales conversions while providing excellent service.',
    created_at: generateTimestamp(45),
  },
  {
    id: generateId(),
    name: 'Technical Support Specialist',
    description: 'Technical expert focused on solving complex problems',
    prompt_system: 'You are a technical support specialist. Focus on efficiently solving technical problems and providing step-by-step guidance when needed.',
    created_at: generateTimestamp(30),
  },
  {
    id: generateId(),
    name: 'Customer Retention Agent',
    description: 'Specialist in retaining customers who are considering leaving',
    prompt_system: 'You are a customer retention specialist. Your goal is to understand customer concerns, address them empathetically, and find solutions to keep them as customers.',
    created_at: generateTimestamp(15),
  },
];

// Generate mock templates
export const mockTemplates: Template[] = [
  {
    id: generateId(),
    title: 'Welcome New Customer',
    content: 'Halo {name}, terima kasih telah menghubungi kami. Ada yang bisa kami bantu hari ini?',
    tags: ['Greeting', 'New Customer'],
    created_at: generateTimestamp(90),
  },
  {
    id: generateId(),
    title: 'Order Confirmation',
    content: 'Pesanan Anda #{orderId} telah kami terima dan sedang diproses. Terima kasih atas kepercayaan Anda!',
    tags: ['Order', 'Confirmation'],
    created_at: generateTimestamp(80),
  },
  {
    id: generateId(),
    title: 'Shipping Update',
    content: 'Pesanan Anda #{orderId} telah dikirim via {courier} dengan nomor resi {trackingNumber}. Estimasi tiba dalam 2-3 hari kerja.',
    tags: ['Shipping', 'Update'],
    created_at: generateTimestamp(70),
  },
  {
    id: generateId(),
    title: 'Payment Reminder',
    content: 'Kami ingin mengingatkan bahwa pembayaran untuk invoice #{invoiceId} sebesar Rp{amount} akan jatuh tempo pada {dueDate}.',
    tags: ['Payment', 'Reminder'],
    created_at: generateTimestamp(60),
  },
  {
    id: generateId(),
    title: 'Problem Resolution',
    content: 'Kami mohon maaf atas ketidaknyamanannya. Tim kami sedang menyelesaikan masalah Anda dan akan memberikan update segera.',
    tags: ['Support', 'Problem'],
    created_at: generateTimestamp(50),
  },
  {
    id: generateId(),
    title: 'Follow-Up',
    content: 'Halo {name}, apakah masalah Anda sudah teratasi? Kami ingin memastikan Anda sudah mendapatkan solusi yang tepat.',
    tags: ['Follow-Up', 'Support'],
    created_at: generateTimestamp(40),
  },
  {
    id: generateId(),
    title: 'Refund Information',
    content: 'Permintaan refund Anda telah disetujui. Dana sebesar Rp{amount} akan dikembalikan ke rekening Anda dalam 3-5 hari kerja.',
    tags: ['Refund', 'Finance'],
    created_at: generateTimestamp(30),
  },
];

// Generate mock chat sessions
export const mockChatSessions: ChatSession[] = mockContacts.slice(0, 10).map((contact, index) => ({
  id: generateId(),
  contact_id: contact.id,
  status: index % 3 === 0 ? 'open' : index % 3 === 1 ? 'pending' : 'closed',
  last_activity: generateTimestamp(1),
  assigned_to: index % 4 === 0 ? 'AI Agent' : null,
  contact: contact,
}));

// Generate mock messages for each chat session
export const mockMessages: Record<string, Message[]> = {};

mockChatSessions.forEach((session) => {
  const messageCount = 3 + Math.floor(Math.random() * 8); // 3-10 messages
  const messages: Message[] = [];

  for (let i = 0; i < messageCount; i++) {
    const isUser = i % 2 === 0;
    
    let content = '';
    if (isUser) {
      const userMessages = [
        'Halo, saya ingin bertanya tentang produk Anda.',
        'Bagaimana cara melakukan pemesanan?',
        'Apakah tersedia pengiriman ke luar kota?',
        'Berapa lama estimasi pengiriman?',
        'Apakah ada diskon untuk pembelian dalam jumlah besar?',
        'Saya ada kendala dengan pesanan saya.',
        'Bagaimana cara melakukan pengembalian barang?',
        'Terima kasih atas bantuannya!'
      ];
      content = userMessages[Math.floor(Math.random() * userMessages.length)];
    } else {
      const aiMessages = [
        `Halo ${session.contact?.name || 'Customer'}, ada yang bisa kami bantu?`,
        'Terima kasih atas pertanyaan Anda. Untuk melakukan pemesanan, Anda bisa mengunjungi website kami atau langsung melalui WhatsApp ini.',
        'Ya, kami melayani pengiriman ke seluruh Indonesia menggunakan berbagai jasa kurir.',
        'Estimasi pengiriman ke area Jabodetabek adalah 1-2 hari kerja, sedangkan untuk luar Jabodetabek sekitar 3-5 hari kerja.',
        'Untuk pembelian dalam jumlah besar, kami menyediakan diskon khusus. Bisa dijelaskan berapa jumlah yang Anda butuhkan?',
        'Mohon maaf atas kendala yang Anda alami. Boleh tolong informasikan nomor pesanan Anda agar kami bisa bantu cek?',
        'Untuk pengembalian barang, Anda bisa mengisi formulir pengembalian di website kami dan mengirimkan kembali barang tersebut dalam waktu 7 hari setelah penerimaan.',
        'Sama-sama! Jika ada pertanyaan lain, jangan ragu untuk menghubungi kami kembali.'
      ];
      content = aiMessages[Math.floor(Math.random() * aiMessages.length)];
    }
    
    messages.push({
      id: generateId(),
      contact_id: session.contact_id,
      role: isUser ? 'user' : 'ai',
      content: content,
      timestamp: generateTimestamp(1),
    });
  }
  
  // Sort messages by timestamp (older first)
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  mockMessages[session.id] = messages;
});

// Generate mock stats
export const mockStats: Stats = {
  total_conversations: mockChatSessions.length,
  active_conversations: mockChatSessions.filter(session => session.status === 'open').length,
  resolved_conversations: mockChatSessions.filter(session => session.status === 'closed').length,
  new_contacts_today: 3,
};

// Mock service functions
export const fetchContacts = async (): Promise<Contact[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockContacts]), 500);
  });
};

export const fetchChatSessions = async (): Promise<ChatSession[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockChatSessions]), 500);
  });
};

export const fetchMessages = async (sessionId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMessages[sessionId] || []), 500);
  });
};

export const fetchAIProfiles = async (): Promise<AIProfile[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockAIProfiles]), 500);
  });
};

export const fetchTemplates = async (): Promise<Template[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockTemplates]), 500);
  });
};

export const fetchStats = async (): Promise<Stats> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({...mockStats}), 500);
  });
};

export const sendMessage = async (sessionId: string, message: string): Promise<Message> => {
  return new Promise((resolve) => {
    const session = mockChatSessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Create user message
    const userMessage: Message = {
      id: generateId(),
      contact_id: session.contact_id,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    
    // Add message to mock data
    if (!mockMessages[sessionId]) {
      mockMessages[sessionId] = [];
    }
    mockMessages[sessionId].push(userMessage);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: generateId(),
        contact_id: session.contact_id,
        role: 'ai',
        content: `This is an automated response to: "${message}". In a real implementation, this would be generated by OpenAI API.`,
        timestamp: new Date().toISOString(),
      };
      mockMessages[sessionId].push(aiResponse);
    }, 1000);
    
    setTimeout(() => resolve(userMessage), 500);
  });
};

export const updateChatSessionStatus = async (
  sessionId: string, 
  status: 'open' | 'pending' | 'closed'
): Promise<ChatSession> => {
  return new Promise((resolve) => {
    const sessionIndex = mockChatSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    mockChatSessions[sessionIndex] = {
      ...mockChatSessions[sessionIndex],
      status,
    };
    
    setTimeout(() => resolve(mockChatSessions[sessionIndex]), 500);
  });
};

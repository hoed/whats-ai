# 📞 Talking AI Inbound Customer Service - WhatsApp Integration

An AI-driven inbound customer service system for WhatsApp, powered by **OpenAI API** and **Supabase**.  
This system automatically handles incoming WhatsApp messages, recognizes known and new contacts, replies intelligently, and provides a powerful admin dashboard for management and analytics.

---

## ✨ Features

- **WhatsApp Integration** (via Twilio, Meta Cloud API, or custom gateway)
- **AI Responses** powered by **OpenAI GPT-4** (or GPT-3.5)
- **Contact Management** with auto-detection of new/existing numbers
- **Contextual Conversation Memory** (based on recent chat history)
- **Persona Switching** for different AI agent styles (Sales, Support, Formal, Friendly)
- **Template Responses** with fallback for common queries
- **Session Management** (open, pending, closed conversations)
- **Real-Time Chat Updates** using Supabase subscriptions
- **Admin Panel Dashboard** (React.js / Next.js) for monitoring and control
- **Analytics and Reports** (sentiment analysis, response times, message volumes)
- **Compliance and Security** (data encryption, audit logging)

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    A[WhatsApp Incoming Message] --> B[Webhook Server (Node.js / FastAPI)]
    B --> C{Contact Exists?}
    C -- Yes --> D[Fetch Chat History from Supabase]
    C -- No --> E[Create New Contact in Supabase]
    D --> F[Send Chat Context to OpenAI API]
    E --> F[Send Initial Context to OpenAI API]
    F --> G[Receive AI Response]
    G --> H[Save Message to Supabase]
    G --> I[Reply to WhatsApp API]
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js / FastAPI
- **Database**: Supabase (PostgreSQL + Realtime)
- **AI Engine**: OpenAI (ChatGPT API)
- **Messaging API**: WhatsApp Business API / Twilio / Meta Cloud
- **Frontend Admin Panel**: Next.js / React.js
- **Hosting**: Vercel / Railway / AWS

---

## 🗂️ Database Schema (Supabase)

### Contacts Table (`contacts`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique contact ID |
| phone_number | String | WhatsApp number |
| name | String | Contact name |
| tags | Array of String | Customer tags |
| created_at | Timestamp | Creation date |
| updated_at | Timestamp | Last update |

### Messages Table (`messages`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique message ID |
| contact_id | UUID (FK) | Reference to contact |
| role | Enum ('user', 'ai') | Message sender |
| content | Text | Message body |
| timestamp | Timestamp | Sent time |

### AI Profiles (`ai_profiles`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique profile ID |
| name | String | Profile name |
| description | Text | Personality description |
| prompt_system | Text | System prompt for OpenAI |

### Templates (`templates`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique template ID |
| title | String | Template title |
| content | Text | Template content |
| tags | Array of String | Tags for classification |

### Chat Sessions (`chat_sessions`)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique session ID |
| contact_id | UUID (FK) | Reference to contact |
| status | Enum ('open', 'pending', 'closed') | Session status |
| last_activity | Timestamp | Last active timestamp |
| assigned_to | String (nullable) | Assigned agent name |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   pip install -r requirements.txt
   ```
   (depending on Node.js or FastAPI setup)

3. **Create `.env` file** with your credentials:
   ```
   OPENAI_API_KEY=your-openai-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   WHATSAPP_API_TOKEN=your-whatsapp-token
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Deploy** to Vercel / Railway / your preferred platform.

---

## 📊 Admin Panel

- Manage contacts and sessions.
- Monitor conversation statistics.
- Update AI settings and personas.
- View and edit message templates.

(Admin Panel setup instructions in `/frontend` folder.)

---

## 📋 Roadmap

- [x] WhatsApp Integration
- [x] Supabase Database
- [x] AI-Powered Messaging
- [ ] Human Agent Escalation
- [ ] Multi-language Support
- [ ] CRM / Ticketing System Integration
- [ ] Voice Message Handling

---

## 🤝 Contributing

We welcome contributions!  
Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🔥 Acknowledgements

- [OpenAI](https://openai.com/)
- [Supabase](https://supabase.com/)
- [Twilio WhatsApp API](https://www.twilio.com/whatsapp)
- [Meta Cloud API](https://developers.facebook.com/docs/whatsapp)

---

---

Kalau mau, saya juga bisa buatkan sekalian:
- Struktur folder (backend + frontend)
- Template file `CONTRIBUTING.md` + `LICENSE`
- CI/CD pipeline contoh (Vercel + Railway auto deploy)

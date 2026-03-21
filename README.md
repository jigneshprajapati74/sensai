# 🧠 SensAI — AI-Powered Career Coach

![SensAI](https://img.shields.io/badge/SensAI-AI%20Career%20Coach-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-sensai--lovat--six.vercel.app-6366f1?style=for-the-badge)](https://sensai-lovat-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Your intelligent career companion — from resume to dream job.**

[🌐 Live Demo](https://sensai-lovat-six.vercel.app) • [🐛 Report Bug](https://github.com/jigneshprajapati74/sensai/issues) • [✨ Request Feature](https://github.com/jigneshprajapati74/sensai/issues)

---

## 📌 What is SensAI?

**SensAI** is a full-stack AI career coaching platform that helps job seekers at every step of their journey — from building a standout resume to acing mock interviews. Powered by **Google Gemini AI**, SensAI provides real-time, personalized career guidance tailored to your industry and goals.

Whether you're a fresher or a seasoned professional, SensAI makes career growth smarter, faster, and more accessible.

---

## ✨ Features

### 📄 AI Resume Builder
- Generate professional, ATS-friendly resumes using AI
- Export to PDF with one click
- Clean, modern resume templates

### 🎤 Mock Interview Coach
- Practice with AI-generated interview questions tailored to your role
- Get instant feedback and scoring
- Track your performance over time with visual charts

### 🌍 Industry Insights
- Real-time industry trends and salary data
- In-demand skills and career path guidance
- Market intelligence to help you make smarter career decisions

### ✉️ Cover Letter Generator
- AI-crafted cover letters personalized to the job description
- Multiple tone options (professional, creative, confident)
- Edit with a built-in Markdown editor

### 🎨 AI Media Studio
- Generate professional images and videos using AI
- Powered by Replicate API
- Save and manage your media generations

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **AI Engine** | Google Gemini AI |
| **Image/Video AI** | Replicate API |
| **Authentication** | Clerk |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma 7 + pg adapter |
| **Background Jobs** | Inngest |
| **UI Components** | shadcn/ui + Radix UI |
| **Styling** | Tailwind CSS v4 |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **PDF Export** | html2pdf.js |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+
- npm / yarn / pnpm
- A [Clerk](https://clerk.com) account
- A [Google Gemini](https://ai.google.dev) API key
- A [Supabase](https://supabase.com) account (PostgreSQL)
- A [Replicate](https://replicate.com) API key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jigneshprajapati74/sensai.git
cd sensai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Database (Supabase)
# Pooled connection - for app runtime
DATABASE_URL="postgresql://postgres.xxxx:PASSWORD@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
# Direct connection - for migrations
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres"

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Replicate AI (Image/Video Generation)
REPLICATE_API_KEY=your_replicate_api_key

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
sensai/
├── app/               # Next.js App Router pages & layouts
├── actions/           # Server actions (AI calls, DB operations)
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/
│   └── db.js          # Prisma client with pg adapter
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Migration history
├── data/              # Static data (industry lists, etc.)
├── prisma.config.ts   # Prisma 7 config
└── public/            # Static assets
```

---

## 🗄️ Database Setup (Prisma 7 + Supabase)

This project uses **Prisma 7** with the `@prisma/adapter-pg` driver adapter and **Supabase** as the PostgreSQL provider.

### Why Supabase over Neon?
- ✅ Never auto-suspends on free tier
- ✅ More reliable connections
- ✅ Built-in connection pooling (PgBouncer)
- ✅ Better performance for Next.js serverless

### Connection Strategy
```
DATABASE_URL (Transaction pooler :6543) → used by app at runtime
DIRECT_URL   (Direct connection  :5432) → used by Prisma migrations
```

### `prisma.config.ts`
```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
```

### `lib/db.js`
```js
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL;

const pool = globalForPrisma.pool ?? new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool;
}
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Fork this repository
2. Import into [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy 🚀

---

## 🚧 Project Status

> ⚠️ **This project is currently under active development.**

### ✅ Working
- User authentication (Clerk)
- AI Resume Builder with PDF export
- AI Cover Letter Generator
- Industry Insights dashboard
- Mock Interview with AI-generated questions
- AI Media Studio (Image & Video generation)
- Prisma 7 + Supabase database

### 🔧 In Progress / Known Issues
- Mobile responsiveness improvements
- Interview feedback scoring refinement
- More resume templates coming
- Better error handling for AI API failures
- Dark/light theme inconsistencies

### 🗺️ Upcoming Features
- LinkedIn profile integration
- Job application tracker
- AI-powered job matching
- Multi-language support

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Jignesh Prajapati**

[![GitHub](https://img.shields.io/badge/GitHub-jigneshprajapati74-181717?style=flat&logo=github)](https://github.com/jigneshprajapati74)
[![Gmail](https://img.shields.io/badge/Gmail-jigneshprajapati745086@gmail.com-EA4335?style=flat&logo=gmail)](mailto:jigneshprajapati745086@gmail.com)

---

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ by Jignesh Prajapati
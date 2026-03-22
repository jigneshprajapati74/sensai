# 🧠 SensAI — AI-Powered Career Coach

![SensAI](https://img.shields.io/badge/SensAI-AI%20Career%20Coach-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)
[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-sensai--lovat--six.vercel.app-6366f1?style=for-the-badge)](https://sensai-lovat-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![Replicate](https://img.shields.io/badge/Replicate-AI_Media-000000?style=for-the-badge&logo=replicate)](https://replicate.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Your intelligent career companion — from resume to dream job.**

[🌐 Live Demo](https://sensai-lovat-six.vercel.app) • [🐛 Report Bug](https://github.com/jigneshprajapati74/sensai/issues) • [✨ Request Feature](https://github.com/jigneshprajapati74/sensai/issues)

---

## 📌 What is SensAI?

**SensAI** is a full-stack AI career coaching platform that helps job seekers at every step of their journey — from building a standout resume to acing mock interviews. Powered by **Google Gemini AI** and **Replicate API**, SensAI provides real-time, personalized career guidance and AI-generated media tailored to your industry and goals.

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

### 🎨 AI Media Studio *(New Feature)*
- Generate professional **images** and **videos** using AI via [Replicate API](https://replicate.com)
- **Image model:** `black-forest-labs/flux-dev` (free tier)
- **Video model:** `minimax/video-01` (free tier)
- **3 free image generations** per user — no credits needed to start
- Credit-based system for paid generations (1 credit/image, 5 credits/video)
- Full **generation history** — browse all past images and videos
- Live preview of latest result right in the UI
- Test credit purchase system (for development/demo)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **AI Engine** | Google Gemini AI |
| **Image/Video AI** | Replicate API (`flux-dev`, `minimax/video-01`) |
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
- A [Replicate](https://replicate.com) API key *(required for AI Media Studio)*
- An [Inngest](https://inngest.com) account

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
# ──────────────────────────────────────────
# Clerk Authentication
# Get from: https://dashboard.clerk.com
# ──────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ──────────────────────────────────────────
# Database (Supabase PostgreSQL)
# Get from: https://supabase.com/dashboard → Project Settings → Database
# ──────────────────────────────────────────
# Pooled connection (Transaction mode :6543) — used by app at runtime
DATABASE_URL="postgresql://postgres.xxxx:PASSWORD@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"
# Direct connection (:5432) — used by Prisma migrations only
DIRECT_URL="postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres"

# ──────────────────────────────────────────
# Google Gemini AI
# Get from: https://aistudio.google.com/app/apikey
# ──────────────────────────────────────────
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ──────────────────────────────────────────
# Replicate API — AI Image & Video Generation
# Get from: https://replicate.com/account/api-tokens
# Used by: AI Media Studio (image + video generation)
# Models used:
#   Image → black-forest-labs/flux-dev  (free tier)
#   Video → minimax/video-01            (free tier)
# ──────────────────────────────────────────
REPLICATE_API_KEY=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ──────────────────────────────────────────
# Inngest — Background Jobs
# Get from: https://app.inngest.com/settings/api-keys
# ──────────────────────────────────────────
INNGEST_EVENT_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
INNGEST_SIGNING_KEY=signkey-prod-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** `REPLICATE_API_KEY` is required for the AI Media Studio feature. Without it, image and video generation will throw an error. You can get a free API key at [replicate.com](https://replicate.com) — no credit card required to start.

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

## 🎨 AI Media Studio — Deep Dive

The AI Media Studio is powered entirely by the [Replicate API](https://replicate.com) — a platform that hosts thousands of open-source AI models.

### How it works

```
User enters prompt
        ↓
Server Action (actions/media.js)
        ↓
POST /v1/models/{model}/predictions  ← Replicate API
        ↓
Poll prediction status every 3s
        ↓
Return image/video URL
        ↓
Save to database (MediaGeneration table)
        ↓
Display in UI
```

### Models Used

| Type | Model | Details |
|---|---|---|
| **Image** | `black-forest-labs/flux-dev` | Fast, high-quality image generation. Output: WebP. Free tier available. |
| **Video** | `minimax/video-01` | Text-to-video generation with built-in prompt optimizer. Output: MP4. Free tier available. |

### Credit System

| Action | Cost |
|---|---|
| Image generation (first 3) | **Free** |
| Image generation (after free limit) | **1 credit** |
| Video generation | **5 credits** |

### Getting a Replicate API Key

1. Go to [replicate.com](https://replicate.com) and sign up (free)
2. Navigate to **Account → API Tokens**
3. Click **Create token**
4. Copy the token (starts with `r8_`)
5. Add it to your `.env` as `REPLICATE_API_KEY=r8_your_token_here`

> Free accounts on Replicate include a small monthly credit allowance — enough to test both image and video generation without a credit card.

### Prisma Schema (AI Media fields)

The feature adds these fields/models to your database:

```prisma
model User {
  // ... existing fields
  creditBalance              Int               @default(0)
  freeImageGenerationsUsed   Int               @default(0)
  mediaGenerations           MediaGeneration[]
  creditTransactions         CreditTransaction[]
}

model MediaGeneration {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id])
  prompt              String
  mediaType           String   // "image" | "video"
  provider            String   // "replicate"
  status              String   // "completed" | "failed"
  resultUrl           String?
  previewUrl          String?
  creditsUsed         Int      @default(0)
  usedFreeGeneration  Boolean  @default(false)
  metadata            Json?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String   // "purchase" | "image_generation" | "video_generation"
  credits     Int
  description String?
  createdAt   DateTime @default(now())
}
```

---

## 📁 Project Structure

```
sensai/
├── app/
│   ├── (auth)/            # Sign-in / Sign-up pages (Clerk)
│   ├── (main)/
│   │   ├── ai-media/      # 🎨 AI Media Studio
│   │   │   ├── page.jsx
│   │   │   └── media-studio.jsx
│   │   ├── ai-cover-letter/
│   │   ├── dashboard/
│   │   ├── interview/
│   │   ├── onboarding/
│   │   └── resume/
│   ├── api/               # API routes (Inngest webhook, etc.)
│   ├── lib/               # Zod schemas
│   ├── globals.css
│   └── layout.js
├── actions/
│   ├── media.js           # Replicate API calls + credit logic
│   ├── interview.js
│   ├── resume.js
│   └── ...
├── components/
│   ├── Header.jsx
│   ├── ScrollRestorer.jsx # Fixes Radix scroll-lock bug on navigation
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/
│   └── db.js              # Prisma client with pg adapter
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/
├── data/                  # Static data (industry lists, etc.)
├── prisma.config.ts
└── public/
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
3. Add all environment variables in the Vercel dashboard (Settings → Environment Variables)
4. Make sure to add `REPLICATE_API_KEY` for AI Media Studio to work
5. Deploy 🚀

---

## 🚧 Project Status

> ⚠️ **This project is currently under active development.**

### ✅ Working
- User authentication (Clerk)
- AI Resume Builder with PDF export
- AI Cover Letter Generator
- Industry Insights dashboard
- Mock Interview with AI-generated questions
- **AI Media Studio** — Image & Video generation via Replicate
- Credit system with free tier + paid credits
- Prisma 7 + Supabase database

### 🔧 In Progress / Known Issues
- Mobile responsiveness improvements
- Interview feedback scoring refinement
- More resume templates coming
- Better error handling for AI API failures
- Real payment gateway integration for credits (currently test mode)

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
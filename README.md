# 🧠 SensAI — AI-Powered Career Coach

<div align="center">

![SensAI Banner](https://img.shields.io/badge/SensAI-AI%20Career%20Coach-6366f1?style=for-the-badge&logo=sparkles&logoColor=white)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-sensai--lovat--six.vercel.app-6366f1?style=for-the-badge)](https://sensai-lovat-six.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Your intelligent career companion — from resume to dream job.**

[🌐 Live Demo](https://sensai-lovat-six.vercel.app) • [🐛 Report Bug](https://github.com/jigneshprajapati74/sensai/issues) • [✨ Request Feature](https://github.com/jigneshprajapati74/sensai/issues)

</div>

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

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **AI Engine** | Google Gemini AI |
| **Authentication** | Clerk |
| **Database ORM** | Prisma |
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

- Node.js 18+
- npm / yarn / pnpm
- A Clerk account (for auth)
- A Google Gemini API key
- A PostgreSQL database (or Neon/Supabase)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jigneshprajapati74/sensai.git
cd sensai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Database
DATABASE_URL=your_postgresql_database_url

# Inngest (Background Jobs)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
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
├── lib/               # Utility functions & helpers
├── prisma/            # Database schema & migrations
├── data/              # Static data (industry lists, etc.)
└── public/            # Static assets
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own instance:

1. Fork this repository
2. Import into [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy 🚀

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

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

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ by Jignesh Prajapati

</div>

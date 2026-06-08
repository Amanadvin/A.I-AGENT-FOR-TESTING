# 🤖 AI Test Automation Agent

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Drizzle%20ORM-C5F74F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe" />
  <img src="https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=for-the-badge" />
</p>

<p align="center">
  <strong>AI-Powered End-to-End Web Testing Automation Platform</strong>
</p>

---

## 📖 Overview

AI Test Automation Agent is an intelligent web testing platform that automates browser testing using AI agents. The system integrates modern technologies such as:

* 🤖 Google Gemini AI
* 🌐 Browserbase Browser Automation
* 🔐 Clerk Authentication
* 💳 Stripe Subscription Payments
* 🗄️ Neon PostgreSQL Database
* ⚡ Next.js 15 & TypeScript

The platform allows users to create automated test workflows, execute browser actions, and generate AI-powered test reports.

---

## ✨ Features

### 🤖 AI Automation

* Generate test cases using Gemini AI
* Intelligent test execution
* AI-powered bug detection
* Automated test reporting

### 🌐 Browser Testing

* Browserbase Integration
* Automated browser sessions
* Real-time test execution
* Cross-browser support

### 🔐 Authentication

* Clerk Authentication
* Secure Login & Signup
* Social Authentication
* Protected Routes

### 💳 Subscription System

* Stripe Payment Integration
* Subscription Management
* Secure Checkout
* Webhook Handling

### 🗄️ Database Management

* Neon PostgreSQL
* Drizzle ORM
* Secure Data Storage
* Scalable Architecture

---

# 🚀 Getting Started

## Prerequisites

Before starting, ensure you have installed:

* Node.js (v18+ Recommended)
* npm / yarn / pnpm
* Git

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# 📥 Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd AI-Test-Automation-Agent
```

---

## 2. Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm:

```bash
pnpm install
```

---

# ⚙️ Environment Variables Setup

Create a `.env` file in the project root directory.

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=http://localhost:3000/api/github/callback

# Gemini AI
GEMINI_API_KEY=

# Browserbase
BROWSERBASE_PROJECT_ID=
BROWSERBASE_API_KEY=
```

---

# 🔑 API Keys Configuration Guide

## 🗄️ Neon PostgreSQL Database

1. Visit https://neon.tech
2. Create an account.
3. Create a new PostgreSQL project.
4. Copy the connection string.
5. Paste it into:

```env
DATABASE_URL=
```

---

## 🔐 Clerk Authentication

1. Visit https://clerk.com
2. Create a new application.
3. Navigate to API Keys.
4. Copy:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

---

## 💳 Stripe Payments

1. Visit https://stripe.com
2. Enable Test Mode.
3. Go to:

```text
Developers → API Keys
```

4. Copy:

```env
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Stripe Webhook Secret

Install Stripe CLI:

```bash
stripe login
```

Start webhook listener:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy generated secret:

```env
STRIPE_WEBHOOK_SECRET=
```

---

## 🐙 GitHub OAuth

1. Login to GitHub.
2. Navigate to:

```text
Settings → Developer Settings → OAuth Apps
```

3. Create a New OAuth App.

Configuration:

```text
Homepage URL:
http://localhost:3000

Authorization Callback URL:
http://localhost:3000/api/github/callback
```

Copy:

```env
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## 🤖 Gemini API

1. Visit https://aistudio.google.com
2. Create API Key.
3. Add it to:

```env
GEMINI_API_KEY=
```

---

## 🌐 Browserbase

1. Visit https://browserbase.com
2. Create a Project.
3. Copy:

```env
BROWSERBASE_PROJECT_ID=
BROWSERBASE_API_KEY=
```

---

# 🗄️ Database Setup

Generate Drizzle schema:

```bash
npx drizzle-kit generate
```

Push schema to database:

```bash
npx drizzle-kit push
```

---

# ▶️ Running The Project

## Development Mode

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

or

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

# 📂 Project Structure

```bash
AI-Test-Automation-Agent/
│
├── app/
├── components/
├── context/
├── lib/
├── db/
├── public/
├── proxy.ts
├── drizzle.config.ts
├── package.json
├── next.config.js
└── .env
```

---

# 🛠️ Tech Stack

| Technology      | Purpose            |
| --------------- | ------------------ |
| Next.js 15      | Frontend Framework |
| TypeScript      | Type Safety        |
| Neon PostgreSQL | Database           |
| Drizzle ORM     | Database ORM       |
| Clerk           | Authentication     |
| Stripe          | Payment Processing |
| Gemini AI       | AI Test Generation |
| Browserbase     | Browser Automation |

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**AI Test Automation Agent Team**

Built with ❤️ using Next.js, Gemini AI, Browserbase, Clerk, Stripe, Neon, and Drizzle ORM.

# Smart Bookmark App

A fullstack Smart Bookmark Manager built using Next.js (App Router) and Supabase.

This application enables users to securely authenticate using Google OAuth, manage personal bookmarks (title + URL), and experience real-time updates without page refresh. The project is fully deployed on Vercel and designed with production-readiness, security, and scalability in mind.

---

## 🚀 Live Demo

Production URL:  
https://smart-bookmark-app-seven-psi.vercel.app

---

## 🛠 Tech Stack

Frontend:
- Next.js (App Router)
- React
- Tailwind CSS

Backend:
- Supabase (Authentication + PostgreSQL + Realtime)

Authentication:
- Google OAuth (no email/password implementation)

Deployment:
- GitHub (version control)
- Vercel (hosting)

---

## ✨ Features

- Secure Google OAuth login
- Automatic user creation via Supabase Auth
- Add bookmarks (Title + URL)
- Delete bookmarks
- Strict user-level data isolation
- Real-time updates across sessions
- Responsive design (desktop + mobile)
- Cross-device compatibility
- Production deployment with environment variables

---

## 🔐 Authentication Flow

Authentication is handled exclusively via Google OAuth.

1. User clicks “Continue with Google”.
2. Supabase redirects to Google for authentication.
3. Google verifies the user.
4. Supabase creates or retrieves the user account.
5. A secure session is stored in the browser.

This approach removes password management complexity and follows modern authentication standards.

---

## 🛡 Database & Security (Row-Level Security)

Bookmarks are stored in a PostgreSQL database managed by Supabase.

Row-Level Security (RLS) is enabled on the `bookmarks` table to enforce strict data isolation.

RLS Policy:
auth.uid() = user_id

This ensures:
- Users can only read their own bookmarks.
- Users can only insert bookmarks tied to their user ID.
- Users can only delete their own bookmarks.

Security is enforced at the database level, not just on the frontend.

---

## ⚡ Real-Time Functionality

Supabase Realtime subscriptions are used to listen for changes in the `bookmarks` table.

When a bookmark is added or deleted:
- The UI updates instantly.
- No manual refresh is required.
- Multiple active sessions remain synchronized.

This demonstrates real-time backend integration.

---

## 🧱 Project Structure

app/
  page.tsx           → Dashboard (bookmark management)
  login/page.tsx     → Google authentication page

lib/
  supabase.ts        → Supabase client configuration

The App Router structure keeps authentication and dashboard logic cleanly separated.

---

## 🎨 UI & Responsiveness

- Built using Tailwind CSS
- Responsive grid layout
- Accessible input styling with proper contrast
- Clean SaaS-style dashboard interface
- Mobile-friendly stacking layout

---

## 🌍 Deployment & Production Setup

1. Project pushed to GitHub.
2. Repository connected to Vercel.
3. Environment variables configured securely:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Supabase Site URL and Redirect URLs configured correctly.
5. Google Cloud OAuth JavaScript origins configured properly.
6. Application tested across multiple devices.

---

## 🧩 Challenges Faced & Solutions

OAuth worked locally but failed in production:
- Root cause: Redirect mismatch between Supabase and Google OAuth settings.
- Solution: Properly configured Supabase Site URL, Redirect URLs, and Google OAuth origins.

Cross-device login issues:
- Root cause: Environment configuration mismatch.
- Solution: Aligned Supabase and Google Cloud configurations for production.

Input visibility issue:
- Root cause: Missing explicit text color styling.
- Solution: Improved Tailwind styling to ensure proper contrast and accessibility.

---

## 💡 Engineering Approach

This project was built with a production-oriented mindset rather than focusing only on minimum functional requirements. Emphasis was placed on:

- Secure OAuth authentication
- Strict database-level access control using RLS
- Real-time synchronization
- Clean code structure
- Cloud deployment best practices
- Cross-device testing

---

## 🧪 Local Development Setup

Clone the repository:

git clone https://github.com/PrathyushGit-into-Official/smart-bookmark-app.git  
cd smart-bookmark-app  

Install dependencies:

npm install  

Create a `.env.local` file:

NEXT_PUBLIC_SUPABASE_URL=your_project_url  
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  

Run the development server:

npm run dev  

---

## 📌 Conclusion

This project demonstrates fullstack engineering capability including OAuth-based authentication, secure database access using Row-Level Security, real-time data synchronization, responsive UI design, and production-grade deployment workflow.

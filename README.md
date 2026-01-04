# 📚 LibriBooks.com - A Modern Book Review Platform

Welcome to **LibriBooks.com**, a feature-rich, modern web application for browsing, reviewing, and discovering books.  
This project is built as an advanced prototype using a powerful stack including **Next.js, TypeScript, Tailwind CSS, ShadCN** for UI components, and integrates **Genkit** for AI-powered features.

This platform demonstrates a complete user experience: from a public-facing website to a comprehensive admin dashboard.

![Libribooks.com Homepage](https://storage.googleapis.com/stedi-assets/screenshots/libribooks-demo.png)

---

## ✨ Features

- **Dynamic Frontend:** Responsive public website for browsing books, reviews, and authors.
- **Advanced Search & Filtering:** Search by title, author, or tags, with category filters.
- **Comprehensive Admin Dashboard:** Secure login area to manage all site content.
- **Content Management (CRUD):**
  - Books
  - Authors
  - Articles
  - Categories & Tags
  - Users (Admin/Editor roles)
  - Static Pages (About, FAQ, etc.)
  - Pop-up Ads
- **AI-Powered Features (Genkit):**
  - Generate detailed book reviews, tags, and quotes.
  - Create concise summaries for SEO.
- **SEO Optimized:**
  - Dynamic `sitemap.xml` and `robots.txt`.
  - Rich structured data (JSON-LD).
  - Optimized metadata for all pages.
- **Dockerized Environment:** Includes `Dockerfile` and `.dockerignore` for easy deployment.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Database (Mock):** Local JSON files (`/src/lib/*.json`)
- **Containerization:** [Docker](https://www.docker.com/)

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone https://github.com/SOULAIMANETS/libribooks.git
cd libribooks
npm install

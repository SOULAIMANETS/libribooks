# 📚 libribooks.com - A Modern Book Review Platform

Welcome to libribooks.com, a feature-rich, modern web application for browsing, reviewing, and discovering books. This project is built as an advanced prototype using a powerful stack including Next.js, TypeScript, Tailwind CSS, and ShadCN for UI components. It also integrates Genkit for AI-powered features.

This platform serves as a high-fidelity prototype, demonstrating a complete user experience from a public-facing website to a comprehensive admin dashboard.

![Libribooks.com Homepage](https://storage.googleapis.com/stedi-assets/screenshots/libribooks-demo.png)

## ✨ Features

-   **Dynamic Frontend:** A fully responsive and interactive public website where users can browse books, read reviews, and explore authors.
-   **Advanced Search & Filtering:** Users can search for books by title, author, or tags, and filter the collection by category.
-   **Comprehensive Admin Dashboard:** A secure, behind-a-login admin area to manage every aspect of the site's content.
-   **Content Management:** Admins can perform full CRUD (Create, Read, Update, Delete) operations on:
    -   Books
    -   Authors
    -   Articles
    -   Categories & Tags
    -   Users (Admin/Editor roles)
    -   Site Pages (About, FAQ, etc.)
    -   Pop-up Ads
-   **AI-Powered Features:** Utilizes Genkit to:
    -   Generate detailed book reviews, tags, and quotes from just a title and author.
    -   Create concise summaries of reviews for SEO purposes.
-   **SEO Optimized:**
    -   Dynamic generation of `sitemap.xml`.
    -   Automatic generation of `robots.txt`.
    -   Rich structured data (JSON-LD) for books, articles, authors, and FAQs using Schema.org to enhance search engine visibility.
    -   Optimized metadata (`title`, `description`) for all pages.
-   **Dockerized Environment:** Includes `Dockerfile` and `.dockerignore` for easy containerization and consistent deployment.

## 🛠️ Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN](https://ui.shadcn.com/)
-   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit)
-   **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
-   **Database (Mock):** Local JSON files (`/src/lib/*.json`) to simulate a database for prototyping.
-   **Containerization:** [Docker](https://www.docker.com/)

## 🚀 Running the Project Locally

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your GenAI provider API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

-   **Public Site:** `http://localhost:9002`
-   **Admin Login:** `http://localhost:9002/admin/login` (Use `admin@libribooks.com` / `password`)

## 🗃️ Database Structure (JSON Mock)

For rapid prototyping, this project uses local JSON files to simulate a database. This allows for full functionality without requiring a database setup. The files are located in `/src/lib/`.

-   `data.json`: The main "books" table. Contains all book details, including reviews, image URLs, and links to other data.
-   `authors.json`: The "authors" table. Each author has an ID, name, bio, and image.
-   `articles.json`: The "articles" table. Contains blog-style articles.
-   `categories.json`: The "categories" table. Used to categorize books.
-   `tags.json`: The "tags" table. Used for more granular tagging of books.
-   `users.json`: The "users" table for the admin dashboard.
-   `pages.json`: Holds content for static pages like "About" and "FAQ".
-   `popupAds.json`: Manages the content and settings for promotional pop-ups.

### Relationships

-   A `book` in `data.json` is linked to an `author` in `authors.json` via its `authorIds` array.
-   Each `book` has a single `category` string, which corresponds to a `name` in `categories.json`.
-   Each `book` can have multiple `tags` in an array, corresponding to `name` values in `tags.json`.

This structure is designed to be easily migrated to a relational database like PostgreSQL (used by Supabase) or a NoSQL database like Firestore. The `id` fields would become primary keys, and `authorIds` would be a foreign key relationship.

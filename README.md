# Abhi Kansara Photography - Premium Studio Platform

[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Backend: .NET 8](https://img.shields.io/badge/Backend-.NET%208-512bd4?style=flat-square&logo=.net)](https://dotnet.microsoft.com/)
[![Storage: SmugMug](https://img.shields.io/badge/Storage-SmugMug-brightgreen?style=flat-square)](https://www.smugmug.com/)
[![Styling: Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A high-performance, full-stack photography ecosystem built for **Abhi Kansara Photography**. This platform transcends a traditional portfolio, operating as a professional studio management suite that bridges cinematic visual storytelling with enterprise-grade media delivery.

---

## Vision & Architecture

The platform is architected as a **Headless CMS** ecosystem, decoupling the immersive frontend from a robust C# backend to ensure maximum performance, security, and scalability.

- **Immersive Presentation:** Leveraging Next.js 16 and Framer Motion for a "hardware-accelerated" visual experience.
- **Limitless Media:** Fully integrated with the **SmugMug API**, utilizing their global CDN for unlimited high-resolution photo and HLS video delivery.
- **Enterprise Backend:** Powered by **.NET 8** (Onion Architecture) and **PostgreSQL**, managing everything from dynamic site configurations to secure client portals.

---

## Tech Stack

### Frontend (Presentation Layer)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Actions)
- **UI & Motion:** [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **Forms & Logic:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Dnd-kit](https://dndkit.com/) (for Admin reordering)
- **Communications:** [Resend](https://resend.com/) for automated studio inquiries.

### Backend (Logic & Management Layer)
- **Core:** [ASP.NET Core 8 Web API](https://dotnet.microsoft.com/en-us/apps/aspnet/apis) (C#)
- **Pattern:** Clean/Onion Architecture (Core, Infrastructure, API)
- **ORM:** Entity Framework Core with PostgreSQL.
- **Auth:** ASP.NET Identity with JWT (JSON Web Tokens) for secure admin/client sessions.
- **Caching:** Redis for high-speed SmugMug API response caching.

### Infrastructure
- **Media Hosting:** SmugMug (Unlimited high-res storage & optimized delivery).
- **Deployment:** Vercel (Frontend), Azure App Service (Backend), Azure Database for PostgreSQL.

---

## Key Features

### 1. Dynamic SmugMug Gallery Integration
The site programmatically interfaces with SmugMug nodes. The .NET backend syncs folder structures (`Year > Event > Client`) into a local database, allowing the frontend to render high-performance bento-grids and masonry layouts instantly using SmugMug's cached CDN links.

### 2. The Secure Client Vault
A dedicated, private portal where clients log in to access their specific shoots.
- **Private Delivery:** Role-Based Access Control (RBAC) ensures clients only see their own galleries.
- **On-Demand Downloads:** Integration with SmugMug's ZIP generation for high-resolution photo downloads.
- **Seamless Sharing:** Dedicated secure links for clients to share their galleries with family and friends.

### 3. Studio Admin Dashboard (Headless CMS)
Abhi has full control over the site's public presence without touching code:
- **Hero Management:** Live-update background photos and cinematic morphing visuals.
- **Service Orchestration:** Reorder, add, or modify the services carousel and offering descriptions (powered by Dnd-kit).
- **Featured Works:** Toggle which SmugMug albums are highlighted on the landing page.

### 4. Cinematic Media Engine
- **HLS Video Streaming:** Support for adaptive bitrate SmugMug video streams, ensuring buffer-free 4K playback.
- **Atmospheric Transitions:** Hardware-accelerated morphing carousels and scroll-reactive hero overlays.

---

## Project Structure

```bash
.
├── app/                # Next.js App Router (Pages, Admin Panel, Client Portal)
├── components/         # Atomic UI components & cinematic sections
├── lib/                # API wrappers, SmugMug bridge logic, and shared utils
├── public/             # Static branding assets and local media
├── server/             # .NET 8 Web API (Core, Infrastructure, API Projects)
└── .agent/             # Development roadmaps and architecture documentation
```

---

## Installation & Setup

### Prerequisites
- Node.js 20+ & npm
- .NET 8 SDK
- PostgreSQL Instance
- SmugMug API Credentials

### 1. Frontend Setup
```bash
git clone https://github.com/Viraj-Mavani/abhi-kansara-photography.git
cd abhi-kansara-photography
npm install
cp .env.example .env.local  # Configure API endpoints & SmugMug keys
npm run dev
```

### 2. Backend Setup
Navigate to the `server/` directory:
```bash
cd server
dotnet restore
# Update connection string in appsettings.json
dotnet ef database update --project AbhiKansara.Infrastructure --startup-project AbhiKansara.API
dotnet run --project AbhiKansara.API
```

---

## License
MIT © 2026 Viraj Mavani

Designed and Engineered with precision for **Abhi Kansara Photography**.

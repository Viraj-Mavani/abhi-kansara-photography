---
title: "Dynamic Evolution: Development & Architecture Plan"
description: "Comprehensive roadmap for upgrading the static portfolio to a fully dynamic, client-ready platform with .NET 8 backend and SmugMug integration."
---

# 1. Executive Summary & Future Vision

The current iteration of the **Abhi Kansara Photography** platform is a high-performance, visually stunning static site built on the latest Next.js 16 stack. To elevate this from a static portfolio to an enterprise-grade studio management and client delivery platform, we are planning a complete transition to a dynamic architecture.

The core vision is twofold:
1. **Headless CMS & Dynamic Control:** Allow the admin (Abhi) to seamlessly control the public-facing site (featured images, carousels, text content) without touching code.
2. **Unlimited Media & Client Portals:** Leverage a third-party, specialized media host (**SmugMug**) as the single source of truth for high-res photo storage, enabling private client galleries, easy sharing, and direct downloads.

---

# 2. Recommended Technology Stack

We are building a decoupled, headless architecture ensuring maximum performance on the frontend and rock-solid security on the backend.

### Frontend (Client & Public Presentation)
- **Framework:** Next.js 16 (App Router, React Server Components)
- **Styling & UI:** Tailwind CSS v4, Framer Motion, Lenis (already in place)
- **Data Fetching:** Next.js native `fetch` with extreme caching for public routes, SWR/React Query for the authenticated Client Portal.

### Backend (API, Business Logic, Auth)
- **Framework:** **.NET 8 Web API** (C#)
- **ORM:** Entity Framework (EF) Core
- **Database:** PostgreSQL or Microsoft SQL Server (for structured relational data: users, dynamic site config, gallery metadata)
- **Authentication:** ASP.NET Core Identity (JWT tokens) paired with NextAuth.js on the frontend.
- **Caching:** Redis (CRITICAL: caching SmugMug API calls to prevent rate limits and ensure lightning-fast gallery loads).

### Media & Storage Infrastructure
- **Photo Storage & Delivery:** **SmugMug API** (Unlimited storage, high-tier image compression/delivery, watermarking).
- **Static Assets Database (Optional):** Azure Blob Storage or AWS S3 (for lightweight site assets like logos or specific UI icons).

---

# 3. Dynamic Site Management (Headless CMS)

The public portfolio should no longer require code commits to change. The .NET backend will serve as a headless CMS, exposing endpoints that the Next.js frontend fetches at build time (or via Incremental Static Regeneration - ISR).

**Dynamic Elements Admin can modify:**
- **Hero/Background Photos:** Update the primary landing visuals.
- **Service Carousel:** Add, remove, or reorder service offerings and descriptions.
- **Featured Series (Home Page):** Select specific SmugMug albums/galleries to be highlighted on the landing page.
- **Contact Info & Bios:** Editable text blobs stored in the SQL database.

*Dev Note:* Next.js will use Next.js cache tags (e.g., `revalidateTag('site-config')`). When the admin updates the carousel via the backend, the .NET backend will trigger a Next.js revalidation webhook to instantly update the static public page without a full rebuild.

---

# 4. SmugMug Integration Strategy

SmugMug will act as the limitless storage bucket and Content Delivery Network (CDN) for all heavy media.

### Why SmugMug?
It's financially optimal for photographers. Building custom AWS S3/CloudFront pipelines for terabytes of RAW/High-Res JPEGs gets exceptionally costly. SmugMug offers unlimited high-res storage at a flat rate, along with an API to programmatically access these albums.

### Implementation Flow:
1. **The SmugMug Bridge (.NET):** The .NET API will securely hold the SmugMug API Keys/OAuth tokens. The frontend will *never* talk to SmugMug directly. 
2. **Metadata Synchronization:** The admin will organize photos in SmugMug (e.g., `2025 > Weddings > Client_Name`). The .NET backend will run a background worker (or manual sync button) to pull this folder structure metadata and save it in the local SQL database.
3. **Fetching Photos:** When a user visits an album, the Next.js frontend asks the .NET backend for the photo URLs. The .NET backend uses the cached SmugMug CDN links to serve the images instantly.

---

# 5. The Client Portal Vault

This is the cornerstone feature for client turn-over. Instead of sending generic Google Drive or basic SmugMug links, clients will log into the Abhi Kansara premium platform.

### Architecture & Features:
- **Authentication:** Clients receive a unique access code or email invite. They log in via a dedicated `/portal/login` route.
- **Role-Based Access Control (RBAC):** The .NET database links `UserID` -> `SmugMug AlbumID`. When "John" logs in, the API strictly returns only the SmugMug album links mapped to John's account.
- **Viewing Experience:** A masonry grid (similar to the public `BentoGallery`) displaying their full shoot. Watermarks can be enforced dynamically via SmugMug rules.
- **Download/Sharing Mechanism:**
  - Clients can click a "Download All High-Res" button. 
  - The .NET backend dynamically asks the SmugMug API to generate a secure, temporary download ZIP link, passing it back to the frontend.
  - Clients can copy a "Share Album" link to send to family.

---

# 6. Development Life Cycle (The Roadmap)

To build this systematically, we will follow a phased agile approach.

### Phase 1: Planning, Schema & Architecture setup (Weeks 1-2)
- Finalize Database Schema (Users, Roles, DynamicConfig, GalleryMappings).
- Setup the .NET 8 Web API project structure (Controllers, Services, Repositories).
- Setup PostgreSQL/SQL Server via Docker for local dev.
- Register for SmugMug API access & test Postman calls.

### Phase 2: Backend Core & Authentication (Weeks 3-4)
- Implement ASP.NET Core Identity (JWT implementation).
- Build the Next.js Login/Admin UI securely consuming the JWT.
- Build basic CRUD endpoints for Site Configuration (Hero images, text).

### Phase 3: Headless CMS Wiring (Weeks 5-6)
- Connect the Next.js public pages to the .NET endpoints.
- Replace static arrays (like the service carousel) with dynamic fetch calls.
- Implement Next.js App Router Caching and On-Demand Revalidation (Webhooks).

### Phase 4: The SmugMug Bridge (Weeks 7-8)
- Build the `SmugMugService.cs` in .NET handling OAuth1.0a/OAuth2 authentication.
- Create endpoints to fetch Node (Folder) and Album structures.
- Implement Redis caching so we don't hit the SmugMug API limits.

### Phase 5: The Client Portal (Weeks 9-10)
- Build the Admin Dashboard UI to map SmugMug Albums to specific Client Accounts.
- Build the `/portal` layout on Next.js.
- Implement the "Client View" of albums using the SmugMug CDN links.
- Implement the "Download capabilities."

### Phase 6: QA, Optimization & Deployment (Weeks 11-12)
- Heavy testing of SmugMug API rate limit handling.
- Host the .NET API on an Azure App Service or AWS Elastic Beanstalk.
- Host the Database on Azure SQL or AWS RDS.
- Deploy Next.js to Vercel (already existing).
- E2E testing using Playwright.

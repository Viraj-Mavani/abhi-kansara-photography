# Portfolio V2 Architecture & Component Guide

## 1. Overall Vision & Aesthetic

The objective is to achieve a cinematic, high-end luxury photography portfolio. The experience must feel "tactile" and "soothing."

- **Colors**: Deep charcoal/black backgrounds (`#0a0a0a`, `#1a1a1a`) for media, contrasted with off-white/ivory (`#f5f0eb`) for text-heavy pages (About/Contact). Accents use a curated gold (`#c9a96e`).
- **Typography**: Editorial serif (Cormorant Garamond) for headings, paired with a clean geometric sans-serif (Geist or similar) for body text and mono for technical accents/micro-copy.
- **Motion**: Every element should have a deliberate entry animation (fade-translate, scale) using scroll-linked triggers. Hover effects are magnetic or feature subtle glowing boundaries.

## 2. Core Architectural Patterns

- **Next.js App Router**: Standard `app/` directory routing.
- **Tailwind CSS CSS-in-JS Philosophy**: All styling relies on utility classes and a unified set of custom CSS variable design tokens loaded via `globals.css`.
- **Framer Motion**: The spine of all interaction and scroll reveals.
- **Dynamic Imports**: Components that heavily rely on browser APIs (like scroll bindings) might be marked as `"use client"` or dynamically imported without SSR to avoid hydration mismatches.

## 3. Global & Shared Files

- `app/globals.css`: Defines CSS root variables for themes and base styles (resets, custom text selection color).
- `app/layout.tsx`: Root layout, importantly wraps children with a smooth scrolling provider and manages font loading.
- `lib/utils.ts`: Contains the standard `cn` utility (combining `clsx` and `tailwind-merge`) to conditionally join Tailwind classes.
- `lib/data.ts`: Centralizes all the site's content (images, project titles, placeholder urls) to cleanly separate data from UI representation.
- `components/AnimatedSection.tsx`: A reusable wrapper component that accepts `children` and animates them into view when they intersect the viewport (using Framer Motion `useInView`).
- `components/ParallaxImage.tsx`: An optimized Next.js `<Image>` wrapped in `framer-motion` hooks to translate on the Y-axis relative to page scroll depth. Includes blur placeholder logic.

## 4. Navigation & Footer

- `components/Navigation.tsx`: A floating, glassmorphism "pill" navbar. It appears automatically when scrolling down to stay out of the way, and disappears when scrolling up. At the absolute top of the page (scroll = 0), it is hidden to ensure the initial Hero view is pristine. It features an image logo (`Logo.png`) in center when scroll position is 0 and hides when navbar appears.
- `components/Footer.tsx`: A premium, full-width custom footer. It features large call-to-action typography ("Let's create something beautiful"), social links with elaborate hover micro-interactions (magnetic movement, glow), and a minimalist copyright bar (which we already have not changes there excapt a little blending to our new UI).

## 5. Homepage Structure (`app/page.tsx`)

The homepage is a purely visual showcase leveraging a "fixed background" stacking context.

- **`components/sections/FixedBackgroundCarousel.tsx`**: Sits at `z-0` with `position: fixed`. It slowly fades between flagship background images.
- **The Foreground Container**: Wraps all following sections and scrolls _over_ the fixed background carousel.
    - **Section 0 (`HeroSection.tsx`)**: Completely transparent `min-h-screen` container. Holds no content except an animated "SCROLL" indicator at the bottom. The fixed background carousel is fully visible beneath it. this section will be the background of the entire homepage. even is its gaps between images in sections 1 to 4...there will be no frame or solid bg underneith any photos or video from following sections ...user should be able to see either background carousel or any photos or video in section 1 to 4 nothing else.
    - **Section 1 (`ServicesCarousel.tsx`)**: A horizontally draggable carousel and auto carousel (using Framer Motion) showcasing specific services (Events, Wedding, Pre-Wedding)...also it should be infinite like pictures in ring...after last photo the next will the first and vice versa.
    - **Section 2 (`PortfolioGrid.tsx`)**: An 3x2 (3 columns and 2 rows) CSS grid displaying featured works photos in 2:3 ratio. totaling 6 photos and client names under it e.g. Kavi & Kavya.
    - **Section 3 (`PortraitVideos.tsx`)**: Displays dual 9:16/2:3/3:4 vertical video thumbnails (for reels/tiktok style).
    - **Section 4 (`LandscapeVideos.tsx`)**: Displays a massive 16:9/3:2/4:3 cinematic feature video wrapper.

## 6. Sub-Pages

The functional, text-heavy sections have been decoupled from the visual homepage flow onto solid off-white backgrounds.

- **`app/about/page.tsx`**: Features a split layout with the photographer's portrait and a detailed bio. Includes a "Philosophy" sub-section.
- **`app/contact/page.tsx`**: A highly refined, high-contrast inquiry form requesting event details, date, and venue.

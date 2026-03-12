# V2 Architecture Refactoring Plan

This plan breaks down the exact steps to transform the existing `abhi-kansara-photography` codebase (currently relying on [Header.tsx](file:///d:/Projects/abhi-kansara-photography/components/Header.tsx), [SelectedWorks.tsx](file:///d:/Projects/abhi-kansara-photography/components/SelectedWorks.tsx), and a light-themed UI) into the refined V2 architecture governed by [new_plan.md](file:///d:/Projects/abhi-kansara-photography/new_plan.md).

## Phase 1: Foundation & Theming
1. **Update [globals.css](file:///d:/Projects/abhi-kansara-photography/app/globals.css)**: Inject the V2 CSS custom properties (`#0a0a0a` backgrounds, `#c9a96e` accents, `#f5f0eb` text).
2. **Update [layout.tsx](file:///d:/Projects/abhi-kansara-photography/app/layout.tsx)**: Replace the current fonts (Inter, Playfair) with Cormorant Garamond and Geist/Geist_Mono. Wrap the app with `SmoothScrollProvider`. Remove the forced `bg-white` from the `body`.
3. **Core Utilities**: Ensure [lib/utils.ts](file:///d:/Projects/abhi-kansara-photography/lib/utils.ts) (with `cn`) and [lib/data.ts](file:///d:/Projects/abhi-kansara-photography/lib/data.ts) (holding our centralized media arrays) are established.
4. **Shared Components**: Build [components/AnimatedSection.tsx](file:///d:/Projects/abhi-kansara-photography/components/AnimatedSection.tsx) and [components/ParallaxImage.tsx](file:///d:/Projects/abhi-kansara-photography/components/ParallaxImage.tsx) which will power the new scroll reveals.

## Phase 2: Navigation & Footer
1. **Refactor [Header.tsx](file:///d:/Projects/abhi-kansara-photography/components/Header.tsx) to [Navigation.tsx](file:///d:/Projects/abhi-kansara-photography/components/Navigation.tsx)**: Transform the existing top-fixed white banner into the floating, glassmorphism "pill" navbar that hides on scroll up and absolute top.
2. **Update [Footer.tsx](file:///d:/Projects/abhi-kansara-photography/references/Footer.tsx)**: Blend the existing footer into the new UI. Keep its structure as requested but ensure classes align with the premium aesthetic.

## Phase 3: The Homepage Stacking Context & Sections
1. **Construct [FixedBackgroundCarousel.tsx](file:///d:/Projects/abhi-kansara-photography/components/sections/FixedBackgroundCarousel.tsx)**: A purely fixed background that cycles images underneath everything.
2. **Refactor [HeroSection.tsx](file:///d:/Projects/abhi-kansara-photography/components/HeroSection.tsx) (Section 0)**: Strip the current split-layout and replace it with a 100vh transparent overlay containing solely the animated "SCROLL" indicator.
3. **Refactor [page.tsx](file:///d:/Projects/abhi-kansara-photography/app/page.tsx) Integration**: Implement the `z-0 fixed` background beneath the relative foreground wrapper, creating the overlap effect.
4. **Implement New Sections**:
   - [ServicesCarousel.tsx](file:///d:/Projects/abhi-kansara-photography/components/sections/ServicesCarousel.tsx) (Section 1 - Auto-scrolling carousel)
   - [PortfolioGrid.tsx](file:///d:/Projects/abhi-kansara-photography/components/sections/PortfolioGrid.tsx) (Section 2 - Asymmetrical masonry grid replacing [SelectedWorks.tsx](file:///d:/Projects/abhi-kansara-photography/components/SelectedWorks.tsx))
   - [PortraitVideos.tsx](file:///d:/Projects/abhi-kansara-photography/components/sections/PortraitVideos.tsx) (Section 3 - Vertical 9:16 layout)
   - [LandscapeVideos.tsx](file:///d:/Projects/abhi-kansara-photography/components/sections/LandscapeVideos.tsx) (Section 4 - Horizontal 16:9 cinematic wrapper)

## Phase 4: Page Extraction
1. **Build [app/about/page.tsx](file:///d:/Projects/abhi-kansara-photography/app/about/page.tsx)**: Move the text-heavy "About" and new "Philosophy" sections strictly to this dedicated route using the V2 solid off-white background styling.
2. **Build [app/contact/page.tsx](file:///d:/Projects/abhi-kansara-photography/app/contact/page.tsx)**: Build the refined inquiry form here on a solid background, detaching it entirely from the homepage scroll flow.

## Phase 5: Cleanup
1. Delete old unused components and verify build stability.

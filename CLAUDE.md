# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DJTV is a PWA and cross-platform streaming app for electronic music DJ performances. It runs on web, iOS, Android, and TV platforms (Apple TV, Android TV) via Capacitor. Built with Lovable.

## Common Commands

```bash
npm run dev        # Start Vite dev server on http://localhost:8080
npm run build      # Production build (outputs to dist/)
npm run build:dev  # Dev build with source maps
npm run lint       # Run ESLint
npm run preview    # Preview production build locally

# Capacitor (mobile/TV)
npx cap sync              # Sync web assets to native projects
npx cap run ios           # Run on iOS simulator/device
npx cap run android       # Run on Android emulator/device
npx cap open ios          # Open Xcode
npx cap open android      # Open Android Studio
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite (SWC)
- **Routing**: React Router v6 — routes defined in `src/App.tsx`
- **UI**: shadcn-ui (Radix UI primitives) + Tailwind CSS
- **State**: React hooks for local state; TanStack React Query v5 for server state
- **Video**: HLS.js for adaptive bitrate streaming (`.m3u8`)
- **Backend**: Supabase (configured, not heavily used yet)
- **Mobile/TV**: Capacitor 7 (app ID: `pt.djtv.app`)
- **PWA**: vite-plugin-pwa with Workbox (Supabase NetworkFirst + image CacheFirst)

## Architecture

### Data Flow

Content is loaded from an external XML feed (`https://app.djtv.pt/content/index.xml`) via `fetchAndParseXML()` in `src/services/xmlParser.ts`. If unavailable, the app falls back to mock data in `src/data/djtvData.ts`. The Backoffice allows editing content in-memory, generating XML via `src/utils/xmlGenerator.ts`, and uploading via FTP (credentials stored in localStorage under `djtv_` prefix).

### XML Structure

`<carousel><section>` with `<lockup>` elements; `<separator>` for category headings; `<shelf>` for video lists. Each `<lockup>` can have `islive="true"`, `videourl`, `videoid` attributes.

### Cross-Platform

- `useTVNavigation()` hook (`src/hooks/useTVNavigation.ts`) provides arrow key + remote control navigation
- `isTVPlatform()` detects TV via user agent & screen size
- Tailwind includes custom TV breakpoints: `tv: 1920px`, `tv-4k: 3840px`
- App shows a splash screen on startup (`SplashScreen` component, before router renders)

### Backoffice Auth

`useBackofficeAuth()` stores auth token in `sessionStorage`. Password is hardcoded — not production-ready.

### Styling

Dark theme only. CSS variables defined in `src/index.css`. No light mode.

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Route definitions + QueryClient + TooltipProvider |
| `src/services/xmlParser.ts` | Fetches & parses remote XML into typed structures |
| `src/utils/xmlGenerator.ts` | Converts editor state back to XML |
| `src/data/djtvData.ts` | Fallback carousel + video data |
| `src/hooks/useTVNavigation.ts` | TV remote/keyboard navigation |
| `capacitor.config.ts` | Capacitor app config (splash screen, status bar) |
| `vite.config.ts` | Vite + PWA manifest + `@/*` path alias |
| `tailwind.config.ts` | TV breakpoints + custom keyframes |

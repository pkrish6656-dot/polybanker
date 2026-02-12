# Monopoly Banker

## Overview

A digital banking companion app for physical Monopoly board games. This app replaces paper money with a mobile-friendly interface for tracking player balances, processing transactions, managing properties, and handling game mechanics like Pass GO, Free Parking jackpots, and bankruptcy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: 
  - Zustand with persistence for local game state (`lib/game-store.ts`) - this is the primary state management for gameplay
  - TanStack React Query for server state synchronization (used alongside Zustand)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration for Monopoly-themed colors (greens, golds)
- **Animations**: Framer Motion for game-like transitions and interactions
- **Fonts**: Cinzel (display/serif), Manrope, and Inter font families

### Backend Architecture
- **Framework**: Express.js 5 running on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Validation**: Zod schemas for both API input validation and type inference

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod insert schemas for Players and Transactions
- `routes.ts`: API route definitions with method, path, input schemas, and response types (includes a `buildUrl` helper for parameterized routes)

### Data Models
- **Players**: Track name, balance, color token, and bankruptcy status
- **Transactions**: Record money transfers between players and/or the bank (null IDs represent "The Bank")
- **Properties**: Tracked in Zustand store with ownership, mortgage status, and house count

### Game Mechanics
The app implements standard Monopoly mechanics:
- Pass GO salary collection ($200)
- Free Parking jackpot (optional house rule)
- Property purchases with flexible payment recipients (Bank, Free Parking, or other players)
- Building houses/hotels on properties
- Bankruptcy declaration with asset transfer to creditors
- Undo functionality via game state snapshots

### Key Pages
- `/` or `/setup`: Game setup with player creation and game settings
- `/dashboard`: Main game board showing all players and their balances
- `/properties`: Property ownership and building status
- `/ledger`: Transaction history log

## External Dependencies

### Database
- **PostgreSQL**: Primary database, configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database access layer with schema defined in `shared/schema.ts`

### Third-Party Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, switches, etc.)
- **Framer Motion**: Animation library for smooth transitions
- **date-fns**: Date formatting for transaction timestamps
- **Zod**: Runtime type validation for API inputs and responses
- **Vaul**: Drawer component for mobile action menus

### Build & Dev Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development
- **Replit plugins**: Runtime error overlay, cartographer, and dev banner (development only)

### Deployment
- Configured for Vercel deployment via `vercel.json`
- Static files served from `dist/public` in production
- SPA fallback routing configured
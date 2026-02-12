# Monopoly Banker

## Overview

A digital banking companion app for physical Monopoly board games. This app replaces paper money with a mobile-friendly interface for tracking player balances, processing transactions, managing property ownership, and maintaining a complete game ledger. Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: 
  - Zustand with persistence for local game state (`lib/game-store.ts`)
  - TanStack React Query for server state synchronization
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration for Monopoly-themed colors
- **Animations**: Framer Motion for game-like transitions and interactions

### Backend Architecture
- **Framework**: Express.js 5 running on Node.js
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Validation**: Zod schemas for both API input validation and type inference

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod insert schemas for Players and Transactions
- `routes.ts`: API route definitions with method, path, input schemas, and response types

### Data Models
- **Players**: Track name, balance, color token, and bankruptcy status
- **Transactions**: Record money transfers between players and/or the bank (null IDs represent "The Bank")

### Game Actions
Tap on any player card to open the action drawer for that player. Available actions:
- **Pass GO**: Collect $200 salary
- **Jackpot**: Collect the Free Parking pot (shows current amount)
- **Pay/Receive**: Transfer money between players and the bank
- **Buy Property**: Purchase unowned properties (choose who to pay: Bank, Free Parking, or other players)
- **Pay Rent**: Pay rent to property owners
- **Build**: Build houses and hotels on properties (choose who to pay: Bank, Free Parking, or other players)
- **Bankruptcy**: Declare bankruptcy and transfer all assets to a creditor

Note: No turn-based system - tap any player to perform actions for them at any time.

### Undo Feature
The app stores up to 20 action snapshots. An "Undo Last Action" button appears when actions have been performed, allowing you to reverse mistakes.

### Key Design Decisions

1. **Hybrid State Management**: The app maintains both local Zustand state (for offline-capable gameplay) and server-synced state via React Query. This allows the game to function without constant server connectivity while still persisting data.

2. **Type-Safe API Layer**: Route definitions in `shared/routes.ts` provide a single source of truth for API contracts, enabling type-safe API calls on the client using the same schemas used for server validation.

3. **Null as Bank**: Transactions use null for `fromPlayerId` or `toPlayerId` to represent the Monopoly bank, simplifying the schema while clearly distinguishing player-to-player from bank transactions.

4. **Component-Driven UI**: Full shadcn/ui component library is installed, providing consistent, accessible UI components that follow the application's theming.

## External Dependencies

### Database
- **PostgreSQL**: Primary database, configured via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database operations with type-safe queries
- Schema migrations stored in `/migrations` directory

### Third-Party Libraries
- **Radix UI**: Headless accessible UI primitives (dialogs, dropdowns, forms, etc.)
- **Framer Motion**: Animation library for game-like UI interactions
- **date-fns**: Date formatting for transaction timestamps
- **Zod**: Runtime schema validation shared between client and server

### Build & Development
- **Vite**: Frontend build tool with HMR support
- **esbuild**: Server bundling for production builds
- **tsx**: TypeScript execution for development server

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay for development
- `@replit/vite-plugin-cartographer`: Development tooling integration
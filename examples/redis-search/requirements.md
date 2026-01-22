# Redis Search Next.js App - Requirements

## Overview
Build a Next.js application to showcase Redis Search features using step-by-step interactive demonstrations.

## Core Requirements

### 1. Data Seeding System
- [ ] Create a function that creates index and upserts data
  - Must be deterministic (no random IDs)
  - Use `existsOk: true` for index creation
  - Include proper logging (index created, already exists, data upserted, etc.)
- [ ] Expose seeding via API endpoint (disabled in production)
- [ ] Expose seeding via npm script (`npm run seed`)

### 2. Step Component System
- [ ] Define `StepConfig` type:
  ```typescript
  type StepConfig = {
    title: string;
    description: React.ReactNode;
    code?: string;
    result?: React.ReactNode;
  }
  ```
- [ ] Create `Step` component (receives StepConfig + index)
- [ ] Create `Steps` component (receives StepConfig[])
- [ ] Add copy button for code snippets
- [ ] Result components use server actions

### 3. Feature Pages

#### Page 1: Create Index
- [ ] Schema basics and `s` syntax
- [ ] Creating index on Redis with createIndex
- [ ] Creating index client without calling Redis
- [ ] Adding data using regular Redis commands
- [ ] Wait indexing demonstration

#### Page 2: Query Basics
- [ ] $eq operator
- [ ] $regex operator
- [ ] Boolean queries
- [ ] Number queries
- [ ] Count with filters

#### Page 3: Query Advanced
- [ ] Filter without $ (complex backend filter)
- [ ] Highlighting with user input
- [ ] Field selection
- [ ] Boosting by field
- [ ] AND/OR operators

#### Page 4: Other Operations
- [ ] Describe index
- [ ] Drop index

### 4. Technical Stack
- [ ] Next.js (App Router)
- [ ] Tailwind CSS
- [ ] shadcn/ui components
- [ ] @upstash/redis for Redis Search
- [ ] TypeScript

### 5. Folder Structure
```
components/     - Reusable UI components
app/           - Next.js app router pages
server/        - Server actions
steps/         - Step configurations by page
lib/           - Utilities (Redis client, etc.)
```

## Implementation Status

### ✅ Completed
- Requirements document created
- Redis client configuration with environment variables
- Seed script with 15 sample products (deterministic IDs)
- API endpoint for seeding (disabled in production)
- npm script for seeding (`npm run seed`)
- StepConfig type definition
- Step and Steps components
- CodeBlock component with copy functionality
- QueryResult and SearchResult wrapper components
- ProductCard display component
- Server actions for all Redis operations
- Navigation component
- Create Index page with 7 steps
- Query Basics page with 5 steps
- Advanced Query page with 7 steps
- Other Operations page with 4 steps
- Updated README with complete documentation

### 📋 Todo
- Add .env.local file with actual credentials (user needs to do this)
- Test all functionality end-to-end once Redis credentials are added
- Optional enhancements: mobile menu, more styling polish

## Core App Complete! ✅

All major features have been implemented. To use the app:

1. Copy `.env.local.example` to `.env.local` and add your Upstash Redis credentials
2. Run `pnpm install` to install dependencies
3. Run `pnpm run seed` to create the index and add sample data
4. Run `pnpm dev` to start the development server
5. Visit http://localhost:3000 to explore the interactive Redis Search demo

## Notes
- Use String index for actions/results to keep things simple
- Keep descriptions concise and clear
- All interactive features should use server actions
- Ensure proper error handling and loading states

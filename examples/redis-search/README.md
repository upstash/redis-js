# Redis Search Demo

An interactive Next.js application demonstrating the full capabilities of Redis Search using the `@upstash/redis` SDK.

## Features

This demo showcases:

- **Index Creation**: Learn how to create indexes with different data types (Hash, String, JSON) and schema configurations
- **Basic Queries**: Equality, regex, boolean, and numeric queries with examples
- **Advanced Queries**: Highlighting, field selection, boosting, and complex boolean operations
- **Index Management**: Describe, drop, sorting, and pagination operations

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- An Upstash Redis database ([Create one for free](https://console.upstash.com))

## Getting Started

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

You can find these credentials in your [Upstash Console](https://console.upstash.com).

3. **Seed the database:**

Run the seed script to create the index and populate it with sample data:

```bash
pnpm run seed
```

Alternatively, you can seed via the API endpoint (available in development only):

```
GET http://localhost:3000/api/seed
```

4. **Start the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Create Index page
│   ├── query/             # Query basics page
│   ├── advanced/          # Advanced query page
│   ├── operations/        # Other operations page
│   └── api/seed/          # Seed API endpoint
├── components/            # Reusable UI components
│   ├── step.tsx           # Individual step component
│   ├── steps.tsx          # Steps container
│   ├── code-block.tsx     # Code display with copy
│   ├── navigation.tsx     # Top navigation
│   ├── query-result.tsx   # Query result wrapper
│   ├── search-result.tsx  # Search with input wrapper
│   └── product-card.tsx   # Product display card
├── lib/                   # Utilities
│   ├── redis.ts           # Redis client
│   ├── seed.ts            # Seed function and data
│   └── utils.ts           # Helper functions
├── server/                # Server actions
│   └── actions.ts         # Redis query actions
├── steps/                 # Step configurations
│   ├── create-index.tsx   # Index creation steps
│   ├── query.tsx          # Basic query steps
│   ├── advanced-query.tsx # Advanced query steps
│   └── other-operations.tsx # Management steps
├── types/                 # TypeScript types
│   └── step.ts            # StepConfig type
└── scripts/               # Utility scripts
    └── seed.ts            # CLI seed script
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm seed` - Run database seed script
- `pnpm lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Database**: Upstash Redis with Search
- **Language**: TypeScript

## Learn More

- [Upstash Redis Documentation](https://upstash.com/docs/redis)
- [Redis Search Guide](./LLM.md) - Detailed guide on Redis Search features
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)

## License

MIT


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

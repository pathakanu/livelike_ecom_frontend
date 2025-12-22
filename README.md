# LiveLike Commerce Assistant Frontend

This repository contains the Next.js frontend for the LiveLike AI shopping assistant. It uses the App Router, Tailwind CSS, and shadcn/ui primitives, and expects a backend that streams chat responses over Server-Sent Events (SSE).

## Prerequisites

- Node.js 18.18+ or 20.x
- [pnpm](https://pnpm.io/installation) 8+

## Project Setup (pnpm)

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Start the development server (defaults to `http://localhost:3000`):
   ```bash
   pnpm dev
   ```
3. Build for production:
   ```bash
   pnpm build
   ```
4. Preview the production build locally:
   ```bash
   pnpm start
   ```

## Environment Variables

The frontend proxies chat requests through `app/api/chat/route.ts`. Configure the backend target with:

| Variable       | Description                                 | Default                |
| -------------- | ------------------------------------------- | ---------------------- |
| `BACKEND_URL`  | Base URL of the AI assistant backend API.   | `http://localhost:8000` |

Create an `.env.local` file if you need to override the defaults, e.g.:

```
BACKEND_URL=https://your-backend.example.com
```

## Available Scripts

| Command        | Description                                           |
| -------------- | ----------------------------------------------------- |
| `pnpm dev`     | Runs Next.js in development with hot reloading.       |
| `pnpm lint`    | Executes ESLint using the shared config.              |
| `pnpm build`   | Produces an optimized production build.               |
| `pnpm start`   | Serves the build output (requires `pnpm build` first). |

## Development Notes

- The main UI entry point is `app/page.tsx`, which renders the chat experience housed in `components/chat`.
- Structured chat responses rely on the backend emitting newline-delimited JSON chunks as described in `lib/api.ts`.
- Tailwind CSS styles live in `app/globals.css`; adjust theme tokens there if you need to rebrand the assistant.

# Forge — campus founders meet campus builders

A Next.js 14 (App Router) + MongoDB social app where college startup
founders publish their ideas, and students find and apply for real
internship work. Theme: **Cyber Purple & Electric Lime** on a deep
charcoal-navy background.

## What's included

- **Welcome page** (`/`) — animated hero with a signature founders↔builders
  spark-circuit diagram, live stats strip, scrolling tag marquee, "how it
  works", and a featured-startups grid using stock photography.
- **Login / Sign up page** (`/login`) — one page, toggle between modes.
  Sign up asks for username, college email, and password.
- **Onboarding questionnaire** (`/onboarding`) — shown right after signup
  or login (until completed). Six tap-to-answer steps covering:
  1. Professional life (founder / student / both)
  2. Primary field of technology
  3. Experience level
  4. Expertise / skills (multi-select)
  5. What they're looking for on the platform (multi-select)
  6. Availability
- **Dashboard** (`/dashboard`) — a starter feed showing the signed-in
  user's matched field and a sample of startup cards, protected by
  middleware so only logged-in users can reach it.
- Auth is custom (no third-party auth provider): bcrypt-hashed passwords,
  a signed JWT stored in an httpOnly cookie, and middleware that redirects
  signed-out visitors away from `/onboarding` and `/dashboard`.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up MongoDB**

   Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   (or use a local MongoDB instance), then copy the example env file:

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in `.env.local`:

   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/founders-hook
   JWT_SECRET=<any long random string>
   ```

3. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

## Project structure

```
src/
  app/
    page.tsx              Welcome / landing page
    login/page.tsx         Login + sign up
    onboarding/page.tsx     Multi-step questionnaire
    dashboard/page.tsx      Post-onboarding feed
    api/
      auth/signup/route.ts
      auth/login/route.ts
      auth/logout/route.ts
      auth/me/route.ts
      onboarding/route.ts
  components/
    Navbar.tsx
    ForgeAnimation.tsx      Signature animated hero diagram
  lib/
    mongodb.ts              Cached mongoose connection
    auth.ts                 JWT sign/verify + session helper
  models/
    User.ts                 User schema incl. onboarding fields
  middleware.ts             Route protection
```

## Where to go next

This covers the welcome/login/onboarding flow end-to-end. Natural next
steps for the full social app:

- A `Startup` model + `/api/startups` routes so founders can actually
  publish listings (the dashboard feed is currently sample data).
- An `Application` model so students can apply to a role and founders can
  review applicants.
- Profile pages, direct messaging, and search/filter by field or skill.

## Notes

- Stock photography is pulled live from Unsplash — swap the URLs in
  `page.tsx` / `dashboard/page.tsx` for your own images any time.
- Fonts (Space Grotesk, Inter, JetBrains Mono) load via `next/font/google`
  and are optimized/self-hosted automatically at build time.
- All animation respects `prefers-reduced-motion`.

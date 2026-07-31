# Cravings Delivery Platform

This repository contains the client application and Express service for the Cravings food delivery platform.

## Stack

- Frontend: React + Vite + JavaScript
- Backend: Node.js + Express + MongoDB + Mongoose
- Authentication: JWT and cookie-based sessions
- Payment: Razorpay
- Storage: Cloudinary

## Repositories

- `client/` – React application
- `server/` – Express API and Mongoose models

## Local setup

1. Copy the example env files and fill in real values.
2. Install dependencies in each app:
   - `cd client && npm install`
   - `cd server && npm install`
3. Start the frontend:
   - `cd client && npm run dev`
4. Start the backend:
   - `cd server && npm run dev`

## Quality commands

- Client: `cd client && npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run spellcheck`, `npm run build`
- Server: `cd server && npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:coverage`, `npm run spellcheck`, `npm run build`

## Security basics

- Keep `.env` files local and never commit real credentials.
- Use JWT secrets and database credentials from environment variables.
- Validate request payloads on both client and server.
- Review dependency updates and run `npm audit` before release.

## CI/CD

The GitHub workflow under `.github/workflows/ci.yml` runs linting, type checks, tests, coverage, spell checks, build validation, and security detection checks.

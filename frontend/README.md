# CEI Voting Portal Frontend

A Next.js frontend for the CEI voting application. It provides user registration and login, a political party list, vote confirmation, and a post-vote thank-you page.

## Overview

The frontend uses the local backend API for authentication and voting. Login sessions use the backend's cookie-based authentication. The voting API routes described below are the expected contract and may need adjustment once the backend endpoints are implemented.

## Technologies

- **Next.js 16** - React framework and application routing
- **React 19** - UI components and interactions
- **TypeScript** - Type-safe application code
- **Tailwind CSS 4** - Styling
- **Bun** - Package manager and scripts

## Pages

- **`/register`** - Create an account
- **`/login`** - Sign in
- **`/parties`** - Load and display available political parties
- **`/vote/{partyId}`** - Review a selected party and cast a vote
- **`/thank-you`** - Confirmation after the API accepts a vote

## API Endpoints

The frontend expects the API at `http://localhost:5102` by default. Set `NEXT_PUBLIC_API_BASE_URL` to use a different base URL.

### Authentication (`/api/auth`)

- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Authenticate and return a session cookie

### Voting (`/api/voting`)

- **GET** `/api/voting/parties` - Return the available parties as a JSON array. Each item should include `id` and `name` (also accepts `partyId` and `partyName`).
- **POST** `/api/voting/votes?partyId={id}` - Cast a vote for a party
  - The API should return a successful status when the vote is accepted
  - The frontend shows an error for unauthorized requests and HTTP `409` when a user has already voted

Voting endpoints require the authenticated session cookie. When the frontend and API use different origins, configure the API's CORS policy to allow the frontend origin with credentials. For local development, this is typically `http://localhost:3000`. Do not use a wildcard origin with credentialed requests.

## Prerequisites

- Node.js 20 or later
- Bun 1.3 or later
- The backend API running locally

## Getting Started

### 1. Install Dependencies

From the `frontend` directory:

```bash
bun install
```

### 2. Configure the API URL (Optional)

The default API URL is `http://localhost:5102`. To override it, create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5102
```

### 3. Run the Application

```bash
bun run dev
```

Open `http://localhost:3000` in a browser. Register or log in, then open the party list to cast a vote.

## Project Structure

```
frontend/
├── app/                   # Pages, routes, and authentication actions
├── components/            # Shared forms and voting UI
├── lib/                   # API helpers and form definitions
├── public/                # Static assets
├── package.json           # Dependencies and scripts
└── README.md
```

## Authentication

The frontend sends login and registration requests to the backend. Login forwards the API's session cookie to the browser; party and voting requests include that cookie. All voting routes must enforce authentication and prevent duplicate votes on the backend.

## Development

### Lint the Application

```bash
bun run lint
```

### Build for Production

```bash
bun run build
```

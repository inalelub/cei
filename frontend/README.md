# CEI — Frontend

The Next.js frontend for the CEI voting portal. It provides user registration, login, password recovery, a political party list, vote confirmation, and a post-vote thank-you page.

## Technologies

- **Next.js 16** — React framework with App Router
- **React 19** — UI rendering
- **TypeScript 5.9** — Type-safe application code
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — Accessible component primitives (via Base UI)
- **Zod 4** — Schema validation
- **Bun** — Package manager and task runner

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with election info and voter stats |
| `/register` | Create a new account |
| `/reg-success` | Registration confirmation |
| `/login` | Sign in |
| `/log-success` | Login success |
| `/forgot-password` | Request a password reset |
| `/parties` | Browse available political parties |
| `/vote/{partyId}` | Review a party and cast a vote |
| `/thank-you` | Confirmation after a successful vote |

## API Contract

The frontend communicates with the backend API at `http://localhost:5102` by default. Set `NEXT_PUBLIC_API_BASE_URL` to change it.

### Authentication (`/api/auth`)

- **POST** `/api/auth/register` — Register a new user
- **POST** `/api/auth/login` — Authenticate and establish a session cookie

### Voting (`/api/voting`)

- **GET** `/api/voting/parties` — Fetch available parties (each item includes `id` and `name`, also accepts `partyId`/`partyName`)
- **POST** `/api/voting/vote?partyId={id}` — Cast a vote for a party

Voting endpoints require the authenticated session cookie. When the frontend and API run on different origins, the API's CORS policy must allow the frontend origin with credentials. For local development this is `http://localhost:3000`. Do not use a wildcard origin with credentialed requests.

## Prerequisites

- Node.js 20+
- Bun 1.3+
- The backend API running locally (or via Aspire/Compose)

## Getting Started

### Install dependencies

```bash
bun install
```

### Configure the API URL (optional)

Create a `.env.local` file to override the default:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5102
```

### Run the dev server

```bash
bun run dev
```

Open http://localhost:3000 in a browser. Register, confirm your email (via Mailpit at http://localhost:8025), log in, and cast a vote.

## Project Structure

```
frontend/
├── app/                   # Pages, routes, and layouts
│   ├── page.tsx           # Landing page
│   ├── register/          # Registration flow
│   ├── login/             # Login flow
│   ├── forgot-password/   # Password recovery
│   ├── parties/           # Party listing
│   ├── vote/[partyId]/    # Vote confirmation
│   └── thank-you/         # Post-vote page
├── components/            # Shared UI components
│   ├── ui/                # shadcn/ui primitives (button, card, input, etc.)
│   ├── home/              # Landing page sections
│   ├── page-shell.tsx     # Page chrome: header, centered column, footer
│   ├── panel.tsx          # White content panel (Panel, PanelHeader)
│   ├── form-fields.tsx    # TextField, PasswordField, SubmitButton, FormAlert
│   ├── login-form.tsx     # Login form
│   ├── register-form.tsx  # Registration form
│   └── party-list.tsx     # Party listing component
├── lib/                   # Utilities and API helpers
│   ├── api.ts             # Backend API client
│   ├── definitions.ts     # Type definitions and form schemas
│   └── utils.ts           # General utilities
├── public/                # Static assets
├── package.json
├── Dockerfile
└── README.md
```

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Run ESLint with auto-fix |

## Authentication

The frontend sends login and registration requests to the backend. Login forwards the API's session cookie to the browser. Party and voting requests include that cookie. All voting routes enforce authentication and prevent duplicate votes on the backend side.

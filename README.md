# AI-Powered CSV Importer

Import any CRM CSV into GrowEasy with AI-powered intelligent field mapping. Supports Facebook, Google Ads, HubSpot, Real Estate CRM, and any custom CSV format.

## Features

- **AI-Powered Mapping** — Google Gemini automatically maps CSV columns to CRM schema
- **Universal Compatibility** — Works with any CRM CSV: HubSpot, Facebook, Google Ads, Excel, custom exports
- **Smart Preview** — Virtualized table with search, pagination, and sorting
- **Batch Processing** — Processes records in parallel batches of 20 with automatic retry
- **Validation & Safety** — Zod validation on both client and server, graceful skip handling
- **Beautiful UI** — Modern glassmorphism design with dark mode, Framer Motion animations
- **Responsive** — Fully responsive across desktop, tablet, and mobile

## Architecture

```
assignment/
├── frontend/          # Next.js 15 (App Router) + TypeScript + Tailwind
│   ├── app/           # Pages (landing, import, preview, results)
│   ├── components/    # UI primitives, landing, upload, preview, results, shared
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API client
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
│
├── backend/           # Express + TypeScript + Clean Architecture
│   ├── controllers/   # Request handlers
│   ├── routes/        # API routes
│   ├── services/      # Business logic (CSV parser, Gemini, import orchestrator)
│   ├── middlewares/    # Error handler, rate limiter, upload, validation
│   ├── utils/         # Logger, response helpers, retry logic
│   ├── validators/    # Zod schemas
│   ├── prompts/       # Gemini prompt templates
│   ├── types/         # TypeScript types
│   └── config/        # Environment configuration
│
├── docker-compose.yml
└── README.md
```

## Tech Stack

### Frontend
- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Table](https://tanstack.com/table)
- [React Hook Form](https://react-hook-form.com/)
- [react-dropzone](https://react-dropzone.js.org/)
- [PapaParse](https://www.papaparse.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Gemini API](https://ai.google.dev/)
- [Multer](https://github.com/expressjs/multer)
- [PapaParse](https://www.papaparse.com/)
- [Zod](https://zod.dev/)
- [Winston](https://github.com/winstonjs/winston)

### DevOps
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)

## Installation

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional)

### Clone & Install

```bash
git clone <repo-url>
cd assignment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

### Environment Variables

**Backend** (`backend/.env`):

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
MAX_FILE_SIZE_MB=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=debug
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Development

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

### Docker

```bash
# Set Gemini API key
export GEMINI_API_KEY=your_key_here

# Start all services
docker compose up --build

# Stop all services
docker compose down
```

## API

### Import CSV

```
POST /api/v1/import
Content-Type: application/json

{
  "headers": ["Name", "Email", "Phone"],
  "rows": [
    { "Name": "John Doe", "Email": "john@example.com", "Phone": "+1 555-1234" }
  ],
  "fileName": "contacts.csv"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "success": [ ... ],
    "skipped": [ ... ],
    "stats": {
      "total": 100,
      "imported": 95,
      "skipped": 5,
      "accuracy": 95,
      "processingTimeMs": 12345
    }
  }
}
```

### Health Check

```
GET /api/v1/health
```

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set `root directory` to `frontend`
4. Add environment variables
5. Deploy

### Backend (Render)

1. Create a new Web Service on Render
2. Connect GitHub repository
3. Set `root directory` to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables

## Data Flow

```
[Upload CSV] → [Client-Side Parse (PapaParse)]
     ↓
[Preview Table (TanStack Table)]
     ↓
[Click Import] → [POST /api/v1/import]
     ↓
[Server-Side Parse & Validate]
     ↓
[Batch Records (20/batch)]
     ↓
[Gemini API per Batch] ← [Retry on Failure]
     ↓
[Merge Results]
     ↓
[Response: {success, skipped, stats}]
     ↓
[Result Dashboard]
```

## AI Mapping Fields

| Field | Description |
|-------|-------------|
| `created_at` | Record creation date |
| `name` | Full name of lead |
| `email` | Primary email (first if multiple) |
| `country_code` | Country code (e.g., +1) |
| `mobile_without_country_code` | Phone without country code |
| `company` | Company name |
| `city` | City |
| `state` | State |
| `country` | Country |
| `lead_owner` | Assigned owner |
| `crm_status` | `GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE` |
| `crm_note` | Additional notes (extra emails/phones) |
| `data_source` | `leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, `sarjapur_plots` |
| `possession_time` | Possession time |
| `description` | Lead description |

## Future Improvements

- [ ] OAuth authentication
- [ ] Webhook notifications on import completion
- [ ] Custom mapping rules UI
- [ ] Import history dashboard
- [ ] Scheduled recurring imports
- [ ] WebSocket progress updates
- [ ] Export failed records as CSV
- [ ] Multi-tenant support
- [ ] Rate limiting per user/IP
- [ ] Unit and integration tests

# CareLoop CRM

**Every customer remembered. Every promise followed through.**

CareLoop is a lightweight, customer-first Customer Relationship Management platform for small businesses, freelancers, agencies, service providers, and online stores. It helps teams remember what they told customers, track commitments, recognize when someone needs attention, coordinate responsibility across administrators, and follow through on promises.

## 🎯 Problem Statement

Traditional CRMs often focus on leads, sales pipelines, and contact information. CareLoop's signature value is making customer follow-through visible, actionable, and accountable. Businesses lose trust when promises are forgotten, conversations are lost, and nobody knows who is responsible for the next step.

## ✨ Core Features

### P0 - Must Work
- ✅ **Authentication & Role-Based Access**: Manager, Staff Admin, and Customer roles with protected routes
- ✅ **Role-Based Dashboards**: Separate experiences for administrators and customers
- ✅ **Customer Management**: Complete customer directory with search, filters, and detail views
- ✅ **Promise Keeper**: Track specific commitments made to customers with due dates and status
- ✅ **Customer Memory Card**: Chronological timeline of all customer interactions
- ✅ **Quiet Customer Alerts**: Evidence-based attention system (overdue promises, due today, no recent interaction)
- ✅ **Time-Bound Assignments**: Manage team responsibility over defined periods
- ✅ **Safe Record Updates**: Version-based conflict prevention for concurrent edits
- ✅ **Responsive UI**: Clean, modern interface that works on desktop, tablet, and mobile

### P1 - High Value
- ✅ **AI Reply Assistant**: Template-based draft generation for customer responses (with clear labeling)
- 🚧 **Customer Request Management**: Support request tracking and resolution
- 🚧 **Customer Portal**: Simplified customer-facing experience
- 🚧 **Audit History**: Activity logging for important changes
- 🚧 **Assignment Handover**: Transfer ownership with handover notes

### P2 - Optional
- 🚧 **Advanced Agent Tools**: Enhanced AI workflows
- 🚧 **Charts & Analytics**: Visual reporting dashboards
- 🚧 **Notifications**: Real-time alerts and updates
- 🚧 **Integrations**: WooCommerce, email, SMS (adapter interfaces ready)

## 🏗️ Architecture

### Technology Stack

**Frontend**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form + Zod for form validation
- TanStack Query for API state management
- Lucide React for icons
- Axios for API calls

**Backend**
- Node.js with Express
- TypeScript
- REST API architecture
- Zod for request validation
- Centralized error handling
- Environment-based configuration

**Database & Authentication**
- SQLite with Prisma ORM (demo mode)
- JWT-based authentication
- Server-side role and permission enforcement
- Password hashing with bcryptjs

### Project Structure

```
CareLoop/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities (API client)
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── vite.config.ts
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── middleware/    # Express middleware
│   │   ├── modules/       # Feature modules
│   │   │   ├── customers/
│   │   │   ├── promises/
│   │   │   ├── users/
│   │   │   ├── alerts/
│   │   │   └── ai/
│   │   ├── lib/           # Shared utilities
│   │   ├── app.ts         # Express app
│   │   └── server.ts      # Server entry
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CareLoop
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server** (in `/server` directory)
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3001`

2. **Start the frontend development server** (in `/client` directory)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Demo Accounts

The seed script creates three demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Manager | manager@careloop.com | demo123 |
| Staff Admin | staff@careloop.com | demo123 |
| Customer | customer@careloop.com | demo123 |

**Note**: To create a manager account during signup, use the invitation code `DEMO_MANAGER`.

## 📡 API Overview

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer (Manager/Staff only)
- `PATCH /api/customers/:id` - Update customer (Manager/Staff only)
- `GET /api/customers/:id/timeline` - Get customer timeline

### Promises
- `GET /api/promises` - List all promises
- `GET /api/promises/overdue` - Get overdue promises
- `GET /api/promises/due-today` - Get promises due today
- `GET /api/promises/:id` - Get promise details
- `POST /api/promises` - Create promise (Manager/Staff only)
- `PATCH /api/promises/:id` - Update promise (Manager/Staff only)
- `POST /api/promises/:id/fulfill` - Mark promise as fulfilled (Manager/Staff only)

### Alerts
- `GET /api/alerts/attention` - Get items needing attention
- `GET /api/alerts/metrics` - Get dashboard metrics

### AI Assistant
- `POST /api/ai/reply-draft` - Generate reply draft (Manager/Staff only)

## 🔐 Security & Authorization

### Role-Based Access Control

**Manager**
- Full access to all customer data
- Can create and manage staff accounts
- Can assign and transfer customer ownership
- Can view audit history and reports

**Staff Admin**
- Can view assigned customers
- Can create and update permitted records
- Can create and fulfill promises
- Can handle support requests
- Can use AI Reply Assistant

**Customer**
- Can only access their own customer portal
- Can view their profile and permitted records
- Can submit support requests
- Cannot access internal notes or other customers

### Security Features

- Server-side authentication verification
- Server-side role and assignment authorization
- Input validation with Zod
- Password hashing with bcryptjs
- JWT tokens with expiration
- Version-based conflict prevention
- No API keys in frontend bundles
- CORS configuration

## 🧪 Testing

### Running Tests

**Backend tests** (in `/server` directory):
```bash
npm test
```

**Frontend tests** (in `/client` directory):
```bash
npm test
```

### Test Coverage

Current implementation includes:
- ✅ Unit tests for business logic (planned)
- ✅ API endpoint tests (planned)
- ✅ E2E tests for critical workflows (planned)

## 📝 Known Limitations

1. **Database**: Currently using SQLite for demo mode. For production, migrate to PostgreSQL with Supabase.
2. **AI Integration**: AI Reply Assistant uses template-based drafts with clear labeling. To use real AI, configure an AI provider API key.
3. **Email/SMS**: Email and SMS integrations are not implemented. Adapter interfaces are ready for integration.
4. **WooCommerce**: WooCommerce integration is mock-based. Credentials are required for real integration.
5. **Real-time Updates**: No WebSocket or real-time notification system implemented yet.
6. **File Uploads**: File upload functionality not implemented.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for hackathon demonstration purposes.

## 🎬 Two-Minute Demo Script

**0:00–0:15 — The Problem**
"Businesses don't just lose customers because of bad products. They lose trust when promises are forgotten, conversations are lost, and nobody knows who is responsible."

**0:15–0:35 — Dashboard**
Show the actual metrics and the Needs Attention panel. Open an overdue commitment and explain the evidence behind its alert.

**0:35–0:55 — Customer Memory Card**
Open a customer and show their interaction history, outstanding commitment, responsible administrator, and next step.

**0:55–1:15 — Promise Keeper**
Create or open a promise, show its due date, and fulfill it. Point out the recorded completion and activity event.

**1:15–1:35 — AI Assistant**
Generate an editable, context-aware reply draft. Explain that it uses the known customer context and requires human approval before sending.

**1:35–1:50 — Assignments and Collaboration**
Show a time-bound assignment, handover information, and the conflict-protection behavior. Explain that expired ownership does not erase outstanding work.

**1:50–2:00 — Customer Value**
Switch to the customer portal and show the customer's own request or approved update.

**Close**: "CareLoop doesn't just manage customer records. It helps teams remember what they promised, know who owns the next step, and follow through."

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

Built with ❤️ for the hackathon

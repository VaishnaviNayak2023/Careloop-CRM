# CareLoop CRM - Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend** (run in `/server` directory):
```bash
npm install
```

**Frontend** (run in `/client` directory):
```bash
npm install
```

### 2. Set Up Database

In the `/server` directory:
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

### 3. Start Servers

**Backend** (in `/server` directory):
```bash
npm run dev
```
Server runs on http://localhost:3001

**Frontend** (in `/client` directory):
```bash
npm run dev
```
Frontend runs on http://localhost:5173

### 4. Access the Application

Open http://localhost:5173 in your browser

**Demo Accounts:**
- Manager: manager@careloop.com / demo123
- Staff: staff@careloop.com / demo123
- Customer: customer@careloop.com / demo123

## Troubleshooting

### npm install is slow or hangs
- Try using `npm install --legacy-peer-deps`
- Or use `npm install --no-audit --no-fund`
- If still slow, consider using a different npm registry

### Prisma commands fail
- Ensure you're in the `/server` directory
- Run `npx prisma generate` first
- Check that `.env` file exists with DATABASE_URL

### Server won't start
- Check that port 3001 is not in use
- Ensure database migrations have been run
- Check server console for error messages

### Frontend won't start
- Check that port 5173 is not in use
- Ensure backend is running first
- Check browser console for errors

## Development Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with demo data

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
```

Built files will be in `/client/dist`

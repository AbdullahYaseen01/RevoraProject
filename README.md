# Revara v2 - Real Estate Investment Platform

A comprehensive platform for real estate investors to find distressed properties, connect with verified cash buyers, and close deals faster.

## 🚀 Features

- **Advanced Property Search** - Find distressed properties with interactive maps and filters
- **Verified Cash Buyers** - Connect with pre-verified cash buyers ready to close deals
- **Skip Tracing Integration** - Get owner contact information instantly
- **Deal Analysis** - AI-powered analysis for deal evaluation
- **Contract Generation** - Generate professional contracts with AI assistance
- **Subscription Management** - Tiered pricing with Stripe integration
- **Affiliate Program** - 25% recurring commissions for affiliates

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Database:** NeonDB (PostgreSQL)
- **Authentication:** NextAuth.js
- **Maps:** Mapbox
- **Payments:** Stripe
- **AI:** OpenAI API
- **Skip Tracing:** BatchData API
- **Property Data:** RentCast API

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- NeonDB account
- Mapbox API key
- OpenAI API key
- BatchData API key
- RentCast API key
- Stripe account (for payments)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd revara_v2
npm install
```

### 2. Environment Setup

Copy the `.env.local` file and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Update the following variables in `.env.local`:

```env
# Database
DATABASE_URL=your_neon_db_connection_string_here

# API Keys
MAPBOX_API_KEY=your_mapbox_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
BATCHDATA_API_KEY=your_batchdata_api_key_here
RENTCAST_API_KEY=your_rentcast_api_key_here

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Plaid (for bank verification)
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_ENV=sandbox
```

### 3. Database Setup

1. Create a NeonDB database
2. Update the `DATABASE_URL` in your `.env.local`
3. Run database migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   └── db.ts             # Database connection
└── components/            # Reusable components
    ├── ui/               # UI components
    └── forms/            # Form components

prisma/
└── schema.prisma         # Database schema
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users** - User accounts with roles and subscriptions
- **Properties** - Property data from RentCast API
- **CashBuyerProfiles** - Verified cash buyer information
- **Contacts** - Skip tracing and contact management
- **AffiliateProfiles** - Affiliate program management
- **Subscriptions** - Stripe subscription management

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

## 🚧 Development Status

- ✅ Homepage and landing page
- ✅ Database schema and models
- ✅ Environment configuration
- 🔄 Authentication system (NextAuth.js)
- 🔄 Property search and filtering
- 🔄 Map integration (Mapbox)
- 🔄 Cash buyer management
- 🔄 Payment system (Stripe)
- 🔄 Affiliate program

## 📝 API Integration

### RentCast API
- Property data and search
- Real-time property information
- Market analysis data

### Mapbox API
- Interactive maps
- Geocoding and reverse geocoding
- Custom map styles

### OpenAI API
- Contract generation
- Deal analysis
- Property insights

### BatchData API
- Skip tracing services
- Owner contact information
- Batch processing

### Stripe API
- Subscription management
- Payment processing
- Webhook handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@revara.com or join our Discord community.

---

**Revara v2** - Find Deals. Close Faster. Make More Money.

# Revora Project - Complete Real Estate Platform

A comprehensive Next.js real estate investment platform with advanced property search, map integration, cash buyer management, and deal tracking capabilities.

## 🚀 Features

### ✅ **Fully Working Features**
- **Property Search**: Advanced search with map integration and filters
- **Interactive Maps**: Mapbox-powered maps with property markers
- **Database Integration**: SQLite database with sample properties
- **User Authentication**: Google OAuth and email/password login
- **Cash Buyer Management**: Complete buyer profiles and contact system
- **Contract Management**: Full CRUD operations for contracts
- **Skip Tracing**: Property owner lookup functionality
- **Dashboard**: Comprehensive user dashboard with all tools
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

### 🎯 **Key Components**
- Property search with 50+ properties display
- Map-based property discovery
- User registration and authentication
- Cash buyer profiles and contact system
- Contract creation and management
- Skip trace functionality
- Complete dashboard interface

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Maps**: Mapbox GL JS
- **Property Data**: Rentcast API integration
- **UI Components**: Custom components with Shadcn UI

## 📋 Setup Instructions

### 1. Clone and Install
```bash
git clone https://github.com/AbdullahYaseen01/RevoraProject.git
cd RevoraProject
npm install
```

### 2. Environment Setup
Create a `.env.local` file with the following variables:

```env
# Database Configuration
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Mapbox API (Get from Mapbox)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"
MAPBOX_API_KEY="your-mapbox-token"

# Rentcast API (Get from Rentcast)
RENTCAST_API_KEY="your-rentcast-api-key"
RENTCAST_BASE_URL="https://api.rentcast.io/v1"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Schema

The application uses SQLite with the following main entities:
- **Users**: User accounts with authentication
- **Properties**: Property data and search history
- **CashBuyerProfiles**: Verified cash buyer information
- **Contracts**: Deal management and tracking
- **Searches**: User search history

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── properties/        # Property pages
│   └── cash-buyers/       # Cash buyer pages
├── components/            # Reusable components
│   ├── mapbox/           # Map components
│   ├── property-search/  # Search components
│   └── ui/               # UI components
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## 🎯 Current Status

### ✅ **Completed Features**
- Property search with map integration
- User authentication (Google OAuth + Email/Password)
- Database integration with sample data
- Cash buyer management system
- Contract management (CRUD operations)
- Skip trace functionality
- Complete dashboard interface
- Responsive design and UI improvements
- Error handling and validation

### 🔄 **Ready for Enhancement**
- Payment integration (Stripe)
- Advanced property analytics
- Email notifications
- File upload capabilities
- Advanced search filters
- Property comparison tools

## 🚀 Deployment

The project is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support or questions about this implementation, please refer to the comprehensive documentation in the project files.

---

**Revora Project** - Complete Real Estate Investment Platform
**Status**: ✅ Fully Functional and Ready for Production

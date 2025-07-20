# Rooms - Professional Networking Platform

A modern platform that connects investors with entrepreneurs, freelancers with clients, and mentors with mentees - completely free.

## 🚀 Features

### Core Features
- **User Registration & Profiles**: Simple onboarding with rich profile creation
- **Hashtag System**: Define your interests (#mentorariyorum, #yatirimariyorum, etc.)
- **Discovery Page**: Browse public profiles with hashtag filtering
- **Connection Requests**: Send and receive connection requests
- **Real-time Messaging**: Chat with your connections
- **Meeting Planning**: Schedule meetings with email and in-app notifications
- **Private Rooms**: Audio/video/text meeting rooms
- **Profile Reviews**: Rate and review your connections

### Membership Tiers
- **Free**: 2 hashtags, meeting planning
- **Premium**: Unlimited hashtags, room creation permissions

## 🏗️ Tech Stack

- **Frontend**: Next.js (React with SSR/SEO)
- **Backend**: Node.js (Express.js)
- **Database**: PostgreSQL
- **Real-time**: Socket.IO
- **Cloud**: AWS (EC2, S3, RDS, CloudFront)
- **Testing**: Jest, React Testing Library
- **Deployment**: Render (for testing)

## 📁 Project Structure

```
rooms/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── docs/              # Documentation
└── tests/             # Integration tests
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pvdrege/rooms.io.git
cd rooms.io
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start development servers:
```bash
npm run dev
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

## 📦 Deployment

```bash
# Build for production
npm run build

# The frontend will be built to frontend/out/
# The backend will be built to backend/dist/
```

## 🎯 Sprint 1 Goals (2 weeks)

- [x] Project setup and architecture
- [x] User authentication (register/login)
- [x] User profiles with hashtag selection  
- [x] Discovery page with filtering
- [x] Basic API endpoints
- [x] Database schema implementation
- [x] Mobile-responsive UI with dark/light theme
- [x] WebSocket integration for real-time features
- [x] Comprehensive test coverage
- [x] Development and deployment scripts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Development Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/pvdrege/rooms.io.git
cd rooms.io
npm install
```

2. **Set up database:**
```bash
# Create PostgreSQL databases
createdb rooms_dev
createdb rooms_test

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Update backend/.env with your database credentials
```

3. **Start development environment:**
```bash
# Option 1: Use our development script
./scripts/dev.sh

# Option 2: Manual start
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

### Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only  
npm run test:frontend

# Watch mode for development
cd backend && npm run test:watch
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Profile Endpoints
- `PUT /api/profiles` - Update user profile
- `POST /api/profiles/picture` - Upload profile picture
- `DELETE /api/profiles/picture` - Remove profile picture

### Discovery Endpoints  
- `GET /api/discovery` - Discover profiles with filtering
- `GET /api/discovery/profile/:userId` - Get specific profile

### Hashtag Endpoints
- `GET /api/hashtags` - Get all hashtags
- `GET /api/hashtags/category/:category` - Get hashtags by category
- `GET /api/hashtags/popular` - Get popular hashtags
- `GET /api/hashtags/search` - Search hashtags

### Connection Endpoints
- `POST /api/connections` - Send connection request
- `PUT /api/connections/:id` - Accept/decline request
- `GET /api/connections` - Get user connections

## 🔧 Environment Variables

### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rooms_dev
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Email (optional for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🎨 Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: Joi schema validation
- **Real-time**: Socket.IO for WebSocket connections
- **Testing**: Jest with Supertest

### Frontend  
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Headless UI with custom components
- **State Management**: React hooks with Context API
- **HTTP Client**: Axios with interceptors
- **Real-time**: Socket.IO client
- **Testing**: Jest with React Testing Library

## 🏗️ Project Structure

```
rooms/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── database/       # Database connection and migrations
│   │   ├── middleware/     # Authentication and validation
│   │   ├── routes/         # API endpoints
│   │   └── __tests__/      # Backend tests
├── frontend/               # Next.js application  
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript definitions
├── scripts/               # Development and deployment scripts
└── docs/                  # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details. 
# GigaEats - B2B2C Bulk Food Ordering Platform

GigaEats is a comprehensive three-sided marketplace designed to revolutionize bulk food ordering in Malaysia. It connects Sales Agents, Food Vendors, and Bulk Food Buyers on a unified, efficient, and scalable platform.

## 🏗️ Architecture

This project follows a microservices architecture with the following services:

- **API Gateway** - Central entry point and request routing
- **User Service** - User management and authentication
- **Vendor Service** - Vendor profiles and menu management
- **Order Service** - Order processing and tracking
- **Payment Service** - Payment processing and commission management
- **Integration Service** - External API integrations (Lalamove, Payment gateways)

## 🚀 Tech Stack

- **Backend**: Node.js, NestJS, TypeScript
- **Database**: PostgreSQL with Supabase
- **Cache**: Redis
- **API Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Monitoring**: Health checks and logging

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose
- Git

## 🛠️ Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/samcodersam7/gigaeats.git
cd gigaeats
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 3. Install Dependencies

```bash
# Install all dependencies for the monorepo
npm install
```

### 4. Start Development Environment

```bash
# Start all services with Docker Compose
npm run docker:dev

# Or start individual services
npm run dev
```

### 5. Database Setup

The PostgreSQL database will be automatically initialized with the basic schema when you start the Docker containers.

## 🐳 Docker Commands

```bash
# Start all services
npm run docker:dev

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Rebuild containers
docker-compose up --build
```

## 📚 API Documentation

Once the services are running, you can access the API documentation:

- **API Gateway Swagger**: http://localhost:3000/api/docs
- **User Service**: http://localhost:3001/api/docs
- **Vendor Service**: http://localhost:3002/api/docs
- **Order Service**: http://localhost:3003/api/docs
- **Payment Service**: http://localhost:3004/api/docs
- **Integration Service**: http://localhost:3005/api/docs

## 🔍 Health Checks

Check the health of all services:

```bash
# API Gateway health
curl http://localhost:3000/api/v1/health

# Detailed health check
curl http://localhost:3000/api/v1/health/detailed
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Environment Variables for Production

Set these environment variables in your Vercel dashboard:

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `REDIS_HOST`
- `REDIS_PORT`

## 📁 Project Structure

```
gigaeats/
├── apps/                          # Microservices
│   ├── api-gateway/              # API Gateway service
│   ├── user-service/             # User management service
│   ├── vendor-service/           # Vendor management service
│   ├── order-service/            # Order management service
│   ├── payment-service/          # Payment & commission service
│   └── integration-service/      # External integrations service
├── libs/                         # Shared libraries
│   ├── shared/                   # Common utilities and types
│   ├── database/                 # Database utilities
│   └── auth/                     # Authentication utilities
├── scripts/                      # Utility scripts
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD pipelines
├── docker-compose.yml            # Development environment
├── turbo.json                    # Turborepo configuration
└── package.json                  # Root package configuration
```

## 🔧 Development Workflow

1. **Feature Development**: Create feature branches from `develop`
2. **Testing**: Ensure all tests pass locally
3. **Pull Request**: Submit PR to `develop` branch
4. **Code Review**: Get approval from team members
5. **Staging**: Merge to `develop` triggers staging deployment
6. **Production**: Merge to `main` triggers production deployment

## 📊 Monitoring and Logging

- Health checks available at `/health` endpoints
- Structured logging with configurable levels
- Performance monitoring with built-in metrics
- Error tracking and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Hanafi** - Product Owner
- **Khairul** - Technical Lead

## 📞 Support

For support and questions, please contact:
- Email: support@gigaeats.com
- Documentation: [docs.gigaeats.com](https://docs.gigaeats.com)

---

**GigaEats** - Revolutionizing bulk food ordering in Malaysia 🇲🇾

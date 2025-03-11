# Express PostgreSQL TypeScript Boilerplate

A modern, secure, and scalable Express.js API boilerplate with TypeScript, PostgreSQL, and optional Redis caching.

## Author

Girish Arora
- Email: aroragirish08@gmail.com
- LinkedIn: https://www.linkedin.com/in/girish-aroda-a2b44713a/

## Features

- 🚀 TypeScript support
- 🔐 JWT Authentication
- 🔒 Two-Factor Authentication (2FA)
- 📝 Input validation with Zod
- 🗄️ PostgreSQL with Drizzle ORM
- 💾 Optional Redis caching (disabled by default)
- 📦 Docker support
- 📝 API response helpers
- 📊 Winston logger
- 🔍 ESLint configuration

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose (for database)
- PostgreSQL (if running locally without Docker)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd express-postgres-typescript-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:

For Docker:
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/express_api
JWT_SECRET=your-super-secret-key-change-this-in-production

# Redis is disabled by default. To enable Redis caching, uncomment these lines:
# ENABLE_REDIS=true
# REDIS_URL=redis://redis:6379
```

For local development:
```env
# Required
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/express_api
JWT_SECRET=your-super-secret-key-change-this-in-production

# Redis is disabled by default. To enable Redis caching, uncomment these lines:
# ENABLE_REDIS=true
# REDIS_URL=redis://localhost:6379
```

4. Start the application:

Using Docker (recommended):
```bash
docker-compose up --build
```

For local development:
```bash
# Start PostgreSQL container
docker-compose up db -d

# Start the development server
npm run dev
```

Note: Redis caching is disabled by default. The application will work perfectly fine without Redis. If you want to enable Redis caching later:
1. Uncomment the ENABLE_REDIS and REDIS_URL lines in your .env file
2. Either:
   - Install Redis on your machine
   - Or start the Redis container: `docker-compose up redis -d`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-2fa` - Verify 2FA code
- `POST /api/auth/setup-2fa` - Setup 2FA for a user

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/me` - Delete current user account

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── db/            # Database configuration and migrations
├── middleware/     # Custom middleware
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── app.ts         # Application entry point
```

## Development

### Running Locally

1. Start PostgreSQL and Redis:
```bash
docker-compose up db redis
```

2. Start the development server:
```bash
npm run dev
```

### Database Migrations

- Generate migrations:
```bash
npm run db:generate
```

- Push schema changes:
```bash
npm run db:push
```

- View database with Drizzle Studio:
```bash
npm run db:studio
```

### Linting

- Run ESLint:
```bash
npm run lint
```

- Fix ESLint issues:
```bash
npm run lint:fix
```

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Copyright

© 2024 Express PostgreSQL TypeScript Boilerplate by Girish Arora. All rights reserved. 
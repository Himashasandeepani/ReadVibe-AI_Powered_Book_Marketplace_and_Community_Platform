# ReadVibe Backend

Node.js + Express.js backend with PostgreSQL database for the ReadVibe project.

## Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (if running without Docker)

### Installation

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your settings:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=readvibe_db
   DB_USER=postgres
   DB_PASSWORD=password
   JWT_SECRET=your_secret_key
   FRONTEND_URL=http://localhost:5173
   EMAIL_ENABLED=true
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-gmail-address@gmail.com
   SMTP_PASS=your-gmail-app-password
   EMAIL_FROM=your-gmail-address@gmail.com
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running with Docker

1. **Build and start containers from the repository root:**
   ```bash
   cd ..
   docker-compose up --build
   ```

2. **Access the API:**
   - Backend: http://localhost:5000
   - PostgreSQL: localhost:5432

### Running Locally

1. **Start PostgreSQL** (ensure it's running)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Start production server:**
   ```bash
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database configuration
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   └── server.js      # Main server file
├── .env.example       # Environment variables template
├── Dockerfile         # Docker image configuration
└── package.json       # Project dependencies
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user

### Books
- GET `/api/books` - Get all books
- GET `/api/books/:id` - Get book by ID
- POST `/api/books` - Create book (Stock Manager)
- PUT `/api/books/:id` - Update book (Stock Manager)
- DELETE `/api/books/:id` - Delete book (Stock Manager)

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users` - Get all users (Admin)

### Cart
- GET `/api/cart` - Get cart
- POST `/api/cart` - Add to cart
- DELETE `/api/cart/:id` - Remove from cart

### Orders
- GET `/api/orders` - Get orders
- POST `/api/orders` - Create order
- GET `/api/orders/:id` - Get order by ID
- GET `/api/orders/all` - Get all orders for stock manager and admin dashboards

### Community
- GET `/api/community/posts` - Get all posts
- POST `/api/community/posts` - Create post
- DELETE `/api/community/posts/:id` - Delete post

### Support
- GET `/api/support/messages` - Get support messages
- POST `/api/support/messages` - Create a support message
- GET `/api/support/live-chat` - Get live chat threads
- POST `/api/support/live-chat` - Create or reply in a live chat thread

## Development

### Running Tests
```bash
npm test
```

Note: the current `npm test` script exits with a placeholder message because an automated test suite has not been added yet.

### Docker Commands

**View logs:**
```bash
docker-compose logs -f backend
```

**Stop containers:**
```bash
docker-compose down
```

**Remove all data:**
```bash
docker-compose down -v
```

## Technologies

- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Email:** Nodemailer with Gmail SMTP support
- **Containerization:** Docker
- **Package Manager:** npm

# ReadVibe Frontend

A modern React-based e-commerce and community platform for book lovers, built with Vite, Bootstrap, and React Router.

## Overview

ReadVibe is a full-featured book marketplace and community platform featuring:
- User authentication and role-based access (User, Stock Manager, Admin)
- Book marketplace with browsing and search
- Shopping cart and checkout system
- User wishlist functionality
- Community posts and discussions
- Admin dashboard for system management
- Stock manager dashboard for inventory and order tracking
- User profile management

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Routing:** React Router v6
- **UI Framework:** Bootstrap 5
- **Icons:** FontAwesome
- **State Management:** React Hooks & LocalStorage
- **Package Manager:** npm

## Installation

### Prerequisites
- Node.js 16+ and npm 8+

### Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Available Scripts

### Development
```bash
npm run dev      # Start Vite dev server with hot reload
```

### Production
```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Code Quality
```bash
npm run lint     # Run ESLint
```

## Project Structure

```
frontend/
├── public/                    # Static files
│   └── assets/               # Images and media
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Admin/           # Admin dashboard components
│   │   ├── Cart/            # Shopping cart components
│   │   ├── Checkout/        # Checkout process components
│   │   ├── Community/       # Community section components
│   │   ├── DeliveryDetails/ # Delivery form components
│   │   ├── Home/            # Home page components
│   │   ├── Login/           # Authentication components
│   │   ├── Marketplace/     # Marketplace components
│   │   ├── OrderConfirmation/ # Order confirmation components
│   │   ├── policies/        # Policy pages (Privacy, Terms, etc.)
│   │   ├── StockManager/    # Stock manager components
│   │   ├── UserProfile/     # User profile components
│   │   ├── Wishlist/        # Wishlist components
│   │   ├── AdminFooter.jsx
│   │   ├── AdminHeader.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── StockManagerFooter.jsx
│   │   └── StockManagerHeader.jsx
│   ├── pages/               # Full page components
│   │   ├── AdminPanel.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Community.jsx
│   │   ├── DeliveryDetails.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Marketplace.jsx
│   │   ├── OrderConfirmation.jsx
│   │   ├── StockManager.jsx
│   │   ├── UserProfile.jsx
│   │   └── Wishlist.jsx
│   ├── styles/              # Global and component styles
│   │   ├── components/
│   │   └── pages/
│   ├── utils/               # Utility functions
│   │   ├── auth.js         # Authentication utilities
│   │   └── helpers.js      # Helper functions
│   ├── App.jsx             # Main app component with routing
│   ├── App.css
│   ├── main.jsx            # React entry point
│   ├── main.css
│   └── index.css
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── package.json
└── README.md
```

## Key Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication (ready for backend integration)
- Role-based access control (User, Stock Manager, Admin)
- Persistent login with localStorage

### Home Page
- Hero section with featured content
- Featured books showcase
- Popular books carousel
- Community highlights
- Statistics section
- Guest notice for non-logged-in users

### Marketplace
- Browse all available books
- Search and filter functionality
- Book details modal
- Add to cart/wishlist
- Book reviews and ratings

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- Real-time cart count
- Order summary

### Checkout
- Delivery address form
- Shipping method selection
- Payment method selection
- Order review
- Order confirmation

### User Features
- User profile management
- Order history
- Wishlist management
- Community participation
- Review and ratings

### Community
- View community posts
- Create new posts
- Comment on posts
- Request books from library
- Community discussions

### Admin Dashboard
- User management (Add, Edit, Delete)
- Community post moderation
- Analytics and statistics
- System settings management
- Admin controls

### Stock Manager Dashboard
- Inventory management
- Add/Edit/Delete books
- Track stock levels
- Order tracking and management
- Supplier management
- Book request handling
- Popular books management
- Report generation

## Authentication & User Roles

### User Types:
1. **Guest** - Browse only, limited access
2. **User (Regular)** - Full marketplace access, cart, wishlist, orders
3. **Stock Manager** - Inventory and supplier management
4. **Admin** - System management and moderation

### Role-Based Features:
- **Users**: Can access Cart, Profile, Wishlist, Community
- **Stock Managers**: Can access Stock Manager Dashboard
- **Admins**: Can access Admin Dashboard and Stock Manager Dashboard

## Storage

The application uses localStorage for data persistence:
- `currentUser` - Current logged-in user
- `cart` - Shopping cart items
- `wishlist_${userId}` - User wishlists
- `userOrders` - User orders
- `communityPosts` - Community posts
- And more role-specific data

## Navigation

### Header Navigation (for all users)
- **Home** - Browse featured books and content
- **Browse** - Full marketplace
- **Community** - Community posts and discussions
- **Cart** - Shopping cart (logged-in users only)
- **User Menu** - Profile, Wishlist, Dashboards (role-based), Logout

### Role-Based Access
- **Regular Users**: Can access Cart, Profile, Wishlist, Community
- **Stock Managers**: Can access Stock Manager Dashboard
- **Admins**: Can access Admin Dashboard and Stock Manager Dashboard

## Styling

- **Bootstrap 5** - Core UI framework
- **Custom CSS** - Component and page-specific styles in `styles/` directory
- **FontAwesome** - Icons throughout the app
- **Responsive Design** - Mobile-first approach

## Performance Optimizations

- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- Component-level styling
- Efficient state management with hooks

## Development Guidelines

1. **Component Structure**: Each component should be self-contained with its own styles
2. **Naming**: Use PascalCase for components, camelCase for functions/variables
3. **File Organization**: Keep related files together (component + styles)
4. **Reusability**: Create shared components in `components/` for reuse
5. **State Management**: Use React hooks for local state, localStorage for persistence
6. **Error Handling**: Implement proper error boundaries and error messages

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3000
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### Hot Module Replacement Not Working
- Restart the dev server
- Clear browser cache

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Backend Integration

This frontend is designed to work with the Node.js/Express backend. See the backend README for:
- API documentation
- Database schema
- Running backend with Docker
- Environment setup

## License

ISC

---

**Note**: This frontend currently uses localStorage for data persistence. For production, it integrates with the backend API for data management.

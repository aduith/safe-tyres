# SafeTyres - Anti-Puncture Liquid eCommerce

SafeTyres is a full-stack e-commerce application built with Next.js 15, designed for selling tyre anti-puncture liquid. It features a modern, responsive UI, secure user authentication, a comprehensive admin dashboard, and a seamless shopping experience.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) using [Mongoose](https://mongoosejs.com/)
- **Authentication:** Custom JWT-based Auth
- **Icons:** [Lucide React](https://lucide.dev/)

## ✨ Features

### User Features
- **Product Browsing:** View detailed product pages with images and descriptions.
- **Shopping Cart:** Add items, adjust quantities, and manage cart sessions (guest & logged-in).
- **Checkout:** Streamlined checkout process (mock payment integration).
- **User Accounts:** Register, login, and manage profile order history.
- **Reviews:** Leave ratings and reviews for products.
- **Dosage Chart:** View and download application dosage charts.

### Admin Dashboard
- **Overview:** View sales analytics, order stats, and recent activity.
- **Product Management:** Create, update, and delete products.
- **Order Management:** View and manage customer orders (status updates, cancellations).
- **User Management:** View registered users and manage roles.
- **Review Moderation:** Approve or reject user-submitted reviews.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd safeTyres
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add the following variables:
    ```env
    MONGODB_URI=mongodb://localhost:27017/safetyres
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRE=30d
    NEXT_PUBLIC_API_URL=/api
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

### Database Seeding

To populate the database with initial products and a default admin user, run:

```bash
npm run seed
```

This will create:
- 4 Product variants (200ml, 300ml, 500ml, 1L) with correct pricing.
- An Admin user:
    - **Email:** `admin@safetyres.com`
    - **Password:** `adminpassword123`

## 📂 Project Structure

```
.
├── app/                # Next.js App Router pages and API routes
│   ├── api/            # Backend API routes (Auth, Products, Orders, etc.)
│   ├── admin/          # Admin dashboard pages
│   └── (public)/       # Public facing pages (Home, Shop, Cart)
├── components/         # Reusable React components
│   ├── ui/             # Shadcn UI components
│   └── ...             # Custom components (Navbar, ProductCard, etc.)
├── lib/                # Utilities and Configuration
│   ├── models/         # Mongoose Database Models
│   ├── db.ts           # Database connection logic
│   └── auth.ts         # Authentication helpers
├── public/             # Static assets (images, pdfs)
└── services/           # Frontend API service layer
```

## 🔗 API Routes

The backend logic is now fully integrated into Next.js API Routes:

- **Auth:** `/api/auth/[login|register|profile]`
- **Products:** `/api/products` (GET, POST), `/api/products/[id]` (PUT, DELETE)
- **Orders:** `/api/orders`, `/api/orders/[id]`
- **Cart:** `/api/cart`, `/api/cart/[itemId]`
- **Users:** `/api/users` (Admin only)
- **Reviews:** `/api/reviews`

## 📄 License

This project is proprietary and confidential.

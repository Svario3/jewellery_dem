# 💎 AURÉLIA JEWELS | Royal Heritage & Modern Fine Jewellery E-Commerce

> A full-stack, production-grade luxury jewellery e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js), Vite, Tailwind CSS, JWT authentication, and Razorpay sandbox payment integration. Crafted for presentation in the **SVARIO Web Development portfolio**.

---

## 👑 Brand Concept & Visual Identity

**AURÉLIA JEWELS** celebrates the majesty of royal Indian heritage jewellery alongside sleek contemporary haute joaillerie.

- **Color Palette:**
  - Deep Chocolate Brown (`#150B07` / `#23140C` / `#321D12`)
  - Antique Gold (`#D4AF37` / `#C5A059` / `#A4822B`)
  - Warm Ivory (`#FDFBF7` / `#F5F0E8` / `#EBE3D5`)
  - Cream White (`#FFFFFF` / `#FAF8F5`)
- **Typography:**
  - Cormorant Garamond & Cinzel for regal serif display headings
  - Montserrat & Plus Jakarta Sans for refined, legible modern body text
- **Hallmarks of Quality:**
  - 100% BIS Hallmarked (916 22K & 750 18K solid gold)
  - Natural Certified Diamonds (IGI / GIA certification)
  - Door-to-Door Insured Armored Shipping across India
  - Lifetime Benchmark Gold Exchange & Free Boutique Servicing

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, React Router v6, Canvas Confetti |
| **Backend** | Node.js, Express.js (REST APIs, ES Modules, Morgan logging, Multer) |
| **Database** | MongoDB with Mongoose (with embedded `MongoMemoryServer` zero-config fallback) |
| **Authentication** | JSON Web Tokens (JWT) & Bcrypt password hashing |
| **Payments** | Razorpay Test / Sandbox Payment Gateway with signature verification & COD |
| **Image Storage** | Cloudinary integration with base64/curated fallback |
| **HTTP Client** | Axios with request/response interceptors & token synchronization |

---

## 🏛️ Application Architecture & Key Modules

### 1. Customer Storefront
- **Regal Homepage:** Cinematic hero carousel, 4 royal trust pillars, curated category vaults, tabbed collection showcases (Featured, Bridal Trousseau, Bestsellers, New In Vault), heritage craftsmanship narrative, patron reviews, and VIP newsletter subscription with instant discount vouchers.
- **Dynamic Shop & Filter Catalog:**
  - Keyword search across product titles, descriptions, gems, and SKUs
  - Category filters (Necklaces, Earrings, Rings, Bangles, Bridal, Traditional, Modern, Accessories)
  - Metal & Karat filters (22K Gold, 18K Rose/White Gold, Platinum 950, Polki)
  - Dual price slider / min-max inputs
  - In-stock availability toggle
  - Sorting (Newest, Price: Low to High, Price: High to Low, Rating, Popularity)
  - 2/3 Column Grid switchers & Pagination
  - Active filter chips with one-click "Clear All"
- **Product Details Page:**
  - Multi-image zoom gallery with thumbnail switcher
  - Exact karatage, gross weight, net gold weight, diamond carat clarity, and gemstone origins
  - Transparent Price Breakdown modal (Gold metal rate, making charges, gemstone value, 3% GST)
  - Variant selector (Ring size, Bangle diameter, Metal color, Dori length)
  - Live vault stock status indicator ("Only 2 left in vault")
  - Pincode delivery estimator with estimated courier arrival date
  - Luxury accordion tabs (Description, Specifications, BIS Hallmarking Guarantee, Care Guide)
  - Verified Customer Reviews with star rating submission form
  - "You May Also Admire" Related Products carousel
- **Shopping Bag & Slide-Out Drawer:**
  - Fast-access cart drawer + dedicated `/cart` page
  - Free shipping progress bar (Free above ₹5,000)
  - Line items with variant chips, quantity steppers, and instant deletion
  - Promotional voucher discounts (`AURELIA10` for 10% off, `BRIDAL5000`, `FIRSTGOLD`)
  - Luxury Velvet Keepsake & Wax-Seal Calligraphy Card option (+₹150)
- **Wishlist Vault:** Save favorite royal pieces, view stock status, and move directly into the shopping bag with 1 click.
- **Checkout Experience:**
  - Saved delivery addresses selector + Add New Address form with full Indian postal validation
  - Payment selection: **Razorpay Test Sandbox** (instant test cards/UPI simulation) or **Cash on Delivery (COD)**
  - Server-side inventory checks & server price recalculation
- **Order Confirmation & Invoicing:**
  - Golden confetti celebration
  - Unique royal order reference (`AUR-2026-XXXXXX`)
  - Printable / downloadable tax invoice
  - Order status timeline (Placed, Processing, Dispatched, Delivered)
- **Customer Account Portal:**
  - Profile & password updater
  - Order History & Tracking
  - Saved Delivery Addresses (add, edit, delete, set default)
  - Wishlist quick view
- **Editorial & Policy Pages:** About Heritage, Private Consultation Booking, Sizing & Hallmark FAQs, Return & Buyback Policies, Privacy.

---

### 2. Administrative Management Vault (`/admin`)
Protected by role-based authorization (`role === 'admin'`):
- **Executive Overview Dashboard:** Total Sales (₹), Orders Count, Patron Count, Vault Products, Processing Orders count, Low-Stock Alerts (≤ 3 units), Monthly Acquisition Volume chart, and Precious Metals Portfolio breakdown.
- **Product Management:**
  - Masterpiece inventory table with SKU, category, stock, purity, and price
  - "Add New Masterpiece" modal with image upload, karatage, net/gross weight, description, stock, and collection flags
  - Edit and Delete operations
- **Categories Management:** Add, edit, and organize collections and view live product counts.
- **Order Management:** View all customer acquisitions, filter by status, inspect customer delivery addresses and items, and update fulfillment status (*Placed*, *Processing*, *Dispatched*, *Delivered*, *Cancelled*) with automated audit timeline logging.
- **Patron Management:** Registered customer directory with lifetime order counts and total bullion spend.
- **Review Moderation:** Moderate patron reviews, toggle online visibility (Approve / Hide).

---

## 🔑 Demo Credentials (Pre-Seeded)

The database automatically seeds realistic high-definition jewellery pieces, categories, orders, and demo accounts upon first startup:

| Account Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aureliajewels.com` | `Admin@123` | Full Access to `/admin` Console & Storefront |
| **Patron / Customer** | `customer@aureliajewels.com` | `Customer@123` | Storefront, Cart, Checkout, My Orders |

*(Convenient one-click quick-fill buttons are provided directly on the Login screen!)*

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18+ or v22 LTS recommended)
- npm or pnpm

### 1. Clone & Setup Directories
```bash
git clone https://github.com/your-username/aurelia-jewels.git
cd aurelia-jewels
```

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds categories, products, admin and customer accounts
npm start        # Launches backend on http://localhost:5000
```
> **Zero-Config Database Note:** If no local MongoDB is running, the backend seamlessly launches an embedded high-performance `MongoMemoryServer` automatically. To connect to your MongoDB Atlas cluster, simply populate `MONGODB_URI` in `server/.env`.

### 3. Frontend Setup
In a separate terminal:
```bash
cd client
npm install
npm run dev      # Launches Vite dev server on http://localhost:5173
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to experience the royal vault.

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | API health status and version |
| `/api/auth/register` | POST | Public | Register new patron account |
| `/api/auth/login` | POST | Public | Authenticate user & issue JWT |
| `/api/auth/profile` | GET / PUT | Private | View or update customer profile |
| `/api/products` | GET | Public | Query products with keyword, category, metal, price, sort |
| `/api/products/:slugOrId` | GET | Public | Retrieve single product specifications & hallmark |
| `/api/products` | POST / PUT / DEL | Admin | Manage vault inventory |
| `/api/categories` | GET | Public | List categories with live product counts |
| `/api/cart` | GET / POST / PUT | Private | Manage shopping bag items and apply promo vouchers |
| `/api/wishlist` | GET / POST | Private | Toggle wishlisted jewels and move to bag |
| `/api/addresses` | GET / POST / DEL | Private | Saved delivery addresses management |
| `/api/orders` | POST | Private | Create order with price & stock verification |
| `/api/orders/my-orders` | GET | Private | List authenticated user orders |
| `/api/orders` | GET | Admin | View all customer orders |
| `/api/orders/:id/status`| PUT | Admin | Update order fulfillment status |
| `/api/payments/create-order` | POST | Private | Generate Razorpay order |
| `/api/payments/verify` | POST | Private | Verify Razorpay signature & capture order |
| `/api/admin/dashboard` | GET | Admin | Analytics overview, revenue, low stock alerts |

---

## 🌐 Production Deployment Guide

### Frontend on Vercel
1. Set the Root Directory to `client`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (Output Directory: `dist`).
4. Set Environment Variable: `VITE_API_URL=https://your-backend-api.onrender.com/api`.
5. Deploy.

### Backend on Render
1. Set Root Directory to `server`.
2. Environment: **Node**.
3. Build Command: `npm install`.
4. Start Command: `node server.js`.
5. Configure Environment Variables in Render:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (`mongodb+srv://...`)
   - `JWT_SECRET`: Random 64-character secret
   - `NODE_ENV`: `production`
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`: Your Razorpay test or live keys
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
6. Deploy.

---

## 🛡️ License & Credits

Built with precision for the **SVARIO Web Development Portfolio**.
© 2026 AURÉLIA JEWELS. All royal rights reserved.

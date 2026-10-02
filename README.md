# 🐾 Pet Café Management and Customer Experience System

> **A modern, full-stack MERN-architecture web application built according to the Pet Café Software Requirements Specification (SRS) with a high-fidelity, animated UI matching the provided design specifications.**

---

## 🌟 Overview & Key Highlights

The **Pet Café Management and Customer Experience System** is an end-to-end client-server platform designed for both customer delight and efficient café operations:
- **Customer Experience:** Real-time table slot reservations with capacity guards, interactive food & drink ordering with cart drawers, secure payment simulation with printable receipts, resident pet stories, and verified review submissions.
- **Staff Operations:** Live kitchen & barista Kanban pipeline (Pending ➔ Preparing ➔ Ready ➔ Served), daily reservation check-in management, and live pet activity status toggling (Available, Resting, Playing).
- **Admin Administration:** Full KPI dashboard (Revenue, Bookings, Orders, Active Pets, Users), CRUD management for pets and menu items, user role & status control, review moderation, and chronological audit trails.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `morgan` |
| **Database** | **PostgreSQL** supported natively (`pg`) with automatic, zero-config persistent **SQLite** fallback (`pet_cafe.db`) for immediate offline & turnkey execution |
| **Architecture** | Clean Decoupled Client-Server (`/backend` and `/frontend`) |

---

## 📂 Project Directory Structure

```
pet-cafe-app/
├── package.json              # Root runner (starts backend & frontend concurrently)
├── README.md                 # Project documentation & SRS conformance guide
├── backend/                  # Express.js REST API
│   ├── package.json
│   ├── server.js             # Main server entrypoint (Port 5000)
│   ├── .env                  # Environment variables & DB connection string
│   ├── .env.example
│   ├── data/
│   │   └── pet_cafe.db       # Persistent relational database
│   └── src/
│       ├── config/
│       │   └── db.js         # Unified PostgreSQL + SQLite database adapter
│       ├── controllers/      # Business logic & server-side validation
│       │   ├── authController.js
│       │   ├── petController.js
│       │   ├── menuController.js
│       │   ├── reservationController.js
│       │   ├── orderController.js
│       │   ├── paymentController.js
│       │   ├── reviewController.js
│       │   └── adminController.js
│       ├── middleware/
│       │   ├── authMiddleware.js # JWT verification & RBAC authorization
│       │   └── errorHandler.js   # Centralized error handling
│       ├── routes/           # RESTful API route definitions
│       └── seed/
│           └── seed.js       # Pre-seeded database with pets, menu, users, reviews
└── frontend/                 # React + Vite + Tailwind CSS Application
    ├── package.json
    ├── vite.config.js        # Port 3000 & /api reverse proxy to Port 5000
    ├── index.html            # Google Fonts (Outfit & Plus Jakarta Sans), SEO tags
    └── src/
        ├── App.jsx           # Root layout, modal router, and view switcher
        ├── index.css         # Custom animations, organic hero blob, micro-interactions
        ├── context/
        │   ├── AuthContext.jsx   # Session management & 1-click persona switching
        │   ├── CartContext.jsx   # Persistent cart state & tax calculations
        │   └── ToastContext.jsx  # Floating animated toast notifications
        ├── services/
        │   └── api.js            # Frontend HTTP client for all endpoints
        └── components/
            ├── Navbar.jsx               # Header with logo, nav links, cart & quick demo bar
            ├── HeroSection.jsx          # Pixel-perfect match to provided design screenshot
            ├── SafeHandlingBanner.jsx   # Safety & rules banner matching screenshot
            ├── SpecialMomentsSection.jsx# Featured moment cards (Coffee, Treats, Pets)
            ├── PetsSection.jsx          # Resident companions grid with species/status filters
            ├── MenuSection.jsx          # Artisanal coffees & treats with "Add to Order"
            ├── GallerySection.jsx       # Photo moments & weekly events showcase
            ├── AboutSection.jsx         # Animal-first welfare & hygiene standards
            ├── ReviewsSection.jsx       # Verified 5-star customer testimonials
            ├── Footer.jsx               # Operating hours, location, and safety links
            ├── ReservationModal.jsx     # Date/time slot booking with live capacity checks
            ├── CartDrawer.jsx           # Slide-out shopping cart drawer
            ├── CheckoutModal.jsx        # Payment options with card validation & receipts
            ├── CafeRulesModal.jsx       # 5 Golden Café Rules popup
            ├── PetDetailModal.jsx       # Full pet biography, temperament & care notes
            ├── AuthModal.jsx            # Sign In / Create Account with 1-click Demo credentials
            ├── SearchModal.jsx          # Instant search across pets, menu, and rules
            ├── CustomerPortalModal.jsx  # Customer bookings, order tracking & profile
            ├── StaffPortalModal.jsx     # Kitchen order Kanban & pet status switcher
            ├── AdminPortalModal.jsx     # KPI metrics, user management, CRUD, audit logs
            └── WriteReviewModal.jsx     # 5-star customer feedback modal
```

---

## ⚡ Quick Start & Running the Project

### 1. Run Everything Concurrently (Recommended)
From the root `pet-cafe-app` folder:
```bash
npm run dev
```
- **Frontend:** Accessible at [http://localhost:3000](http://localhost:3000)
- **Backend API:** Accessible at [http://localhost:5000](http://localhost:5000)

### 2. Run Independently
To run the backend server only:
```bash
npm run dev:backend
```
To run the frontend dev server only:
```bash
npm run dev:frontend
```

### 3. Re-seed Database
To reset the database with fresh sample pets, menu items, reservations, and orders:
```bash
npm run seed
```

---

## 👥 Pre-Configured Demo Accounts

For fast grading, testing, and reviewing, you can use the **1-click Demo buttons in the Navbar** or log in manually with the following credentials:

| Persona | Email | Password | Role & Permissions |
|---|---|---|---|
| **Administrator** | `admin@petcafe.com` | `admin123` | Full access: KPI analytics, Pet/Menu CRUD, User roles, Audit logs |
| **Staff Member** | `staff@petcafe.com` | `staff123` | Operational access: Kitchen order queue, Reservations check-in, Pet status |
| **Customer** | `customer@petcafe.com` | `customer123` | Customer access: Book tables, order food, checkout, review visits |

---

## 📋 SRS Conformance Checklist

| Requirement ID | Requirement Name | Implementation Detail | Status |
|---|---|---|:---:|
| **FR-01** | User Registration & Auth | JWT session tokens, bcrypt password hashing, input validations | ✅ Complete |
| **FR-02** | Customer Profile | Profile updates, reservation history, order history | ✅ Complete |
| **FR-03** | Pet Catalogue & Management | Full pet showcase, search/filter by species & status, admin CRUD, staff care notes | ✅ Complete |
| **FR-04** | Menu Management | Categories (Coffee, Tea, Bakery, Desserts, Savory Snacks), availability toggle, admin CRUD | ✅ Complete |
| **FR-05** | Reservation Management | Real-time capacity check (max 30 per slot), date/slot picker, customer cancellation | ✅ Complete |
| **FR-06** | Food & Beverage Ordering | Cart drawer, server-side calculated totals and 8% taxes, Kitchen pipeline states | ✅ Complete |
| **FR-07** | Payment and Billing | Online simulated card with formatting validation, Pay-at-Café, printable receipt popup | ✅ Complete |
| **FR-08** | Reviews and Feedback | Star ratings (1-5), customer comments, admin moderation (Approve / Hide) | ✅ Complete |
| **FR-09** | Notifications | Floating animated toast notifications for all system events and status changes | ✅ Complete |
| **FR-10** | Admin Dashboard & Reports | Revenue KPI cards, category breakdown, pet distribution, real-time metrics | ✅ Complete |
| **FR-11** | Search & Filtering | Real-time search modal, pet attribute filters, menu category filters | ✅ Complete |
| **FR-12** | Audit & Activity Management | Chronological audit logging on all admin/staff database changes | ✅ Complete |

---

## 🐘 Configuring PostgreSQL (Optional)

The application automatically runs with embedded SQLite if no PostgreSQL server is detected. To connect to an existing PostgreSQL database:
1. Open `backend/.env`
2. Configure your connection string:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/pet_cafe_db
   ```
3. Run the seed script:
   ```bash
   npm run seed
   ```
The unified database engine will automatically provision all relational tables and constraints in PostgreSQL!

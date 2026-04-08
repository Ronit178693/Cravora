<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=40&duration=3000&pause=1000&color=F97316&center=true&vCenter=true&multiline=true&width=600&height=100&lines=CRAVORA+PROJECT;Campus+Food+and+Delivery" alt="Cravora Header" />
</p>

<p align="center">
  <em>Order food. Deliver parcels. Earn money. All within your campus.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="https://cravora-chi.vercel.app">🌐 Live Demo</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-architecture">🏗️ Architecture</a> •
  <a href="#-getting-started">🚀 Getting Started</a> •
  <a href="#-api-reference">📡 API Reference</a>
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Order Lifecycle](#-order-lifecycle)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 About the Project

**Cravora** is a full-stack campus food ordering and peer-to-peer delivery platform built for university ecosystems. It connects three key players in campus life:

| 🎓 **Students** | 🏪 **Outlet Owners** | 🏃 **Runners** |
|:---:|:---:|:---:|
| Browse menus, order food, and send parcels from anywhere on campus | List your food stall, manage menus, and track incoming orders in real-time | Pick up deliveries, earn money, and track your stats — all from the same student account |

> **💡 Unique Design:** There is no separate "Runner" registration. Every student can seamlessly switch between **ordering food** and **delivering it** with a single tap. One account, two modes.

---

## ✨ Features

### 🎓 For Students (Customer + Runner Mode)

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT DASHBOARD                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ 🍔 Order     │  │ 📦 Send      │  │ 🏃 Switch to Runner │  │
│  │    Food      │  │    Parcel     │  │    Mode             │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  📊 Order History  •  💰 Delivery Stats  •  👤 Profile          │
└─────────────────────────────────────────────────────────────────┘
```

- **Browse Campus Outlets** — View all open food stalls with menus, images, and working hours
- **Smart Cart** — Add items, auto-calculate totals, and your cart **persists across page refreshes** (localStorage)
- **Place Orders** — Choose a drop location, review your order, and submit
- **Track Orders** — Real-time order status: `Pending → Accepted → Preparing → Out for Delivery → Delivered`
- **Send Parcels** — Request courier, Blinkit, or food pickups from the campus gate to your hostel
- **Switch to Runner Mode** — Instantly see available deliveries, accept them, and earn delivery fees
- **Delivery History** — Track all your past deliveries and earnings

### 🏪 For Outlet Owners

- **Outlet Management** — Create and configure your food stall with images, location, and working hours
- **Menu Builder** — Add/edit/remove menu items with categories (Snacks, Main Course, Beverages, Dessert)
- **Order Queue** — View incoming orders, accept them, and update preparation status
- **Analytics** — Track total order count and revenue

### 🔐 Security & Auth

- **JWT Authentication** — Stateless, secure, HTTP-only cookie-based sessions
- **Password Reset** — OTP-based password recovery via email (Nodemailer + Gmail SMTP)
- **Role-Based Access Control** — Middleware-protected routes for Students, Outlets, and Runners
- **Session Persistence** — Stay logged in across browser sessions without re-entering credentials

---

## 🏗️ Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT (Vercel)                            │
│                                                                         │
│   React 19 + Vite 7  ──────────────────────────────────────────────     │
│   │                                                                     │
│   ├── AuthContext ─── manages user state, JWT session via cookies        │
│   ├── CartContext ─── useReducer + localStorage for cart persistence     │
│   ├── API Layer ──── Axios instances with withCredentials: true          │
│   └── Protected Routes ── role-based guards (Student, Outlet)           │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │ HTTPS (cookies, JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVER (Render)                            │
│                                                                         │
│   Express 5 + Node.js ─────────────────────────────────────────────     │
│   │                                                                     │
│   ├── Middleware Pipeline                                               │
│   │   ├── cors (credentials: true, origin whitelist)                    │
│   │   ├── cookieParser (reads JWT from req.cookies)                     │
│   │   ├── authMiddleware (verifies JWT, attaches req.user)              │
│   │   ├── roleMiddleware (checks user role permissions)                 │
│   │   └── imageMiddleware (Multer + Cloudinary upload)                  │
│   │                                                                     │
│   ├── Controllers (7 modules)                                           │
│   │   ├── authController ─── register, login, logout, password reset    │
│   │   ├── userController ─── get current user profile                   │
│   │   ├── dashboardController ─── student & runner dashboard data       │
│   │   ├── outletController ─── CRUD for outlets                         │
│   │   ├── menuController ─── CRUD for menu items within outlets         │
│   │   ├── orderController ─── full order lifecycle management           │
│   │   └── packageController ─── parcel delivery management              │
│   │                                                                     │
│   └── Models (4 Mongoose schemas)                                       │
│       ├── User ─── name, email, role, deliveryStats, orderHistory       │
│       ├── Outlet ─── owner, menu[], orders[], location, images          │
│       ├── Order ─── customer, runner, outlet, items[], status           │
│       └── Package ─── customer, runner, type, status, locations         │
│                                                                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                    │
│                                                   │
│  ☁️ MongoDB Atlas ─── Primary database             │
│  ☁️ Cloudinary ─────── Image storage (menu/outlet) │
│  📧 Gmail SMTP ─────── Transactional emails        │
└──────────────────────────────────────────────────┘
```

### Request Lifecycle

```
Browser ──► Axios (withCredentials) ──► Express Server
                                           │
                                    ┌──────┴──────┐
                                    │ CORS Check   │
                                    │ JSON Parse   │
                                    │ Cookie Parse │
                                    └──────┬──────┘
                                           │
                                    ┌──────┴──────┐
                                    │ Auth MW      │──► 401 if no token
                                    │ (JWT verify) │
                                    └──────┬──────┘
                                           │
                                    ┌──────┴──────┐
                                    │ Role MW      │──► 403 if wrong role
                                    │ (permission) │
                                    └──────┬──────┘
                                           │
                                    ┌──────┴──────┐
                                    │ Controller   │
                                    │ (business    │──► MongoDB query
                                    │  logic)      │
                                    └──────┬──────┘
                                           │
                                    JSON Response ──► Browser
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|:---|:---:|:---|
| **React** | `19.2` | Component-based UI library |
| **Vite** | `7.3` | Lightning-fast dev server and bundler |
| **React Router DOM** | `7.13` | Client-side routing with protected routes |
| **Axios** | `1.13` | HTTP client with cookie support (`withCredentials`) |
| **Lucide React** | `0.564` | Beautiful, consistent icon set |
| **React Hot Toast** | `2.6` | Elegant notification toasts |

### Backend

| Technology | Version | Purpose |
|:---|:---:|:---|
| **Node.js** | `22+` | JavaScript runtime |
| **Express** | `5.2` | Web framework (latest major version with async error handling) |
| **Mongoose** | `9.2` | MongoDB ODM with schema validation |
| **JSON Web Token** | `9.0` | Stateless authentication via signed tokens |
| **bcrypt.js** | `3.0` | Password hashing (10 salt rounds) |
| **cookie-parser** | `1.4` | Parse HTTP-only cookies from requests |
| **Multer** | `2.0` | Multipart file upload handling |
| **Cloudinary** | `1.41` | Cloud-based image storage and CDN |
| **Nodemailer** | `8.0` | Email delivery (SMTP via Gmail) |
| **dotenv** | `17.2` | Environment variable management |

### Infrastructure

| Service | Purpose |
|:---|:---|
| **MongoDB Atlas** | Managed cloud database (M0 free tier) |
| **Render** | Backend hosting with auto-deploy from GitHub |
| **Vercel** | Frontend hosting with instant preview deployments |
| **Cloudinary** | Image CDN for menu items and outlet photos |
| **Gmail SMTP** | Transactional emails (welcome, OTP) |

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email UK
        String phoneNumber
        String password
        String role "Student | Outlet"
        Object deliveryStats
        Array orderHistory
        Date lastDeliveryAt
        Number otp
        Date otpExpires
    }
    
    OUTLET {
        ObjectId _id PK
        ObjectId owner FK
        String name
        String description
        String location
        String contactNumber
        Array images
        Object WorkingHours
        Boolean isOpen
        Array menu "embedded subdocuments"
        Number orderCount
        Array orders
    }
    
    ORDER {
        ObjectId _id PK
        ObjectId customer FK
        ObjectId runner FK "nullable"
        ObjectId outlet FK
        Array items
        String pickupLocation
        String dropLocation
        String status "Pending|Accepted|Preparing|OutForDelivery|Delivered|Cancelled"
        Number totalAmount
        Number deliveryFee
        Date deliveredAt
    }
    
    PACKAGE {
        ObjectId _id PK
        ObjectId customer FK
        ObjectId runner FK "nullable"
        String type "Courier|Blinket|Food"
        String description
        Number quantity
        String pickupLocation
        String dropLocation
        String status "Pending|Accepted|PickedUp|Delivered|Cancelled"
        Number deliveryFee
        String instructions
        Date deliveredAt
    }
    
    USER ||--o{ OUTLET : "owns"
    USER ||--o{ ORDER : "places as customer"
    USER ||--o{ ORDER : "delivers as runner"
    OUTLET ||--o{ ORDER : "receives"
    USER ||--o{ PACKAGE : "creates as customer"
    USER ||--o{ PACKAGE : "delivers as runner"
```

### Menu Item (Embedded in Outlet)

```javascript
{
  name:        String,        // "Paneer Tikka"
  description: String,        // "Juicy grilled paneer with spices"
  price:       Number,        // 120
  category:    Enum,          // "Snacks" | "Main Course" | "Beverages" | "Dessert" | "Other"
  image:       String,        // Cloudinary URL
  isAvailable: Boolean        // true
}
```

---

## 📡 API Reference

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `POST` | `/register` | ❌ | Create a new account (Student or Outlet) |
| `POST` | `/login` | ❌ | Authenticate and receive a session cookie |
| `POST` | `/logout` | ✅ | Clear the session cookie |
| `POST` | `/password-reset-otp` | ❌ | Send a 6-digit OTP to email |
| `POST` | `/reset-password` | ❌ | Verify OTP and set new password |

### 👤 User — `/api/users`

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/me` | ✅ | Get the currently logged-in user's profile |

### 📊 Dashboard — `/api/dashboard`

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/` | ✅ | Student dashboard: profile + all open outlets |
| `GET` | `/profile` | ✅ | Detailed profile with order/delivery stats |
| `GET` | `/runner` | ✅ | Runner dashboard: available & active deliveries |
| `GET` | `/runner/stats` | ✅ | Runner earnings, delivery count, and history |

### 🏪 Outlets — `/api/outlets`

| Method | Endpoint | Auth | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/addOutlet` | ✅ | Outlet | Create a new outlet with images |
| `GET` | `/me/outlet` | ✅ | Outlet | Get the owner's outlet(s) |
| `PUT` | `/updateOutlet/:id` | ✅ | Outlet | Update outlet info |
| `DELETE` | `/deleteOutlet/:id` | ✅ | Outlet | Delete an outlet |
| `GET` | `/allOutlet` | ✅ | Any | Get all outlets (for browsing) |
| `GET` | `/getOutlet/:id` | ✅ | Any | Get a specific outlet with full menu |

### 🍽️ Menu — `/api/menu`

| Method | Endpoint | Auth | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/addMenu-item/:id` | ✅ | Outlet | Add a menu item to an outlet |
| `PUT` | `/:id/item/:itemId` | ✅ | Outlet | Update a menu item |
| `DELETE` | `/:id/item/:itemId` | ✅ | Outlet | Remove a menu item |

### 🛒 Orders — `/api/orders`

| Method | Endpoint | Auth | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/` | ✅ | Student | Place a new food order |
| `GET` | `/my-orders` | ✅ | Student | Get all my orders |
| `GET` | `/outlet-orders` | ✅ | Outlet | Get orders for my outlet |
| `PUT` | `/:id/accept` | ✅ | Outlet | Accept an incoming order |
| `GET` | `/available` | ✅ | Student | Get orders available for delivery |
| `PUT` | `/:id/accept-delivery` | ✅ | Student | Accept a delivery as a runner |
| `PUT` | `/:id/status` | ✅ | Outlet/Runner | Update order status |
| `PUT` | `/:id/cancel` | ✅ | Student | Cancel an order |
| `GET` | `/:id` | ✅ | Any | Get order details by ID |
| `GET` | `/my-deliveries` | ✅ | Student | Get my delivery history (as runner) |

### 📦 Packages — `/api/packages`

| Method | Endpoint | Auth | Role | Description |
|:---:|:---|:---:|:---:|:---|
| `POST` | `/` | ✅ | Student | Create a parcel delivery request |
| `GET` | `/my-packages` | ✅ | Student | Get all my packages |
| `GET` | `/available` | ✅ | Student | Get packages available for pickup |
| `PUT` | `/:id/accept` | ✅ | Student | Accept a package delivery |
| `PUT` | `/:id/status` | ✅ | Runner | Update package status (PickedUp/Delivered) |
| `PUT` | `/:id/cancel` | ✅ | Student | Cancel a package (if Pending) |
| `GET` | `/:id` | ✅ | Any | Get package details |
| `GET` | `/my-deliveries` | ✅ | Student | Get all packages I delivered |

---

## 🔒 Authentication Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Browser │          │  Server  │          │ MongoDB  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │  POST /api/auth/register                  │
     │  { name, email, password, role }          │
     │────────────────────►│                     │
     │                     │  Hash password       │
     │                     │  (bcrypt, 10 rounds) │
     │                     │────────────────────►│
     │                     │  Save user           │
     │                     │◄────────────────────│
     │                     │                     │
     │                     │  Sign JWT            │
     │                     │  (id, role, 7 days)  │
     │                     │                     │
     │  Set-Cookie: token  │                     │
     │  (httpOnly, secure) │                     │
     │◄────────────────────│                     │
     │                     │                     │
     │  GET /api/users/me  │                     │
     │  Cookie: token      │                     │
     │────────────────────►│                     │
     │                     │  Verify JWT          │
     │                     │  Find user by ID     │
     │                     │────────────────────►│
     │                     │◄────────────────────│
     │  { user }           │                     │
     │◄────────────────────│                     │
     │                     │                     │
```

### Cookie Configuration

| Attribute | Development | Production |
|:---|:---|:---|
| `httpOnly` | `true` | `true` |
| `secure` | `false` | `true` (HTTPS only) |
| `sameSite` | `lax` | `none` (cross-origin) |
| `maxAge` | 7 days | 7 days |

---

## 📦 Order Lifecycle

### Food Order Status Flow

```
  Customer places order          Outlet accepts              Outlet prepares
         │                            │                            │
         ▼                            ▼                            ▼
    ┌─────────┐    accept()     ┌──────────┐   preparing()   ┌────────────┐
    │ PENDING │───────────────►│ ACCEPTED │────────────────►│ PREPARING  │
    └─────────┘                └──────────┘                  └─────┬──────┘
         │                                                         │
         │ cancel()                                   Runner picks up
         ▼                                                         │
    ┌───────────┐                                                  ▼
    │ CANCELLED │                                        ┌─────────────────┐
    └───────────┘                                        │ OUT FOR DELIVERY│
                                                         └────────┬────────┘
                                                                   │
                                                        Runner delivers
                                                                   │
                                                                   ▼
                                                          ┌───────────┐
                                                          │ DELIVERED │
                                                          └───────────┘
```

### Package Delivery Status Flow

```
    ┌─────────┐   accept()   ┌──────────┐  pickedUp()  ┌──────────┐  delivered()  ┌───────────┐
    │ PENDING │────────────►│ ACCEPTED │──────────────►│ PICKED UP│──────────────►│ DELIVERED │
    └─────────┘              └──────────┘               └──────────┘               └───────────┘
         │
         │ cancel()
         ▼
    ┌───────────┐
    │ CANCELLED │
    └───────────┘
```

---

## 📁 Project Structure

```
Cravora/
│
├── 📂 Client/Cravora-Client/          # Frontend (React + Vite)
│   ├── 📂 src/
│   │   ├── 📂 api/                    # Axios API modules
│   │   │   ├── authApi.js             #   Auth endpoints (register, login, logout)
│   │   │   ├── userApi.js             #   User profile endpoint
│   │   │   ├── dashboardApi.js        #   Dashboard data fetching
│   │   │   ├── outletApi.js           #   Outlet CRUD operations
│   │   │   ├── menuApi.js             #   Menu item management
│   │   │   ├── orderApi.js            #   Order lifecycle management
│   │   │   └── packageApi.js          #   Package delivery operations
│   │   │
│   │   ├── 📂 components/             # Reusable UI components
│   │   │   ├── 📂 Landing/            #   Homepage sections
│   │   │   ├── 📂 Login/              #   Login form component
│   │   │   ├── 📂 Register/           #   Registration form component
│   │   │   ├── 📂 FormInput/          #   Reusable form input wrapper
│   │   │   ├── 📂 Outlet/             #   Outlet management components
│   │   │   ├── Navbar.jsx             #   Global navigation bar
│   │   │   ├── ProtectedRoute.jsx     #   Role-based route guard
│   │   │   ├── OutletCard.jsx         #   Outlet preview card
│   │   │   ├── MenuItemCard.jsx       #   Menu item display card
│   │   │   ├── OrderTracker.jsx       #   Real-time order status tracker
│   │   │   └── ViewCheckoutButton.jsx #   Floating cart button
│   │   │
│   │   ├── 📂 context/                # React Context providers
│   │   │   ├── AuthContext.jsx        #   Auth state (user, loading, session check)
│   │   │   └── CartContext.jsx        #   Cart state (useReducer + localStorage)
│   │   │
│   │   ├── 📂 hooks/                  # Custom React hooks
│   │   │   └── useAuth.js             #   Shortcut to consume AuthContext
│   │   │
│   │   ├── 📂 pages/                  # Route-level page components
│   │   │   ├── Home.jsx               #   Landing page
│   │   │   ├── Login.jsx              #   Login page wrapper
│   │   │   ├── Register.jsx           #   Registration page wrapper
│   │   │   ├── ForgotPassword.jsx     #   OTP-based password reset
│   │   │   ├── Dashboard.jsx          #   Student dashboard (browse outlets)
│   │   │   ├── OutletDetail.jsx       #   Single outlet view with menu
│   │   │   ├── Checkout.jsx           #   Cart review and order placement
│   │   │   ├── RunnerDashboard.jsx    #   Available deliveries + active jobs
│   │   │   ├── OrderParcel.jsx        #   Create parcel delivery request
│   │   │   ├── DeliveryHistory.jsx    #   Past deliveries and earnings
│   │   │   └── 📂 outlet/             #   Outlet owner pages
│   │   │       ├── MyOutlet.jsx       #     Outlet management dashboard
│   │   │       ├── ManageMenu.jsx     #     Add/edit/delete menu items
│   │   │       └── OutletOrders.jsx   #     Incoming order queue
│   │   │
│   │   ├── 📂 utils/                  # Utility functions
│   │   │   └── API_paths.js           #   Centralized API route constants
│   │   │
│   │   ├── App.jsx                    # Route definitions
│   │   ├── App.css                    # Global styles
│   │   ├── index.css                  # CSS reset and variables
│   │   └── main.jsx                   # App entry point with providers
│   │
│   ├── package.json
│   └── vite.config.js
│
├── 📂 Server/                          # Backend (Express + Node.js)
│   ├── 📂 src/
│   │   ├── 📂 Config/                 # Configuration modules
│   │   │   ├── Connection_DB.js       #   MongoDB Atlas connection (with timeout)
│   │   │   ├── Cloudinary.js          #   Cloudinary image service config
│   │   │   └── Transporter.js         #   Nodemailer Gmail SMTP config
│   │   │
│   │   ├── 📂 Controllers/            # Business logic (7 controllers)
│   │   │   ├── authController.js      #   Register, Login, Logout, OTP, Reset
│   │   │   ├── userController.js      #   Get current user
│   │   │   ├── dashboardController.js #   Student + Runner dashboard data
│   │   │   ├── outletController.js    #   Outlet CRUD with image upload
│   │   │   ├── menuController.js      #   Menu item CRUD (embedded in Outlet)
│   │   │   ├── orderController.js     #   Full order lifecycle + stats tracking
│   │   │   └── packageController.js   #   Package delivery lifecycle
│   │   │
│   │   ├── 📂 Middlewares/            # Express middleware
│   │   │   ├── authMiddleware.js      #   JWT verification + req.user injection
│   │   │   ├── roleMiddleware.js      #   Role-based access control
│   │   │   └── imageMiddleware.js     #   Multer + Cloudinary storage engine
│   │   │
│   │   ├── 📂 Models/                 # Mongoose schemas (4 models)
│   │   │   ├── User.js               #   User schema + bcrypt helpers
│   │   │   ├── Outlet.js             #   Outlet schema with embedded menu
│   │   │   ├── Order.js              #   Food order schema
│   │   │   └── Package.js            #   Parcel delivery schema
│   │   │
│   │   ├── 📂 Routes/                 # Express route definitions (7 routers)
│   │   │   ├── authRoutes.js          #   /api/auth/*
│   │   │   ├── userRoutes.js          #   /api/users/*
│   │   │   ├── dashboardRoutes.js     #   /api/dashboard/*
│   │   │   ├── outletRoutes.js        #   /api/outlets/*
│   │   │   ├── menuRoutes.js          #   /api/menu/*
│   │   │   ├── orderRoutes.js         #   /api/orders/*
│   │   │   └── packageRoutes.js       #   /api/packages/*
│   │   │
│   │   ├── 📂 utils/                  # Utility functions
│   │   │   └── sendEmail.js           #   Reusable email sender
│   │   │
│   │   └── server.js                  # Express app entry point
│   │
│   ├── .env                           # Environment variables (gitignored)
│   └── package.json
│
└── README.md                           # ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v22+` → [Download](https://nodejs.org/)
- **MongoDB Atlas** account → [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary** account → [Sign up](https://cloudinary.com/)
- **Gmail App Password** → [Generate](https://myaccount.google.com/apppasswords)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ronit178693/Cravora.git
cd Cravora
```

### 2️⃣ Setup the Backend

```bash
cd Server
npm install
```

Create a `.env` file in the `Server/` directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/cravora_db?retryWrites=true&w=majority
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Important:** Use `NODE_ENV=development` locally and `NODE_ENV=production` on Render. Do **not** add spaces around `=` signs.

Start the development server:

```bash
npm run dev
```

### 3️⃣ Setup the Frontend

```bash
cd ../Client/Cravora-Client
npm install
npm run dev
```

The app will be running at `http://localhost:5173` 🎉

---

## 🔑 Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `PORT` | ✅ | Server port (default: 5000) |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `NODE_ENV` | ✅ | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `EMAIL_USER` | ✅ | Gmail address for sending emails |
| `EMAIL_PASSWORD` | ✅ | Gmail App Password (16-character code) |
| `CLOUDINARY_URL` | ✅ | Full Cloudinary connection URL |
| `API_KEY` | ✅ | Cloudinary API key |
| `API_SECRET` | ✅ | Cloudinary API secret |
| `CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLIENT_URL` | ✅ | Frontend URL (no trailing slash) |

---

## 🌐 Deployment

### Backend → Render

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `Server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables from the table above
5. Set `NODE_ENV=production` and `CLIENT_URL=https://your-frontend.vercel.app`

### Frontend → Vercel

1. Import your repository on [Vercel](https://vercel.com)
2. Configure:
   - **Root Directory:** `Client/Cravora-Client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Deploy — Vercel auto-detects Vite and handles the rest

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=F97316&center=true&vCenter=true&width=435&lines=Built+with+Passion;by+Ronit+Agrawal" alt="Footer" />
</p>

<p align="center">
  <sub>If you found this project useful, consider giving it a ⭐</sub>
</p>
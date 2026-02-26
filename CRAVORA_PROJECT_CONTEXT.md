# Cravora — Full Project Context for UI Design

> **What is Cravora?** A campus food & parcel delivery platform. Students order food from campus outlets and request package pick-ups from the gate. Other students or dedicated runners deliver them.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Lucide icons, react-hot-toast
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT (cookie-based), bcryptjs
- **Theme**: Dark glassmorphism (CSS variables defined in `index.css`)

## User Roles
| Role | Can Do |
|------|--------|
| **Student** | Browse outlets, order food, track orders, request parcel delivery, become a runner |
| **Outlet** | Manage outlet details, manage menu, accept/prepare orders |
| **DeliveryPartner** | Accept deliveries (food + parcels), update delivery status |

---

## Sitemap & Page Breakdown

```
/                        → Landing Page (public)
/login                   → Login (public)
/register                → Register (public)
/forgot-password         → Password Reset (public)

/student-dashboard       → Browse Outlets (Student)
/outlet/:id              → Outlet Menu (any auth)
/checkout                → Cart + Order Tracker (any auth)

/outlet-dashboard        → Manage My Outlets (Outlet owner)
/menu                    → Manage Menu Items (Outlet owner)
/orders                  → View & Process Orders (Outlet owner)

/runner-dashboard        → Accept & Manage Deliveries (Student/DeliveryPartner)
/order-parcel            → Request Parcel Delivery (Student)
```

---

## Page Details

### 1. Landing Page `/`
**Sections (top to bottom):**
1. **Navbar** — Logo, Login/Register buttons
2. **Hero** — Headline, tagline, CTA button, animated visuals
3. **Problem** — 3 pain points Cravora solves (waiting in lines, no delivery, gate parcels)
4. **Features** — Feature cards in a grid (Order Food, Track Live, Parcel Pickup, Earn as Runner)
5. **How It Works** — 3-4 step visual flow
6. **Social Proof** — Testimonials or stats
7. **FAQ** — Expandable accordion
8. **CTA** — Final signup call-to-action banner
9. **Footer** — Links, social, copyright

### 2. Login `/login`
**Layout:** Split screen — branding visuals (left) + login form (right)
**Fields:** Email, Password (toggle visibility)
**Links:** Forgot Password, Register
**Post-login:** Redirects based on role

### 3. Register `/register`
**Layout:** Split screen — form (left) + branding visuals (right)
**Fields:** Name, Email, Phone (10-digit), Password, Role selector (Student/Outlet/DeliveryPartner)

### 4. Forgot Password `/forgot-password`
**Layout:** Centered card, 2-step flow
- **Step 1:** Enter email → sends OTP
- **Step 2:** Enter OTP + new password → resets

### 5. Student Dashboard `/student-dashboard`
**Layout:** Navbar + outlet card grid
**Elements:**
- Global Navbar (search, profile, more dropdown)
- Page title: "Explore Outlets"
- Grid of OutletCards (image, name, location, open/closed badge)
- Floating "View Cart" button (shows item count + total)

### 6. Outlet Detail `/outlet/:id`
**Layout:** Navbar + outlet header + category-tabbed menu
**Elements:**
- Outlet header (image, name, location, working hours, open status)
- Sticky horizontal category tabs (Snacks, Main Course, Beverages, Dessert, Other)
- Menu items grouped by category — each card has: image, name, price, description, ADD button
- Floating "View Cart" button

### 7. Checkout `/checkout`
**Layout:** Navbar + cart items + order summary + tracker
**Elements:**
- Cart items list (image, name, description, qty +/-, price)
- Delivery location input
- Price summary (subtotal, delivery fee, total)
- "Place Order" button
- **Order Tracker** (appears after placing) — live status timeline that polls every 5 seconds:
  `Pending → Accepted → Preparing → OutForDelivery → Delivered`

### 8. Outlet Dashboard `/outlet-dashboard`
**Layout:** Sidebar + main content
**Sidebar links:** My Outlet, Menu, Orders
**Elements:**
- Outlet details with inline editable fields (name, location, contact, hours, description, isOpen toggle)
- Add New Outlet button → modal form
- List of owner's outlets (if multiple)

### 9. Manage Menu `/menu`
**Layout:** Sidebar + main content
**Elements:**
- Outlet selector dropdown (if multiple outlets)
- Menu items table/list (name, price, category, availability toggle)
- Edit/Delete actions per item
- Add Menu Item button → modal (name, description, price, category dropdown, image URL, availability)

### 10. Outlet Orders `/orders`
**Layout:** Sidebar + main content
**Elements:**
- Filter tabs: All, Pending, Accepted, Preparing, OutForDelivery, Delivered, Cancelled
- Order cards showing: order ID, customer name/phone, items list, total, status badge, timestamps
- Action buttons per status: Accept (Pending), Mark Preparing (Accepted), etc.

### 11. Runner Dashboard `/runner-dashboard`
**Layout:** Navbar + stats bar + 3 tabs
**Stats bar:** Total Completed, Available Now, Active Count
**Tabs:**
- **Available Requests** — Food orders (outlet → customer location, items, fee) + Packages (pickup → drop, type, fee). Each with "Accept Delivery" button
- **My Active Deliveries** — Accepted orders/packages with status update buttons (e.g., "Mark Picked Up", "Mark Delivered")
- **History** — Completed deliveries with date, earnings

### 12. Order Parcel `/order-parcel`
**Layout:** Navbar + 2-column (form left, list right)
**Left — Create Request Form:**
- Package type selector: 📦 Courier, 🛒 Blinket, 🍔 Food
- Pickup location, Drop location
- Description, Quantity
- Delivery fee (tip for runner)
- Special instructions (textarea)
- Submit button

**Right — My Packages:**
- Expandable cards showing: type badge, status badge, route (pickup → drop)
- Expanded view: status timeline with animated dots (`Pending → Accepted → PickedUp → Delivered`), description, instructions, runner info (name, phone), created date, cancel button (if Pending)

---

## Shared Navbar (used on all authenticated pages)

| Element | Description |
|---------|-------------|
| Logo | Links to `/` |
| Search bar | Live search across outlet names + menu item names, dropdown results |
| Dashboard link | → `/student-dashboard` |
| "More" dropdown | Runner Dashboard, Order Parcel links |
| Profile avatar | Opens slide-out profile panel |

**Profile Panel contents:**
- User info (name, email, role badge)
- Stats row (deliveries completed, orders placed, deliveries done)
- Recent Order History list (order items, status badge, date)
- Recent Delivery History list (package deliveries)
- Logout button

---

## Data Models

### User
```
name, email, phoneNumber, password, role (Student/Outlet/DeliveryPartner)
deliveryStats: { deliveriesCompleted }
orderHistory: [{ order, orderedAt }]
lastDeliveryAt, otp, otpExpires
```

### Outlet
```
owner (User ref), name, description, location, contactNumber
images[], WorkingHours: { open, close }, isOpen
menu: [{ name, description, price, category, image, isAvailable }]
orderCount, orders: [{ order, orderedAt }]
```
**Menu Categories:** Snacks, Main Course, Beverages, Dessert, Other

### Order
```
customer, runner (both User refs), outlet (Outlet ref)
items: [{ menuItemId, name, quantity, price }]
pickupLocation, dropLocation
status: Pending → Accepted → Preparing → OutForDelivery → Delivered | Cancelled
totalAmount, deliveryFee, deliveredAt
```

### Package
```
customer, runner (both User refs)
type: Courier | Blinket | Food
description, quantity, pickupLocation, dropLocation
status: Pending → Accepted → PickedUp → Delivered | Cancelled
deliveryFee, instructions, deliveredAt
```

---

## Current Design Theme
- **Background:** Deep dark (`#0a0a0f`)
- **Cards:** Glassmorphism (`rgba(26,26,46,0.65)` + `backdrop-filter: blur`)
- **Accent:** Orange gradient (`#ff6b35` → `#ff8c42`)
- **Text:** White primary, gray secondary
- **Borders:** Subtle white/orange rgba borders
- **Animations:** Fade-up on scroll, hover transforms, pulse on active status dots
- **Fonts:** Inter (body), Outfit (display/headings)

## Pages NOT Yet Built (empty files)
- `Profile.jsx` — Dedicated profile/settings page
- `MyOrders.jsx` — Full order history page
- `MyPackages.jsx` — Full package tracking page
- `OrderCard.jsx` — Reusable order card component
- `PackageCard.jsx` — Reusable package card component
- `Footer.jsx` — Global footer for inner pages

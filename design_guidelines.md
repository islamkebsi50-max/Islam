# Design Guidelines - Islem Grocery Store

## Design Approach
**Reference-Based:** Drawing inspiration from modern e-commerce platforms like Shopify, Instacart, and contemporary grocery delivery apps, focusing on clean product presentation and efficient admin workflows.

## Core Design Principles
- **Arabic-First Design:** RTL layout with Arabic typography prioritized
- **Product-Focused:** Clear product imagery and information hierarchy
- **Seamless Admin:** Hidden but powerful management interface
- **Trust & Professionalism:** Clean, modern aesthetic that builds customer confidence

## Typography System

**Arabic Font:** Cairo or Tajawal from Google Fonts
- Hero/Headers: Bold 700, 2.5rem to 4rem
- Product Titles: SemiBold 600, 1.25rem to 1.5rem
- Body Text: Regular 400, 1rem
- Prices: Bold 700, 1.5rem (prominent display)
- Labels/Meta: Medium 500, 0.875rem

**Hierarchy:** Large product names, prominent pricing, subtle metadata

## Layout & Spacing System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Container padding: px-4 md:px-8 lg:px-16
- Section spacing: py-12 md:py-20
- Card spacing: p-4 md:p-6
- Element gaps: gap-4 to gap-8

**Grid System:**
- Product grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Admin dashboard: Two-column layout (sidebar + main content)
- Max container width: max-w-7xl

## Component Library

### Storefront Components

**Navigation Bar:**
- Logo (right side, clickable 5x for admin)
- Categories navigation
- Search bar (prominent, centered)
- Cart icon with badge counter
- Sticky on scroll

**Hero Section:**
- Full-width banner (h-[400px] md:h-[500px])
- Large heading with store name
- Subtle gradient overlay
- Single CTA button (blurred background, backdrop-blur-md)
- Brief tagline about fresh groceries

**Product Cards:**
- Square image container (aspect-square)
- Product name (2 lines max, overflow ellipsis)
- Price (large, bold)
- Weight/quantity indicator
- "Add to Cart" button
- Hover: Subtle scale (scale-105), shadow elevation
- Out of stock: Opacity overlay with badge

**Category Filters:**
- Horizontal scrollable pills
- Active state: filled background
- Icons optional for major categories

**Shopping Cart (Slide-over Panel):**
- Fixed right sidebar
- Product list with thumbnails
- Quantity adjusters (+/-)
- Running total
- Checkout button (sticky bottom)
- Empty state illustration

### Admin Panel Components

**Login Modal:**
- Centered card (max-w-md)
- Firebase Google Auth button
- Clean, minimal form
- Backdrop blur overlay

**Admin Dashboard Layout:**
- Sidebar navigation (w-64):
  - Dashboard
  - Products
  - Orders
  - Settings
- Main content area (flex-1)
- Top bar with logout and admin name

**Product Management:**
- Data table with actions
- Add/Edit product modal:
  - ImgBB upload with preview
  - Form fields: name, price, category, stock, description
  - Image crop/preview before upload
- Bulk actions toolbar

**Order Management:**
- Order cards with status badges
- Customer details
- Product list with quantities
- Accept/Reject actions
- Status timeline (Pending → Processing → Completed)

## Animations

**Page Transitions:**
- Fade-in on load (opacity 0 to 1, duration-300)
- Stagger product cards (delay-[50ms] increments)

**Interactive Elements:**
- Add to Cart: Scale pulse + success checkmark animation
- Logo clicks: Subtle shake on 5th click before modal
- Cart badge: Pop animation on count change
- Product hover: Smooth scale transform

**Admin Panel:**
- Slide-in from right (translate-x-full to 0)
- Modal fade + scale entrance
- Toast notifications for actions

## Images

**Hero Image:**
- Full-width grocery store ambiance or fresh produce spread
- Bright, appetizing photography
- Overlay for text readability

**Product Images:**
- Consistent square format
- White/neutral backgrounds
- High-quality food photography
- Placeholder for missing images

**Empty States:**
- Shopping cart: Simple illustration
- No products: Friendly graphic
- No orders: Dashboard illustration

## Responsive Behavior

**Mobile (base):**
- Single column products (grid-cols-2)
- Hamburger menu
- Bottom cart button
- Simplified admin tables

**Tablet (md:):**
- 3-column product grid
- Expanded navigation
- Side cart panel

**Desktop (lg:):**
- 4-column product grid
- Full admin sidebar visible
- Hover states active

## Key User Flows

1. **Customer Journey:** Browse → Filter → Add to Cart → Checkout → Order Submitted
2. **Admin Access:** 5 Logo Clicks → Google Auth → Dashboard → Manage Products/Orders
3. **Product Addition:** Upload to ImgBB → Form Fill → Save to Firestore → Display in Store

## Accessibility & RTL

- Full RTL support with `dir="rtl"`
- Keyboard navigation for all interactions
- Focus visible states
- Arabic language throughout
- Touch-friendly tap targets (min 44x44px)
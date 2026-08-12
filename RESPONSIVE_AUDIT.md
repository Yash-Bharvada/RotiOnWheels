# Mobile Responsiveness Audit & Checklist

This audit tracks mobile responsiveness retrofitting across all routes, sections, and reusable components of **RotiOnWheels** at 4 target breakpoints: **375px** (mobile), **768px** (tablet), **1024px** (laptop), and **1440px** (desktop).

## Target Breakpoints
- [x] **375px** (Small Phone - iOS / Android)
- [x] **768px** (Tablet Portrait)
- [x] **1024px** (Tablet Landscape / Small Laptop)
- [x] **1440px** (Desktop)

---

## Inventory & Status Checklist

### Navigation & Page Layout Shell
- [x] **Header & Mobile Drawer Menu** (`App.tsx`): Brand logo scaling, mobile drawer animation, user menu avatar dropdown position, link click auto-dismiss, button text collapse on small screens.
- [x] **Footer Component** (`App.tsx`): 4-column responsive grid collapse, copyright text stack on small screens.

### Home Page Sections (`/`)
- [x] **Hero Section & 3D Canvas** (`App.tsx` & `ThreeHeroCanvas.tsx`): Responsive typography scaling (`text-4xl sm:text-6xl lg:text-7xl`), CTA buttons flex stack, background canvas touch scroll non-interference (`pointer-events-none`).
- [x] **Live Impact Bar / Rolling Counter** (`App.tsx`): Grid column stacking (`sm:grid-cols-3`), border divider logic on mobile (`border-t border-white/20 pt-5`).
- [x] **Live Van GPS Tracking Widget** (`App.tsx`): Leaflet map height (`h-[350px] sm:h-[440px]`), mobile badge overlay positioning, info card stacking (`grid-cols-1 lg:grid-cols-[1fr_360px]`).
- [x] **Impact Calculator** (`ImpactCalculator.tsx`): Touch slider range, preset pill wrap, 3-card stat grid layout on 375px mobile screens.
- [x] **About & Central Kitchen Section** (`App.tsx`): Responsive floating card overlay positioning (`right-3 -bottom-4 sm:-bottom-6 sm:-right-6`), image aspect ratio.
- [x] **Interactive Seva Game** (`RotiGame.tsx`): HTML5 Canvas responsive canvas sizing (`h-[280px] sm:h-[360px]`), mobile touch controls (`BRAKE` / `GAS` touch buttons sized for 375px screens), game-over screen scaling.
- [x] **Social Banner Generator Studio** (`BannerGenerator.tsx`): Control panel & live banner preview card scaling (`aspect-[1200/630] min-h-[220px]`), mobile font sizes and padding (`p-4 sm:p-10`).
- [x] **FAQs & Accordion** (`App.tsx`): Card padding and touch tap targets.

### Pages & Routes
- [x] **Donation Page & Form** (`/donate` in `App.tsx`): Form & tier card layout (`lg:grid-cols-[1.25fr_.75fr]`), input padding (`p-4 sm:p-6`), title font scaling.
- [x] **Authentication Page** (`/login` & `/signup` in `pages/Auth.tsx`): Header brand & back link padding, card container max-w, tab switcher padding on 375px screens.
- [x] **Password Reset & Callback Pages** (`ResetPassword.tsx`, `AuthCallback.tsx`): Centered card responsiveness.

### Modals & Overlays
- [x] **Impact Deck Presentation Modal** (`ImpactDeckModal.tsx`): `max-h-[calc(90vh-100px)]` scrolling, mobile slide layout, slide control pagination buttons and prev/next gaps on small screens.
- [x] **UPI / QR Payment Modal** (`UpiPaymentModal.tsx`): Payment method tab bar text scaling on 375px (`Banking` tab text), QR code container size.
- [x] **80G Tax Exemption Receipt Modal** (`ReceiptModal.tsx`): Receipt card header flex-col stacking (`flex-col gap-4 sm:flex-row`), print layout horizontal scroll prevention, modal action button stacking.

---

## Verification Summary
- **Build Status**: Verified via `npm run build` with 0 errors.
- **Viewport Support**: Full support for 375px, 768px, 1024px, and 1440px viewports without horizontal scrollbar (`overflow-x`) or text clipping.

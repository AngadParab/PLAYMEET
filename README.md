# PLAYMEET

PLAYMEET is a full-stack, dual-ecosystem matchmaking and event management platform built using the MERN stack. Designed to bridge the gap between traditional athletic activities and digital competitive gaming, the platform manages complex user relationships, global points economies, and real-time connectivity between players.

## Core Architecture & Features

Based on the underlying database schemas and application structure, PLAYMEET is split into several major functional domains:

### 🌐 Dual-Ecosystem Profiles
Users are not limited to one domain. The platform supports dedicated profiles for different playstyles:
- **Athletes:** For traditional physical sports players managing local games.
- **Esports (The Nexus):** A dedicated ecosystem (`EsportsProfile.js`) capturing Gamertags, specific competitive titles (e.g., *Valorant*, *CS2*, *League of Legends*), regional locking, game ranks, and KD ratios.

### 💰 Unified Global Economy & Store
A platform-wide gamification system rewards users for engagement (creating events, winning tournaments, etc.).
- **Point Transactions:** Managed heavily via the `PointTransaction.js` model, logging all point inflows and outflows.
- **Nexus Market:** Uses the `Reward.js` and `Redemption.js` models to handle a real-world storefront where users can exchange platform points for gift cards, merchandise, or digital items. Admin fulfillment pages securely process these ledgers.

### �️ Physical Operations: Events & Venues
- **Event Matchmaking:** The `eventModel.js` handles physical gathering logic including sport types, geographic locations, hard participant limits, required skill levels, and date scheduling.
- **Venue Directory & Booking:** Driven by `venueModel.js`, allowing administrators to list real-world facilities complete with hourly logic, pricing variants, available amenities, and booking integrations.

### 🎮 Digital Operations: Esports Tournaments
- Dedicated tournament structures (`Tournament.js`) handling digital bracket generation, entry fees (costing platform points), lobby sizing, and automated prize pool distribution to winners. 

### 💬 Social & Community
- **Persistent Communities:** `communityModel.js` enables users to establish ongoing groups, featuring member roles, posts, and community-wide announcements.
- **Real-Time WebSockets:** `Socket.io` drives real-time event chats, active presence indicators, notifications (`notificationModel.js`), and instant matchmaking updates.
- **Global Leaderboards:** Competitive tracking powered by `leaderboardModel.js` calculating dynamic ranks and percentiles based on user points and match win rates.

---

## Technical Infrastructure

The platform leverages a modern, highly-scalable open-source stack to handle concurrency and rich UI demands.

### Frontend Application (Client)
- **Framework:** React 18 powered by Vite.
- **Routing:** React Router DOM v6.
- **Styling UI:** Tailwind CSS combined with Radix UI headless components for accessible, dynamic dark/light mode switching.
- **Animations:** Framer Motion for layout transitions and scroll effects.
- **State & Data Handling:** React Hook Form accompanied by Zod for strict client-schema validations.
- **Visualizations:** Recharts for admin analytic dashboards.
- **Real-time Engine:** Socket.io-client.

### Backend Services (Server)
- **Core Engine:** Node.js with Express 5 framework.
- **Database Architecture:** MongoDB via Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT) secured via HTTP-only cookies and bcryptjs payload hashing.
- **Security & Rate Limiting:** Upstash Redis handling distributed rate-limits (Global, Auth circuits, and API thresholding).
- **Media Delivery:** Cloudinary integration connected through Multer for fast asset uploads (user avatars, event banners, venue layouts).
- **Notifications Engine:** Nodemailer for automated transactional emails.
- **Document Generation:** PDFKit implemented for generating downloadable admin reports.
- **Schema Validation:** Zod ensuring type-safety on API payload ingestions.

---

## Application Scripts
From the root directories, you can spin up the platform using:

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

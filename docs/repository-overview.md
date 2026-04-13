## Key Components Overview

### 🔐 Authentication

- **Supabase Auth**: Handles user authentication and session management
- **Auth Middleware**: Protects routes and manages user sessions
- **Auth Pages**: Sign-in, sign-up, forgot-password, reset-password

### 🪙 Credits System

- **Credit Balance**: Uses `subscription_credits + bonus_credits`
- **Credit Deduction**: Server-side deduction + refund flow for analysis
- **Credits API**: Manages credit transactions and balance updates
- **Usage Ledger**: `llm_usage_events` tracks model, tokens, and estimated cost

### 💳 Payments (Stripe)

- **Checkout Sessions**: Handles payment processing
- **Webhooks**: Processes payment confirmations
- **Success Flow**: Confirms successful purchases and credit additions

### 🔌 API Layer

- **User/Credits API**: Manages user data and credit operations
- **Payment APIs**: Handles Stripe integration
- **Webhook Handlers**: Processes external service callbacks
- **Analysis API**: Calls OpenAI directly with quota/rate limiting

### 🌐 Product Platform

- **SEO**: Metadata, robots, sitemap, canonical/OpenGraph baseline
- **PWA**: Web manifest + service worker registration
- **Security**: Middleware auth gating, checkout/user ID hardening, security headers

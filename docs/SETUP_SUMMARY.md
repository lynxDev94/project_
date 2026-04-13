# 🚀 Quick Setup Summary

This is the short setup checklist. For full detail, use `SUPABASE_SETUP.md` and `DEPLOYMENT_RUNBOOK.md`.

## 📋 What You'll Set Up

1. **Supabase Database** - users, entries, mood, usage ledger
2. **Row Level Security** - Secure data access policies
3. **Environment Variables** - Configuration for web app
4. **Stripe Integration** - Payment processing and webhook handling

## ⚡ Quick Start (5 minutes)

### 1. Database Setup
```bash
# 1. Create a new Supabase project
# 2. Run your base schema (users, entries, mood, stripe event table)
# 3. Run supabase-llm-usage-migration.sql
```

### 2. Environment Setup
```bash
cp apps/web/.env.example apps/web/.env.local
# Then set all required values in .env.local
```

### 3. Get Your Credentials

**Supabase** (Settings > API):
- Project URL
- Anon key (public)
- Service role key (secret)

**Stripe** (Developers > API keys):
- Secret key
- Publishable key
- Webhook secret

**OpenAI**:
- API key

## 🗃️ Database Schema

The setup expects a `users` table with:

```sql
users (
  id UUID → auth.users(id)
  email TEXT
  stripe_customer_id TEXT
  subscription_status TEXT
  subscription_credits INTEGER
  bonus_credits INTEGER
  -- ... more fields
)
```

## 🔐 Security Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Service Role Access** - Webhooks can update all user data
- **Automatic Profile Creation** - New auth users get a profile automatically

## 🎯 Why Separate .env Files?

This repo currently deploys from `apps/web/.env.local`.

**Benefits:**
- ✅ Better security (apps only get variables they need)
- ✅ Clear separation of concerns
- ✅ Follows principle of least privilege

## 🧪 Testing Your Setup

1. **Database**: Run test query in Supabase SQL Editor
2. **Auth**: Sign up a test user and check if profile is created
3. **Stripe**: Create test subscription and verify webhook updates credits

## 📚 Full Documentation

- `SUPABASE_SETUP.md` - Complete step-by-step guide
- `supabase-llm-usage-migration.sql` - Usage ledger migration
- `DEPLOYMENT_RUNBOOK.md` - Production deploy and rollback checklist

## 🆘 Need Help?

Check the troubleshooting section in `SUPABASE_SETUP.md` or:
- Supabase logs in your dashboard
- Environment variable configuration
- Webhook endpoint setup 
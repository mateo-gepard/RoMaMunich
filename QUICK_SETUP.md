# Quick Setup Guide

## Required Setup (5 minutes)

### 1. Environment Variables
You need to add **ONE** new variable to your `.env.local` file:

```bash
# Add this line to your .env.local
RESEND_API_KEY=re_your_key_here
```

**Get your Resend API key:**
1. Go to https://resend.com/api-keys
2. Create a free account (if needed)
3. Click "Create API Key"
4. Copy the key and paste it in `.env.local`

**Free tier includes:**
- 100 emails/day
- 3,000 emails/month
- Perfect for testing and early production

---

## What Works Out of the Box ✅

### Immediately Available (No Setup Required):
- ✅ Dashboard session management
- ✅ Session filtering by time
- ✅ Cancel sessions (UI works, just needs email setup)
- ✅ Send messages (UI works, stored in Firestore)
- ✅ Feedback system
- ✅ Settings page
- ✅ Messages page with conversations
- ✅ All UI components and interactions

### After Adding RESEND_API_KEY:
- ✅ Cancellation emails to tutors
- ✅ Confirmation emails to students
- ✅ Message notifications via email
- ✅ Reply-to email system

---

## Optional: Email Reply System Setup (10 minutes)

**Only needed if you want tutors to reply via email**

### Configure Resend Inbound Route:

1. **Add your domain** (or use Resend's test domain for now):
   - Go to https://resend.com/domains
   - Add `roma-munich.de` (or use test domain)

2. **Setup inbound route**:
   - Go to Settings → Inbound Routes
   - Pattern: `messages+*@roma-munich.de`
   - Destination: `https://your-vercel-url.com/api/messages/webhook`
   - Method: POST

**Without this**: Messages still work in dashboard, just no email replies

---

## Testing

### Test Without Any Setup:
```bash
npm run dev
```
- Login to dashboard
- All features work except email sending
- Console will show API errors (safe to ignore during development)

### Test With RESEND_API_KEY:
```bash
npm run dev
```
- Cancel a session → Emails sent ✅
- Send a message → Email sent ✅
- Check spam folder if not received

---

## What Happens Without Setup

| Feature | Without RESEND_API_KEY | With RESEND_API_KEY |
|---------|----------------------|-------------------|
| View sessions | ✅ Works | ✅ Works |
| Cancel session | ✅ Works (UI) | ✅ Works + Email sent |
| Send message | ✅ Works (saved in DB) | ✅ Works + Email sent |
| Give feedback | ✅ Works | ✅ Works |
| Dashboard | ✅ Works | ✅ Works |
| Settings | ✅ Works | ✅ Works |

**Bottom line**: Everything works in the UI, you just won't get emails without the API key.

---

## Production Deployment Checklist

When deploying to Vercel/Railway:

1. ✅ Add `RESEND_API_KEY` to environment variables
2. ✅ Update `NEXT_PUBLIC_APP_URL` in production
3. ✅ Configure inbound route with production URL
4. ✅ Add actual tutor email lookup (currently mock)
5. ✅ Test email delivery
6. ✅ Configure domain DNS records in Resend

---

## Common Issues

### "Module not found: resend"
```bash
npm install
```

### Emails not sending
- Check `RESEND_API_KEY` is set correctly
- Check Resend dashboard for delivery logs
- Verify API key permissions

### Reply emails not working
- Check inbound route is configured
- Verify webhook URL is accessible
- Check Firestore rules allow writes

---

## Summary

**To get started RIGHT NOW:**
1. Copy `.env.example` to `.env.local`
2. Add `RESEND_API_KEY=re_...` (get from resend.com)
3. Run `npm run dev`
4. Everything works! 🎉

**Total time: 5 minutes**

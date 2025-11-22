# RoMa Munich - Messaging System Setup

## Overview
The messaging system uses a reply-to email system where all tutors reply to the same email address (`messages+{conversationId}@roma-munich.de`), and the system automatically routes messages to the correct conversation.

## How It Works

### 1. **Conversation Threading**
- Each conversation gets a unique ID based on user and tutor: `userId-tutorId`
- All messages in a conversation share this ID
- Email replies use: `messages+{conversationId}@roma-munich.de`

### 2. **Message Flow**

**Student → Tutor:**
1. Student sends message via dashboard
2. System stores in Firestore with `conversationId`
3. Email sent to tutor with `replyTo: messages+{conversationId}@roma-munich.de`
4. Tutor receives email

**Tutor → Student (Reply):**
1. Tutor replies to email
2. Reply goes to `messages+{conversationId}@roma-munich.de`
3. Resend webhook forwards to `/api/messages/webhook`
4. System extracts `conversationId` from email address
5. Message stored in Firestore with same `conversationId`
6. Student receives email notification
7. Message appears in dashboard

### 3. **Email Address Format**
- Base address: `messages@roma-munich.de`
- With conversation: `messages+{conversationId}@roma-munich.de`
- Example: `messages+user123-tutor456@roma-munich.de`

## Setup Instructions

### 1. **Resend Configuration**

#### Add Domain
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add your domain: `roma-munich.de`
3. Add DNS records as provided

#### Setup Inbound Route
1. Go to **Settings** → **Inbound Routes**
2. Click **Add Route**
3. Configure:
   - **Pattern:** `messages+*@roma-munich.de`
   - **Destination:** `https://your-domain.com/api/messages/webhook`
   - **Method:** POST

### 2. **Environment Variables**

Add to `.env.local`:
```bash
RESEND_API_KEY=re_...your_key_here...
```

### 3. **Firestore Collections**

The system uses these collections:

#### `messages`
```typescript
{
  conversationId: string,      // "userId-tutorId"
  senderId: string,            // User or tutor ID
  senderName: string,          // Display name
  recipientId: string,         // Recipient ID
  recipientName: string,       // Recipient display name
  subject: string,             // Message subject
  content: string,             // Message content
  sessionId?: string,          // Optional session reference
  isRead: boolean,             // Read status
  createdAt: string,           // ISO timestamp
  source?: string,             // "dashboard" or "email_reply"
}
```

### 4. **Testing**

#### Test Student → Tutor
1. Login as student
2. Go to Dashboard → Sessions
3. Click "Nachricht senden" on a session
4. Send a test message
5. Check tutor email (you'll need to configure actual tutor emails)

#### Test Tutor → Student (Reply)
1. Reply to the email received as tutor
2. System should:
   - Receive webhook at `/api/messages/webhook`
   - Extract conversation ID
   - Store reply in Firestore
   - Forward to student

### 5. **Production Checklist**

- [ ] Configure actual tutor email lookup from database
- [ ] Add webhook signature verification for security
- [ ] Setup email retry logic
- [ ] Add rate limiting to prevent abuse
- [ ] Configure email templates in Resend dashboard
- [ ] Setup monitoring for failed webhooks
- [ ] Add notification preferences per user
- [ ] Implement read receipts
- [ ] Add message search functionality
- [ ] Setup archiving for old conversations

## Features Implemented

### ✅ Dashboard Features
- View all sessions (upcoming and past)
- Session filtering by datetime (sessions past end time go to "Vergangene Sessions")
- Send messages to tutors
- Cancel sessions with required reason
- Give feedback with star ratings
- Quick stats overview

### ✅ Cancellation System
- Required cancellation reason
- Email notification to tutor with reason
- Email confirmation to student
- 24-hour cancellation policy notice

### ✅ Messaging System
- Real-time conversation threading
- Email notifications with reply-to
- Webhook handler for incoming replies
- Conversation history in dashboard
- Search conversations

### ✅ Booking Protection
- Check for existing trial sessions
- Prevent duplicate trial bookings
- Show informative message when trial unavailable
- Auto-select paid package for returning users

## API Endpoints

### `POST /api/bookings/cancel`
Cancel a session with reason
```typescript
Body: {
  sessionId: string,
  reason: string,
  session: Session
}
```

### `POST /api/messages/send`
Send a message to tutor
```typescript
Body: {
  tutorId: string,
  tutorName: string,
  subject: string,
  message: string,
  sessionId?: string
}
```

### `GET /api/messages/send?conversationId={id}`
Get conversation history
```typescript
Response: Message[]
```

### `POST /api/messages/webhook`
Webhook for incoming email replies (called by Resend)
```typescript
Body: Resend webhook payload
```

## Security Considerations

1. **Webhook Verification**: Add signature verification to prevent spoofing
2. **Rate Limiting**: Prevent message spam
3. **Content Filtering**: Sanitize message content
4. **Email Validation**: Verify sender addresses
5. **Conversation Access**: Ensure users can only access their conversations

## Future Enhancements

- [ ] Real-time messaging with WebSockets
- [ ] File attachments
- [ ] Voice messages
- [ ] Video call integration
- [ ] Smart reply suggestions
- [ ] Message templates
- [ ] Bulk actions
- [ ] Message scheduling

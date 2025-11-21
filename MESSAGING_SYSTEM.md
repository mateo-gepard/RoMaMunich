# 💬 Messaging System - Firestore Implementation

## Overview
Your messaging system is **fully integrated** into the Dashboard - no popup widgets, complete UI control, and 100% free using Firestore.

---

## ✅ What's Already Working

### 1. **Messages Tab in Dashboard**
- Full conversation view
- Chat interface with sender/recipient differentiation
- Read receipts (checkmarks)
- Timestamps
- Real-time polling (updates every 3 seconds)

### 2. **Message Storage**
- All messages stored in **Firestore** (Firebase)
- ConversationId-based threading
- Proper sender/recipient tracking
- isRead status
- CreatedAt timestamps

### 3. **Email Notifications**
- When parent sends message → Email to admin (romamuenchen@gmail.com)
- Tutor can reply via email (with automation setup)

### 4. **UI Features**
- ✅ Auto-scroll to latest message
- ✅ Unread badge on sidebar (red dot with count)
- ✅ Message polling (updates every 3 seconds)
- ✅ Responsive design
- ✅ Teal/Navy color scheme

---

## 🚀 Recent Improvements

### 1. Auto-scroll to Bottom
New messages automatically scroll into view.

### 2. Real-time Polling
Messages refresh every 3 seconds when viewing a conversation.

### 3. Unread Message Badge
Shows total unread count in Dashboard sidebar (red badge).

### 4. Message Polling in Background
Unread count updates every 10 seconds automatically.

---

## 📊 Data Structure

### Firestore Collection: `messages`

```javascript
{
  id: "msg_abc123",
  conversationId: "user@email.com-tutor123", // Sorted IDs
  senderId: "user@email.com",
  senderName: "Parent Name",
  recipientId: "tutor123",
  recipientName: "Tutor Name",
  subject: "Subject line",
  content: "Message text...",
  sessionId: "session_456", // Optional
  isRead: false,
  createdAt: "2025-11-21T10:30:00Z",
  source: "dashboard", // or "email" if from email reply
}
```

### ConversationId Format
```javascript
// Always sorted alphabetically for consistency
const conversationId = [userId, tutorId].sort().join('-')
// Example: "parent@gmail.com-tutor123"
```

---

## 🔄 Message Flow

### Parent → Tutor:
1. Parent types message in Dashboard
2. POST `/api/messages/send`
3. Saved to Firestore
4. Email sent to admin (romamuenchen@gmail.com)
5. Tutor sees message (if they have Dashboard access) or via email

### Tutor → Parent:
**Option 1: Direct Reply (not stored)**
- Tutor clicks reply on email → goes to parent directly

**Option 2: Via Dashboard (stored)**
- Tutor logs into Dashboard → Messages tab → Replies

**Option 3: Email Automation (stored)**
- Set up Zapier/Make.com to parse email replies
- Calls `/api/messages/receive` webhook
- Automatically stored in Firestore

---

## 🎨 UI Components

### Messages Page
**Location:** `src/app/dashboard/messages/page.tsx`

**Features:**
- Two-column layout (conversations | chat)
- Conversation list with unread badges
- Message bubbles (teal for sent, gray for received)
- Send input with Enter key support
- Loading states
- Empty states

### Dashboard Integration
**Location:** `src/app/dashboard/page.tsx`

**Features:**
- Unread badge on "Nachrichten" link
- Auto-updates every 10 seconds
- Red notification badge

---

## 🔧 API Endpoints

### 1. GET `/api/messages`
**Get all conversations:**
```typescript
GET /api/messages
Response: {
  conversations: [
    {
      conversationId: "user-tutor",
      tutorId: "tutor123",
      tutorName: "Tutor Name",
      lastMessage: {
        content: "...",
        createdAt: "...",
        isFromMe: true
      },
      unreadCount: 2
    }
  ]
}
```

**Get messages in conversation:**
```typescript
GET /api/messages?conversationId=user-tutor
Response: {
  messages: [...]
}
```

### 2. PATCH `/api/messages`
**Mark conversation as read:**
```typescript
PATCH /api/messages
Body: { conversationId: "user-tutor" }
```

### 3. POST `/api/messages/send`
**Send new message:**
```typescript
POST /api/messages/send
Body: {
  tutorId: "tutor123",
  tutorName: "Tutor Name",
  subject: "Subject",
  message: "Message content",
  sessionId: "session_456" // optional
}
```

### 4. POST `/api/messages/receive`
**Webhook for email replies (Zapier/Make):**
```typescript
POST /api/messages/receive
Body: {
  conversationId: "user-tutor",
  from: "tutor@email.com",
  fromName: "Tutor Name",
  body: "Reply message",
  messageId: "email-msg-id"
}
```

---

## 🔮 Future Enhancements (Optional)

### 1. **True Real-time with Firestore Listeners**
Replace polling with real-time Firestore listeners.

**Benefits:**
- Instant updates (no 3-second delay)
- Lower server load
- Better UX

**Implementation:**
```typescript
import { db } from '@/lib/firebase' // Client-side Firebase
import { collection, query, where, onSnapshot } from 'firebase/firestore'

// In MessagesPage component
useEffect(() => {
  if (!selectedConversation) return

  const q = query(
    collection(db, 'messages'),
    where('conversationId', '==', selectedConversation)
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const newMessages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setMessages(newMessages)
  })

  return () => unsubscribe()
}, [selectedConversation])
```

### 2. **Typing Indicators**
Show "Tutor is typing..." indicator.

### 3. **File Attachments**
Upload images, PDFs via Firebase Storage.

### 4. **Push Notifications**
Firebase Cloud Messaging for instant alerts.

### 5. **Message Search**
Search across all conversations.

### 6. **Message Reactions**
Emoji reactions to messages.

---

## 🔒 Security

### Current:
- ✅ NextAuth session validation
- ✅ User can only see their own conversations
- ✅ Messages filtered by senderId/recipientId

### Recommended (Production):
- Firestore Security Rules
- Rate limiting on API routes
- Message content sanitization
- XSS protection (already handled by React)

---

## 💰 Cost

### Firestore Free Tier:
- **Reads:** 50,000/day
- **Writes:** 20,000/day
- **Deletes:** 20,000/day
- **Storage:** 1 GB

### Current Usage Estimate:
- ~10 messages/day per user
- ~100 users
- = ~1,000 reads/day + ~1,000 writes/day
- **Well within free tier** ✅

---

## 📝 To-Do (If Needed)

### Immediate:
- [ ] None - system works!

### When Scaling:
- [ ] Add Firestore real-time listeners
- [ ] Set up email automation (Zapier/Make)
- [ ] Add Firestore security rules
- [ ] Implement file attachments

### Nice-to-Have:
- [ ] Typing indicators
- [ ] Push notifications
- [ ] Message search
- [ ] Read receipts timestamps ("Read 2m ago")

---

## 🆘 Troubleshooting

### Messages not updating?
- Check browser console for errors
- Verify Firestore connection in Firebase Console
- Check Network tab for API calls

### Unread badge not showing?
- Verify `/api/messages` returns correct unreadCount
- Check Dashboard polling interval (10 seconds)

### Email notifications not working?
- Check Resend API key in `.env`
- Verify ADMIN_EMAIL is set
- Check spam folder

---

## 🎯 Key Files

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard with unread badge
│   │   └── messages/
│   │       └── page.tsx          # Messages UI
│   └── api/
│       └── messages/
│           ├── route.ts          # GET/PATCH endpoints
│           ├── send/route.ts     # POST send message
│           └── receive/route.ts  # POST webhook for email
├── lib/
│   └── firebaseAdmin.ts          # Firestore connection
└── components/
    └── (no messaging components - all in pages)
```

---

## ✅ Summary

Your messaging system is:
- ✅ **Fully integrated** in Dashboard (no popups)
- ✅ **100% free** (Firestore free tier)
- ✅ **Real-time-ish** (3-second polling, upgradeable to instant)
- ✅ **Professional UI** (teal/navy, clean design)
- ✅ **Feature-complete** (unread badges, read receipts, auto-scroll)

**No external chat service needed!** You have full control over everything.

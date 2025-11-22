# Zapier Setup für Email-Antworten mit Tags

## Übersicht

Wenn ein Tutor auf eine Email antwortet, muss die Antwort automatisch gespeichert und im Dashboard angezeigt werden.

**Reply-To Adresse:** `messages+{conversationId}@roma-munich.de`

Die Email enthält versteckte Tags im Body:
```
TUTOR: Theo Müller
RECIPIENT: Diana Krauss
CONVERSATION_ID: abc123-xyz789
TUTOR_ID: tutor_123
SENDER_ID: user_456
```

## Zapier Flow

### 1. Trigger: Gmail - New Email Matching Search

**Search String:**
```
to:messages+*@roma-munich.de
```

oder wenn du mit romamuenchen@gmail.com arbeitest:
```
to:romamuenchen@gmail.com
```

### 2. Filter: Only Continue If...

- **Field:** `To` (oder `Reply To`)
- **Condition:** Contains
- **Value:** `messages+`

### 3. Code by Zapier: Parse Email Tags

**Language:** JavaScript

**Input Data:**
- `body_plain` → von Gmail Trigger

**Code:**
```javascript
// Parse email body for structured tags
const body = inputData.body_plain || '';

// Extract conversationId from "To" address
// Format: messages+{conversationId}@roma-munich.de
const toAddress = inputData.to || '';
const convMatch = toAddress.match(/messages\+([^@]+)@/);
const conversationId = convMatch ? convMatch[1] : null;

// Extract tags from email body
const extractTag = (tagName) => {
  const regex = new RegExp(`${tagName}:\\s*(.+)`, 'i');
  const match = body.match(regex);
  return match ? match[1].trim() : null;
};

const tutorName = extractTag('TUTOR');
const recipientName = extractTag('RECIPIENT');
const tutorId = extractTag('TUTOR_ID');
const senderId = extractTag('SENDER_ID');

// Clean email body (remove tags)
const cleanBody = body
  .replace(/TUTOR:.*\n?/gi, '')
  .replace(/RECIPIENT:.*\n?/gi, '')
  .replace(/CONVERSATION_ID:.*\n?/gi, '')
  .replace(/TUTOR_ID:.*\n?/gi, '')
  .replace(/SENDER_ID:.*\n?/gi, '')
  .trim();

output = {
  conversationId: conversationId,
  tutorName: tutorName,
  recipientName: recipientName,
  tutorId: tutorId,
  senderId: senderId,
  cleanBody: cleanBody,
  fromEmail: inputData.from,
  subject: inputData.subject
};
```

### 4. Webhooks by Zapier: POST

**URL:**
```
https://roma-munich.de/api/messages/receive
```

oder für lokale Tests:
```
http://localhost:3000/api/messages/receive
```

**Method:** POST

**Data:**
```json
{
  "conversationId": "{{step3.conversationId}}",
  "from": "{{step3.fromEmail}}",
  "fromName": "{{step3.tutorName}}",
  "subject": "{{step3.subject}}",
  "body": "{{step3.cleanBody}}",
  "messageId": "{{step1.message_id}}",
  "tutorId": "{{step3.tutorId}}",
  "tutorName": "{{step3.tutorName}}",
  "recipientId": "{{step3.senderId}}",
  "recipientName": "{{step3.recipientName}}"
}
```

**Headers:**
```
Content-Type: application/json
```

### 5. Gmail: Add Label to Email

**Labels:** `Processed`

Optional: Markiert die Email als verarbeitet.

---

## Alternative: Make.com Setup

### Module 1: Gmail - Watch emails

**Search Query:**
```
to:messages+*@roma-munich.de
```

### Module 2: Text parser - Match pattern

**Pattern:**
```
messages\+([^@]+)@
```

**Text:** `{{1.to}}`

Output: `conversationId`

### Module 3: Text parser - Extract multiple values

**Patterns:**
- `TUTOR:\s*(.+)` → tutorName
- `RECIPIENT:\s*(.+)` → recipientName
- `TUTOR_ID:\s*(.+)` → tutorId
- `SENDER_ID:\s*(.+)` → senderId

**Text:** `{{1.text}}`

### Module 4: HTTP - Make a request

**URL:** `https://roma-munich.de/api/messages/receive`

**Method:** POST

**Body type:** JSON

**Request content:**
```json
{
  "conversationId": "{{2.output[1]}}",
  "from": "{{1.from}}",
  "fromName": "{{3.tutorName}}",
  "subject": "{{1.subject}}",
  "body": "{{1.text}}",
  "messageId": "{{1.messageId}}",
  "tutorId": "{{3.tutorId}}",
  "tutorName": "{{3.tutorName}}",
  "recipientId": "{{3.senderId}}",
  "recipientName": "{{3.recipientName}}"
}
```

---

## Test mit cURL

```bash
curl -X POST http://localhost:3000/api/messages/receive \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "abc123-xyz789",
    "from": "theo@example.com",
    "fromName": "Theo Müller",
    "subject": "Re: Deine Anfrage",
    "body": "Hallo Diana, vielen Dank für deine Nachricht!",
    "tutorId": "tutor_123",
    "tutorName": "Theo Müller",
    "recipientId": "user_456",
    "recipientName": "Diana Krauss"
  }'
```

**Erwartete Response:**
```json
{
  "success": true,
  "messageId": "firestore-doc-id",
  "conversationId": "abc123-xyz789"
}
```

---

## Produktion: Resend Inbound Routes

Wenn `roma-munich.de` bei Resend verifiziert ist:

### 1. Domain verifizieren
- Gehe zu Resend Dashboard → Domains
- Füge `roma-munich.de` hinzu
- Füge DNS Records hinzu (MX, SPF, DKIM)

### 2. Inbound Route erstellen
- **Recipient:** `messages+*@roma-munich.de`
- **Forward to:** `https://roma-munich.de/api/messages/receive`
- **Method:** PUT

### 3. Webhook Handler
Bereits implementiert in `/api/messages/receive` (PUT method)!

```typescript
export async function PUT(request: NextRequest) {
  // Resend sendet Inbound Emails als PUT Request
  const payload = await request.json()
  const { from, to, subject, html, text } = payload
  
  // Parse conversationId aus "to" Adresse
  const match = to?.match(/messages\+([^@]+)@/)
  const conversationId = match[1]
  
  // ... automatische Verarbeitung
}
```

---

## Vorteile der neuen Lösung

✅ **Keine Betreff-Manipulation nötig** - ConversationId ist in der Reply-To Adresse
✅ **Strukturierte Tags** - Tutor und Recipient sind explizit im Email-Body
✅ **Automatische Zuordnung** - System weiß genau wer wem antwortet
✅ **Dashboard-Integration** - Antworten erscheinen sofort in der richtigen Konversation
✅ **Fallback-Logik** - Wenn Tags fehlen, wird aus letzter Nachricht abgeleitet

---

## Kosten

**Zapier:**
- Free: 100 Tasks/Monat
- Starter ($20/mo): 750 Tasks/Monat

**Make.com:**
- Free: 1,000 Operations/Monat
- Core ($9/mo): 10,000 Operations/Monat

**Resend Inbound (Produktion):**
- Enthalten in allen Plänen
- Keine zusätzlichen Kosten

---

## Troubleshooting

### Problem: Tags werden nicht gefunden

**Lösung:** Prüfe ob Email als HTML oder Plain Text gesendet wird:
```javascript
const body = inputData.body_plain || inputData.body_html || '';
```

### Problem: conversationId ist null

**Lösung:** Prüfe "To" oder "Reply-To" Header:
```javascript
const toAddress = inputData.to || inputData.reply_to || '';
```

### Problem: Nachricht wird nicht gespeichert

**Lösung:** Prüfe Firestore Logs:
```bash
# In Cloud Console oder Firebase Console
# Suche nach "Email reply saved" Log
```

### Problem: Doppelte Nachrichten

**Lösung:** Verwende `messageId` als Deduplizierung:
```typescript
// In /api/messages/receive
const existingMessage = await adminDb
  .collection('messages')
  .where('emailMessageId', '==', messageId)
  .limit(1)
  .get()

if (!existingMessage.empty) {
  return NextResponse.json({ success: true, duplicate: true })
}
```

---

## Nächste Schritte

1. ✅ **Jetzt:** Teste mit cURL ob Webhook funktioniert
2. ✅ **Dann:** Richte Zapier ein (10 Minuten)
3. 🔄 **Später:** Migriere zu Resend Inbound (wenn Domain verifiziert)
4. 📧 **Test:** Sende Testnachricht an Tutor und warte auf Antwort

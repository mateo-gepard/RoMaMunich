# Email Antworten automatisch verarbeiten - Zapier Setup

## Schnellstart: Zapier Integration

### Schritt 1: Neuen Zap erstellen

**Trigger**: Gmail - "New Email"
- Account: romamuenchen@gmail.com
- Label/Folder: Inbox
- Search String: `subject:[MSG-`

### Schritt 2: Filter hinzufügen

**Only continue if...**
- Subject contains `[MSG-`

### Schritt 3: Code by Zapier - Parse ConversationId

**Language**: JavaScript

```javascript
// Input
const subject = inputData.subject;

// Parse conversationId
const match = subject.match(/\[MSG-([^\]]+)\]/);
if (!match) {
  throw new Error('No conversation ID found in subject');
}

const conversationId = match[1];

// Clean email body (remove quoted text)
let body = inputData.bodyPlain || inputData.bodyHtml || '';

// Remove everything after common reply markers
const replyMarkers = [
  'On ',
  'Am ',
  '-----Original Message-----',
  '________________________________',
  '> ',
  'Von:',
  'From:'
];

for (const marker of replyMarkers) {
  const index = body.indexOf(marker);
  if (index > 0) {
    body = body.substring(0, index);
  }
}

// Trim whitespace
body = body.trim();

output = {
  conversationId: conversationId,
  body: body,
  from: inputData.from,
  fromName: inputData.fromName || inputData.from,
  subject: subject,
  messageId: inputData.id
};
```

### Schritt 4: Webhooks by Zapier - POST Request

**URL**: `https://roma-munich.de/api/messages/receive`

**Method**: POST

**Data (JSON)**:
```json
{
  "conversationId": "{{Step 3 Output: conversationId}}",
  "from": "{{Step 3 Output: from}}",
  "fromName": "{{Step 3 Output: fromName}}",
  "subject": "{{Step 3 Output: subject}}",
  "body": "{{Step 3 Output: body}}",
  "messageId": "{{Step 3 Output: messageId}}"
}
```

**Headers**:
```
Content-Type: application/json
```

### Schritt 5: (Optional) Gmail - Add Label

**Label**: "RoMa Processed"
**Message**: Use message from Step 1

Dies markiert verarbeitete Emails.

---

## Alternative: Make.com (Integromat) Setup

### Scenario Structure:

1. **Gmail - Watch Emails**
   - Account: romamuenchen@gmail.com
   - Filter: Subject contains `[MSG-`
   - Max Results: 10

2. **Text Parser - Match Pattern**
   - Pattern: `\[MSG-([^\]]+)\]`
   - Text: {{1.subject}}
   - Output: conversationId

3. **Tools - Set Multiple Variables**
   ```
   conversationId = {{2.conversationId}}
   body = {{1.textPlain}}
   from = {{1.from}}
   fromName = {{1.fromName}}
   subject = {{1.subject}}
   messageId = {{1.messageId}}
   ```

4. **HTTP - Make a Request**
   - URL: `https://roma-munich.de/api/messages/receive`
   - Method: POST
   - Body type: Raw (JSON)
   - Body:
   ```json
   {
     "conversationId": "{{conversationId}}",
     "from": "{{from}}",
     "fromName": "{{fromName}}",
     "subject": "{{subject}}",
     "body": "{{body}}",
     "messageId": "{{messageId}}"
   }
   ```

5. **Gmail - Add a Label** (Optional)
   - Message ID: {{1.id}}
   - Label: RoMa Processed

---

## Manuelles Testen

### Test mit cURL:

```bash
curl -X POST https://roma-munich.de/api/messages/receive \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "mateo@gmail.com-tutor123",
    "from": "tutor@email.com",
    "fromName": "Max Mustermann",
    "subject": "Re: [MSG-mateo@gmail.com-tutor123] Frage",
    "body": "Hallo! Ja, das können wir gerne besprechen...",
    "messageId": "gmail-msg-123"
  }'
```

### Erwartete Response:
```json
{
  "success": true,
  "messageId": "firestore-doc-id",
  "conversationId": "mateo@gmail.com-tutor123"
}
```

---

## Troubleshooting

### Problem: "Conversation not found"
**Lösung**: Stelle sicher, dass conversationId existiert
```bash
# Check Firestore
# Collection: messages
# Query: where conversationId == "xyz"
```

### Problem: Email Body enthält zu viel Quoted Text
**Lösung**: Verbessere den Parsing in Schritt 3:
```javascript
// Entferne alles nach erstem ">" (Quote)
const lines = body.split('\n');
const cleanLines = [];
for (const line of lines) {
  if (line.trim().startsWith('>')) break;
  cleanLines.push(line);
}
body = cleanLines.join('\n').trim();
```

### Problem: Falsche Sender/Empfänger Zuordnung
**Lösung**: System holt letzte Nachricht aus Konversation und invertiert Sender/Empfänger

---

## Kosten

### Zapier:
- **Free Plan**: 100 Tasks/Monat
- **Starter Plan**: $19.99/mo - 750 Tasks
- **Professional**: $49/mo - 2000 Tasks

### Make.com:
- **Free Plan**: 1000 Operations/Monat
- **Core Plan**: $9/mo - 10,000 Operations
- **Pro Plan**: $16/mo - 10,000 Operations

**Empfehlung für Start**: Make.com Free Plan (1000 Emails/Monat kostenlos)

---

## Security Considerations

### Optional: API Key für Webhook

In `.env`:
```
WEBHOOK_SECRET=your-random-secret-key
```

In Zapier Step 4, füge Header hinzu:
```
X-Webhook-Secret: your-random-secret-key
```

In `/api/messages/receive/route.ts`:
```typescript
const secret = request.headers.get('x-webhook-secret')
if (secret !== process.env.WEBHOOK_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

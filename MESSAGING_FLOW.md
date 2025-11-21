# RoMa Munich - Messaging System Flow

## Aktuelle Implementierung (v2 - Email mit strukturierten Tags)

### Nachrichten Senden
1. **Parent sendet Nachricht** im Dashboard
2. **System speichert** in Firestore:
   ```
   messages/{messageId}
   - conversationId: "userId-tutorId"
   - senderId: "parent@email.com"
   - recipientId: "tutor123"
   - content: "Nachricht..."
   - isRead: false
   - createdAt: timestamp
   ```
3. **Email wird gesendet** an `romamuenchen@gmail.com`:
   - **Von**: `onboarding@resend.dev`
   - **Reply-To**: `messages+{conversationId}@roma-munich.de`
   - **Betreff**: `Neue Nachricht von Parent Name - Subject`
   - **Body**: Nachricht + versteckte Tags:
     ```html
     <!-- Sichtbare Nachricht -->
     <p>Nachricht von Diana Krauss...</p>
     
     <!-- Versteckte Tags für automatische Verarbeitung -->
     <div style="display: none;">
       TUTOR: Theo Müller
       RECIPIENT: Diana Krauss
       CONVERSATION_ID: abc123-xyz789
       TUTOR_ID: tutor_123
       SENDER_ID: user_456
     </div>
     ```

### Tutor Antwort (Automatische Verarbeitung)

#### Flow:
1. **Tutor klickt "Reply"** auf Email
2. **Reply-To Adresse**: `messages+{conversationId}@roma-munich.de`
3. **Zapier/Make.com/Gmail API** erkennt neue Email
4. **Parser extrahiert**:
   - ConversationId aus "To" Adresse: `messages+abc123-xyz789@roma-munich.de`
   - Tutor/Recipient Info aus versteckten Tags im Body
5. **Webhook Call**: `POST /api/messages/receive`
   ```json
   {
     "conversationId": "abc123-xyz789",
     "from": "theo@example.com",
     "fromName": "Theo Müller",
     "body": "Hallo Diana, vielen Dank...",
     "tutorId": "tutor_123",
     "tutorName": "Theo Müller",
     "recipientId": "user_456",
     "recipientName": "Diana Krauss"
   }
   ```
6. **System speichert** in Firestore mit `source: 'email'`
7. **Parent sieht Antwort** sofort im Dashboard

#### Fallback-Logik:
Wenn Tags fehlen oder nicht gelesen werden können:
- System holt letzte Nachricht aus Konversation
- Invertiert Sender ↔ Recipient
- Tutors alte recipientId wird neue senderId

---

## Zukünftige Implementierung (v2 - Automatisch)

### Setup Requirements:
1. **Domain verifizieren**: `roma-munich.de` bei Resend
2. **Inbound Route**: `messages+*@roma-munich.de` → Webhook
3. **Tutor-Emails**: Jeden Tutor eine eigene Email geben

### Flow:
```
Parent → Dashboard → Firestore + Email
Email → tutor@roma-munich.de (mit Reply-To: messages+{convId}@roma-munich.de)
Tutor → Reply
Resend → POST /api/messages/webhook
System → Parsed & Save to Firestore
Parent → Sieht im Dashboard
```

---

## Datenstruktur

### Firestore Collection: `messages`
```javascript
{
  id: "msg_123",
  conversationId: "parent@email.com-tutor123",
  senderId: "parent@email.com",
  senderName: "Parent Name",
  recipientId: "tutor123",
  recipientName: "Tutor Name",
  subject: "Frage zu Session",
  content: "Nachrichtentext...",
  sessionId: "session_456", // Optional
  isRead: false,
  createdAt: "2025-11-21T10:30:00Z"
}
```

### Conversation ID Format:
```javascript
// Sortiert alphabetisch für Konsistenz
const conversationId = [userId, tutorId].sort().join('-')
// Beispiel: "mateo@gmail.com-tutor123"
```

---

## API Endpoints

### POST `/api/messages/send`
**Zweck**: Neue Nachricht senden
**Body**:
```json
{
  "tutorId": "tutor123",
  "tutorName": "Tutor Name",
  "subject": "Betreff",
  "message": "Text...",
  "sessionId": "optional"
}
```
**Aktion**:
- Speichert in Firestore
- Sendet Email an `romamuenchen@gmail.com` mit conversationId im Betreff

### GET `/api/messages`
**Zweck**: Alle Konversationen für User holen
**Query**: Keine (verwendet session)
**Response**:
```json
{
  "conversations": [
    {
      "conversationId": "...",
      "tutorId": "...",
      "tutorName": "...",
      "lastMessage": {
        "content": "...",
        "createdAt": "...",
        "isFromMe": true
      },
      "unreadCount": 2
    }
  ]
}
```

### GET `/api/messages?conversationId={id}`
**Zweck**: Alle Nachrichten einer Konversation
**Response**:
```json
{
  "messages": [
    { 
      "id": "...",
      "content": "...",
      "senderId": "...",
      "createdAt": "...",
      "isRead": true
    }
  ]
}
```

### PATCH `/api/messages`
**Zweck**: Nachrichten als gelesen markieren
**Body**:
```json
{
  "conversationId": "..."
}
```

### POST `/api/messages/webhook` (Zukünftig)
**Zweck**: Eingehende Email-Antworten verarbeiten
**Body**: Resend Inbound Email Payload
**Aktion**:
- Parsed conversationId
- Speichert als neue Nachricht in Firestore
- Markiert als vom Tutor

---

## Temporäre Lösung - Antworten verarbeiten

### Manueller Prozess:
1. **Email checken**: `romamuenchen@gmail.com`
2. **Conversation ID** aus Betreff kopieren: `[MSG-abc123-def456]`
3. **Dashboard öffnen**: Login als Admin/Tutor
4. **Nachricht finden**: In Messages Tab nach conversationId suchen
5. **Antwort schreiben**: Im Dashboard
6. **System macht den Rest**: Speichert + sendet Email

### Semi-Automatisch (Zapier/Make):
1. **Zapier Trigger**: "New Email in Gmail" (romamuenchen@gmail.com)
2. **Filter**: Email subject contains `[MSG-`
3. **Parse**: Extract conversationId with regex: `\[MSG-([^\]]+)\]`
4. **Action**: HTTP POST to `https://roma-munich.de/api/messages/receive`
   ```json
   {
     "conversationId": "extracted-id",
     "from": "tutor email",
     "subject": "email subject",
     "body": "email text",
     "messageId": "gmail-message-id"
   }
   ```
5. **API verarbeitet** und speichert

---

## Nächste Schritte

### Priorität 1 (Jetzt implementiert):
- ✅ Nachrichten in Firestore speichern
- ✅ ConversationId in Email-Betreff
- ✅ Dashboard zeigt alle gespeicherten Nachrichten
- ✅ Reply-To auf Parent's Email
- ✅ Antwort-Instruktionen in Email

### Priorität 2 (Manuell für jetzt):
- 📋 Admin/Tutor antwortet über Dashboard
- 📋 Email-Antworten werden manuell im Dashboard eingegeben

### Priorität 3 (Später automatisieren):
- ⏳ Gmail API Integration oder Zapier
- ⏳ Webhook für eingehende Emails: `/api/messages/receive`
- ⏳ Automatisches Parsing von Email-Antworten
- ⏳ Push-Notifications für neue Nachrichten

### Priorität 4 (Produktion):
- ⏳ Domain `roma-munich.de` bei Resend verifizieren
- ⏳ Resend Inbound Routes konfigurieren
- ⏳ Tutoren eigene Emails geben
- ⏳ Reply-to System auf `messages+{convId}@roma-munich.de` umstellen

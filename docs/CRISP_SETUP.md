# ✅ CRISP CHAT SETUP

## Was ist Crisp?
Crisp ist eine kostenlose Live-Chat und Customer Messaging Lösung - perfekt für Kundenkommunikation.

## Vorteile:
- ✅ **Kostenlos** bis zu 2 Agents
- ✅ **Live Chat** Widget auf der Website
- ✅ **Email Integration** - Kunden können per Email antworten
- ✅ **Mobile Apps** (iOS/Android) für Agents
- ✅ **Chat History** - Alle Konversationen gespeichert
- ✅ **File Sharing** - Bilder, PDFs hochladen
- ✅ **Automated Messages** - Welcome message, etc.

## Setup (5 Minuten):

### 1. Account erstellen
1. Gehe zu https://crisp.chat/en/
2. Klicke "Start Free Trial"
3. Registriere mit Email: **romamuenchen@gmail.com**
4. Bestätige Email

### 2. Website hinzufügen
1. Im Dashboard: "Add a website"
2. **Website Name**: RoMa Munich
3. **Website URL**: https://roma-munich.de (oder localhost für Tests)
4. Klicke "Create"

### 3. Website ID kopieren
1. Im Dashboard → Settings → Website Settings
2. Kopiere deine **Website ID** (z.B. `abc12345-6789-...`)

### 4. In .env.local eintragen
Füge zu deiner `.env.local` hinzu:
```
NEXT_PUBLIC_CRISP_WEBSITE_ID=abc12345-6789-abcd-ef12-3456789abcde
```

### 5. Dev Server neustarten
```powershell
npm run dev
```

### 6. Testen
- Öffne http://localhost:3000
- Unten rechts sollte ein Chat-Bubble erscheinen
- Klicke darauf und schreibe eine Test-Nachricht
- Im Crisp Dashboard siehst du die Nachricht!

## Features nutzen:

### Live Chat beantworten:
1. Öffne https://app.crisp.chat
2. Gehe zu "Inbox"
3. Sieh alle eingehenden Nachrichten
4. Antworte in Echtzeit!

### Mobile App installieren:
- iOS: https://apps.apple.com/app/crisp/id1024682419
- Android: https://play.google.com/store/apps/details?id=chat.crisp.crispforoperators

### Welcome Message einrichten:
1. Im Dashboard → Chatbox & Email → Chatbox appearance
2. "Welcome message": 
   ```
   Hallo! 👋 Wie können wir dir helfen?
   ```
3. Save

### Email Routing:
1. Dashboard → Settings → Routing
2. **Email forwarding**: romamuenchen@gmail.com
3. Jetzt werden Nachrichten auch per Email weitergeleitet!

## Altes Messaging System entfernen:

Die alten Messages-Seiten können gelöscht/deaktiviert werden:
- `src/app/dashboard/messages/page.tsx` → kann bleiben für interne Admin-Kommunikation
- Oder komplett auf Crisp umstellen

## Kosten:
- **Free Plan**: 2 Operators, unlimited conversations ✅
- **Pro Plan** ($25/mo): Unbegrenzte Operators, Advanced features
- **Unlimited** ($95/mo): White-label, Priority support

Für den Start reicht der **kostenlose Plan** völlig aus!

## Support:
- Docs: https://docs.crisp.chat
- Help: help@crisp.chat

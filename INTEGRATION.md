# RoMa Munich - Integration Guide

## Calendly Booking System

Die Website verwendet Calendly für das Buchungssystem und die Terminverwaltung.

### Setup

1. **Calendly Account**: Erstelle einen Account auf [calendly.com](https://calendly.com)

2. **Event Type**: Erstelle einen Event Type namens "Erstgespräch" mit:
   - Dauer: 30 Minuten
   - URL: `https://calendly.com/roma-munich/erstgespraech`
   - Beschreibung: Kostenloses Kennenlerngespräch

3. **Integration**: Das Calendly Widget ist bereits in folgende Seiten integriert:
   - `/buchen` - Inline Kalendar Widget
   - Hero Section - Call-to-Action Button
   - Navbar - Booking Button
   - Footer CTA - Call-to-Action Button

### Customization

Um den Calendly Link zu ändern, aktualisiere die URL in:
- `src/components/marketing/HeroSection.tsx`
- `src/components/marketing/Navbar.tsx`
- `src/components/marketing/CTA.tsx`
- `src/app/buchen/page.tsx`

### CalendlyWidget Component

Der `CalendlyWidget` Component unterstützt zwei Modi:

```tsx
// Inline Mode (zeigt den Kalender direkt an)
<CalendlyWidget 
  url="https://calendly.com/roma-munich/erstgespraech" 
  type="inline"
/>

// Popup Mode (öffnet ein Popup beim Klick)
<CalendlyWidget 
  url="https://calendly.com/roma-munich/erstgespraech" 
  type="popup"
  buttonText="Termin buchen"
  className="custom-button-class"
/>
```

## Removed Systems

Die folgenden Systeme wurden entfernt und durch Calendly ersetzt:

- ❌ Custom Booking System
- ❌ NextAuth Login System
- ❌ Prisma Database
- ❌ Firebase/Firestore
- ❌ Custom Dashboard
- ❌ Matching System
- ❌ Message System

## Benefits

✅ Keine Backend-Infrastruktur erforderlich
✅ Keine Datenbank erforderlich
✅ Automatische Email-Benachrichtigungen
✅ Google Calendar Integration
✅ Zoom/Teams Integration möglich
✅ DSGVO-konform
✅ Professionelles Booking-Interface
✅ Mobile-optimiert

## Environment Variables

Keine Environment Variables mehr erforderlich! 🎉

## Deployment

Die App ist jetzt vollständig statisch und kann auf jedem Static Hosting deployed werden:
- Vercel (empfohlen)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

```bash
npm run build
npm run start
```

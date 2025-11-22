# RoMa Munich - Booking System Setup Guide

## 🎯 Vollständiges Custom-Buchungssystem

Dieses System ersetzt Calendly mit einer **professionellen, maßgeschneiderten Lösung** die folgendes bietet:

- ✅ User-Profile mit Email & Passwort
- ✅ Dashboard zur Verwaltung von Buchungen
- ✅ Tutor- und Fächer-Auswahl
- ✅ Probestunden (nur einmal pro User)
- ✅ Stundenpakete (5, 10, 20 Stunden)
- ✅ Paket-Tracking (verbleibende Stunden)
- ✅ Schönes, modernes UI mit Glassmorphism

## 📦 Setup-Anleitung

### 1. Supabase Account erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle einen kostenlosen Account
3. Erstelle ein neues Projekt
4. Notiere dir:
   - Project URL
   - Anon/Public Key

### 2. Datenbank Setup

1. Öffne den SQL Editor in Supabase
2. Kopiere den Inhalt von `supabase-schema.sql`
3. Führe das SQL-Script aus
4. Fertig! Die Datenbank ist eingerichtet

### 3. Environment Variables

Kopiere `.env.example` zu `.env.local`:

```bash
cp .env.example .env.local
```

Füge deine Supabase Credentials ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Tutoren hinzufügen

Füge Tutoren über den Supabase Table Editor hinzu:

**Tabelle: `tutors`**
```sql
INSERT INTO tutors (name, bio, hourly_rate_trial, hourly_rate_regular, available) VALUES
('Leon Schmidt', 'Bundessieger Mathematik-Olympiade 2024', 0, 50, true),
('Anna Müller', 'Frühstudierende Physik an der TUM', 0, 45, true);
```

**Tabelle: `tutor_subjects`** (Verknüpfung Tutor ↔ Fächer)
```sql
-- Leon kann Mathe und Physik
INSERT INTO tutor_subjects (tutor_id, subject_id)
SELECT tutors.id, subjects.id
FROM tutors, subjects
WHERE tutors.name = 'Leon Schmidt'
AND subjects.name IN ('Mathematik', 'Physik');
```

### 5. Development starten

```bash
npm install
npm run dev
```

## 🎨 Features im Detail

### Authentifizierung

- **Registration**: `/register` - Neues Konto erstellen
- **Login**: `/login` - Anmelden
- **Automatischer Redirect**: Geschützte Routen leiten zu /login

### Buchungsprozess

**Schritt 1**: Tutor auswählen
- Grid-Layout mit allen verfügbaren Tutoren
- Profilbild, Name, Bio, Fächer, Preise

**Schritt 2**: Fächer & Termin wählen
- Mehrere Fächer gleichzeitig wählbar
- Datum & Uhrzeit-Auswahl
- Notizen-Feld

**Schritt 3**: Bestätigung
- Übersicht aller Details
- Verbindliche Buchung

### Probestunden

- Automatische Erkennung: Hat User schon eine Probestunde?
- Wenn ja → nur noch reguläre Buchungen möglich
- Wenn nein → Wahl zwischen Probestunde (kostenlos) oder regulär

### Stundenpakete

**3 Pakete verfügbar:**

| Paket | Stunden | Preis | Pro Stunde | Gültigkeit |
|-------|---------|-------|------------|------------|
| 5-Std | 5 | €240 | €48 | 3 Monate |
| 10-Std | 10 | €450 | €45 | 6 Monate |
| 20-Std | 20 | €800 | €40 | 12 Monate |

**Features:**
- Automatisches Tracking verbleibender Stunden
- Visueller Fortschrittsbalken
- Ablaufdatum

### Dashboard

**User-Dashboard** (`/dashboard`):
- Übersicht: Verfügbare Stunden, kommende Termine, Pakete
- Aktive Pakete mit Fortschrittsbalken
- Liste kommender Buchungen
- Historie vergangener Termine
- Quick-Actions: Neue Buchung, Abmelden

## 🗄️ Datenbank-Schema

### Tabellen

1. **profiles** - User-Profile (extends Supabase Auth)
2. **tutors** - Tutoren-Daten
3. **subjects** - Fächer (Mathe, Physik, etc.)
4. **tutor_subjects** - N:M Beziehung Tutoren ↔ Fächer
5. **packages** - Stundenpakete pro User
6. **bookings** - Alle Buchungen

### SQL-Funktionen

- `has_trial_lesson(user_uuid)` - Prüft ob User Probestunde hatte
- `get_available_lessons(user_uuid)` - Gibt verbleibende Stunden zurück

## 🎨 UI/UX Features

- **Glassmorphism** - Moderne, transparente Cards
- **Gradient Buttons** - Purple Brand-Theme
- **Responsive** - Mobile-First Design
- **Loading States** - Spinner & Disabled States
- **Empty States** - Hilfreiche Platzhalter
- **Status Badges** - Farbcodierte Booking-Stati
- **Progress Bars** - Visuelle Paket-Anzeige
- **Step Indicator** - 3-Schritt Buchungsprozess

## 🔒 Sicherheit

- **Row Level Security (RLS)** - User sehen nur eigene Daten
- **Supabase Auth** - Sichere JWT-basierte Authentifizierung
- **Protected Routes** - Automatischer Login-Redirect
- **Input Validation** - Client & Server-seitig

## 📱 Responsive Design

- **Mobile**: Gestapelte Cards, Touch-freundlich
- **Tablet**: 2-Spalten Grid
- **Desktop**: 3-Spalten Grid, optimale Bildschirmnutzung

## 🚀 Deployment

1. Pushe Code zu GitHub
2. Verbinde mit Vercel
3. Füge Environment Variables in Vercel hinzu
4. Deploy! ✅

## 💡 Nächste Schritte

1. **Payment Integration**: Stripe für echte Zahlungen
2. **Email-Benachrichtigungen**: Buchungsbestätigungen
3. **Tutor-Dashboard**: Für Tutoren zur Terminverwaltung
4. **Kalender-Ansicht**: Visueller Monatskalender
5. **Review-System**: Bewertungen nach Stunden

## 🆘 Support

Bei Fragen oder Problemen:
- Email: romamuenchen@gmail.com
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)

# 🌿 Garden Market — Marketplace-Plattform für Pflanzen & Bäume

> **Fullstack-E-Commerce-Plattform** für den Verkauf von Bäumen und Pflanzen — vom vollständigen Verkäufer-Onboarding bis zur Zahlungsabwicklung.  
> Von Grund auf selbst entwickelt: von der Datenbankarchitektur bis zum UI/UX-Interface.

**Live:** [covaci.md](https://covaci.md) · **API:** [api.covaci.md](https://api.covaci.md)

---

🌐 Dokumentation: [Українська](./README.md) | **Deutsch**

---

## 📸 Über das Projekt

Garden Market ist eine zweiseitige Marketplace-Plattform (B2C/B2B), die Baumschulen und Pflanzenhändler mit Käufern verbindet. Das Projekt umfasst ein vollständiges Rollensystem, Produktmoderation, E-Mail-Benachrichtigungen, Internationalisierung und Zahlungsintegration — alles selbst entwickelt und auf einem Produktionsserver deployt.

---

## 🛠 Technologie-Stack

### Frontend
| Technologie | Verwendungszweck |
|---|---|
| **React 18 + TypeScript** | Haupt-UI-Framework mit strikter Typisierung |
| **Vite** | Build-Tool und Dev-Server |
| **Redux Toolkit + RTK Query** | Globaler State + gecachte API-Anfragen |
| **React Router DOM v6** | SPA-Routing mit Lazy Loading |
| **Tailwind CSS** | Utility-first Styling |
| **Framer Motion** | Seitenübergangs-Animationen |
| **react-i18next** | Internationalisierung (RO / RU) |
| **React Hot Toast** | Toast-Benachrichtigungen |

### Backend
| Technologie | Verwendungszweck |
|---|---|
| **Node.js + Express.js** | REST-API-Server |
| **MongoDB + Mongoose** | Datenbank und ODM |
| **JWT + bcrypt** | Authentifizierung und Passwort-Hashing |
| **Nodemailer** | E-Mail-Service (Verifizierung, Benachrichtigungen) |
| **express-validator** | Serverseitige Validierung |
| **Winston** | Strukturiertes Logging |
| **Multer** | Bild-Upload |
| **dotenv** | Verwaltung von Umgebungsvariablen |

### Zahlungsintegrationen
| Anbieter | Status |
|---|---|
| **RunPay** (Moldova) | ⏳ Vorbereitet (wartet auf EU-Unternehmensregistrierung)
| **PayNet** (Moldova) | ⏳ Vorbereitet (wartet auf EU-Unternehmensregistrierung) |

### Infrastruktur
- **Hosting:** cPanel Shared Hosting (Node.js App)
- **Domain:** covaci.md mit SSL (HTTPS)
- **Subdomain:** api.covaci.md für Backend-API

---

## ✨ Funktionsumfang

### 👤 Authentifizierungssystem
- Registrierung für Käufer und Verkäufer mit unterschiedlichen Formularen
- **E-Mail-Verifizierung** — Bestätigungscode per E-Mail (10 Min. TTL)
- **Passwort-Wiederherstellung** per E-Mail mit Code
- JWT-Tokens in httpOnly-Cookies
- Rate Limiting auf `/auth/login` (Schutz vor Brute-Force-Angriffen)
- Automatische Spracherkennung aus dem `Accept-Language`-Header

### 🏪 Rollensystem
```
buyer  → Browsen, Warenkorb, Bestellungen, Bewertungen
seller → Verwaltung eigener Produkte + Approval-Flow
admin  → Vollständige Plattformkontrolle
```

- **SellerGuard / AdminGuard** — Routenschutz auf Komponentenebene
- Seller-Approval-Flow: Registrierung → Warteschleife → Genehmigung/Ablehnung durch Admin
- E-Mail-Benachrichtigungen in jedem Schritt (an Verkäufer + alle Admins)

### 🌳 Produktverwaltung (Trees)
- CRUD-Operationen für Admins und Verkäufer
- **Moderation:** Verkäufer-Produkte durchlaufen einen Genehmigungsprozess
- Zweisprachige Produkt-Titel und Beschreibungen (RU / RO)
- **Admin-Übersetzungsseite:** Separate Seite zur Übersetzung von Verkäuferprodukten
- Kategorien mit Bildern
- Lagerbestandsverwaltung
- Bild-Upload mit automatischer Bereinigung nicht verwendeter Dateien

### 🛒 Einkauf
- Warenkorb mit localStorage (funktioniert ohne Anmeldung)
- Bestellabwicklung (eingeloggt / als Gast)
- Automatische Bestellnummern-Generierung: `ORD-YYYYMM-XXXX`
- Speicherung der Lieferadresse
- Bestellstatus-Pipeline: `awaiting_payment → paid → processing → shipped → delivered`
- PDF-Rechnungsgenerierung

### 💳 Zahlungen
- Einheitlicher Payment Controller für mehrere Anbieter
- Webhook-Handler von Zahlungssystemen
- `Payment`-Modell verknüpft mit `Order`
- Unterstützung für Gastzahlungen (ohne Konto)

### 📬 E-Mail-Service
- HTML-Templates für alle E-Mails (RU / RO)
- E-Mail-Verifizierung bei Registrierung
- Verkäufer-Genehmigung / -Ablehnung (mit Begründung)
- Produktgenehmigung
- Benachrichtigungen an alle Admins bei neuen Ereignissen

### 🔔 Benachrichtigungssystem (Admin)
- Echtzeit-Zähler für ungelesene Benachrichtigungen
- Typen: `new_seller_registration`, `new_product_created`, `product_approved`, `seller_approved`, `seller_rejected`
- Als gelesen markieren / Löschen
- Paginierung

### ⭐ Bewertungen
- Erstellen, Bearbeiten, Löschen von Bewertungen
- Anzeige der eigenen Bewertungen

### 📞 Kontaktformular
- Nachrichtenversand per E-Mail

### 🌍 Internationalisierung
- Sprachen: **Rumänisch (RO)** und **Russisch (RU)**
- Automatische Browser-Spracherkennung
- JSON-Übersetzungsdateien in `public/locales/`
- Alle Server-Antworten ebenfalls lokalisiert

---

## 🗂 Projektarchitektur

```
garden-market/
│
├── frontend/                    # React + TypeScript SPA
│   ├── src/
│   │   ├── app/routes/          # AnimatedRoutes mit Lazy Loading
│   │   ├── components/          # Gemeinsame Komponenten (Layout, Header, Cart)
│   │   ├── features/
│   │   │   ├── buyer/           # Warenkorb, Bestellungen, Bewertungen, Zahlungen
│   │   │   └── seller/          # Seller-Dashboard, Produktverwaltung
│   │   ├── pages/               # Seiten (Dashboard, AdminPanel, TreeDetail...)
│   │   ├── store/               # Redux Store + RTK Query API Slices
│   │   │   ├── api/             # authApi, treesApi, adminApi, categoryApi...
│   │   │   └── slices/          # authSlice, cartSlice, treeSlice, categorySlice
│   │   ├── types/               # TypeScript-Interfaces
│   │   └── hooks/               # Custom React Hooks
│   └── public/locales/          # Übersetzungen (ro.json, ru.json)
│
└── backend/                     # Node.js + Express REST API
    ├── controllers/             # Business-Logik (user, tree, order, payment...)
    ├── models/                  # Mongoose-Schemas (User, Tree, Order, Payment...)
    ├── services/
    │   ├── payments/            # PayPal, RunPay, PayNet, Stripe Services
    │   └── emailService.js      # Nodemailer + HTML-Templates
    ├── utils/                   # checkAuth, checkAdmin, checkSeller Middlewares
    ├── validations/             # express-validator Schemas
    ├── config/                  # Logger (Winston), adminConfig
    └── index.js                 # Entry Point, alle Routen
```

---

## 🔒 Sicherheit

- JWT in httpOnly-Cookies (XSS-Schutz)
- bcrypt für Passwort-Hashing (Salt Rounds: 10)
- Rate Limiting auf dem Login-Endpoint
- CORS-Whitelist für erlaubte Origins
- express-validator auf allen mutierenden Endpoints
- Webhook-Signaturverifizierung für Zahlungssysteme
- Middleware-Kette: `checkAuth → checkAdmin/checkSeller → controller`

---

## 📡 API-Übersicht

```
Auth:     POST /auth/register, /auth/login, /auth/verify-email, /auth/reset-password
Trees:    GET  /trees, /trees/:id
Admin:    POST/PATCH/DELETE /admin/trees/:id
          PATCH /admin/trees/:id/approve, /admin/trees/:id/translations
          GET/PATCH/DELETE /admin/sellers/pending, /admin/sellers/:id/approve
          GET/PATCH/DELETE /admin/notifications
Seller:   GET/POST/PATCH/DELETE /seller/trees
Orders:   POST /orders, GET /orders, PATCH /orders/:id/status
Payments: POST /payments/paypal/create-order, /payments/paypal/capture
          POST /payments/runpay/create, /payments/paynet/create
Reviews:  GET/POST/PATCH/DELETE /api/reviews
```

---

## 🚀 Lokale Installation

```bash
# Backend
cd backend
cp .env.example .env   # Variablen ausfüllen
npm install
npm run dev            # nodemon, Port 4444

# Frontend
cd frontend
npm install
npm run dev            # Vite, Port 5173
```

**Benötigte Umgebungsvariablen:**
```
DATABASE_URL=          # MongoDB Connection String
JWT_SECRET=            # JWT Secret Key
EMAIL_USER=            # SMTP-E-Mail
EMAIL_PASS=            # SMTP-Passwort
FRONTEND_URL=          # Frontend-URL
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
RUNPAY_API_KEY=
PAYNET_MERCHANT_ID=
```

---

## 👨‍💻 Autor

**Andrii** — Fullstack Developer  
Ukraine 🇺🇦· lebt in Deutschland 🇩🇪

> Das Projekt wurde vollständig eigenständig entwickelt — von der Konzeption des Datenbankschemas und der REST-API bis hin zu React-Komponenten, Redux-Architektur und dem Deployment auf einem Produktionsserver.

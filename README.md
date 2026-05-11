# 🌿 Garden Market — Marketplace платформа для продажу рослин

> **Fullstack e-commerce платформа** для продажу дерев і рослин з повним циклом — від реєстрації продавця до оплати замовлення.  
> Розроблено з нуля: від архітектури бази даних до UI/UX інтерфейсу.

**Live:** [covaci.md](https://covaci.md) · **API:** [api.covaci.md](https://api.covaci.md)

---

🌐 Документація: **Українська** | [Deutsch](./README.de.md)

---

## 📸 Про проект

Garden Market — це двостороння marketplace-платформа (B2C/B2B), яка з'єднує розсадники та продавців рослин з покупцями. Проект включає повноцінну систему ролей, модерацію товарів, email-нотифікації, інтернаціоналізацію та інтеграцію платіжних систем.

---

## 🛠 Стек технологій

### Frontend
| Технологія | Призначення |
|---|---|
| **React 18 + TypeScript** | Основний UI фреймворк зі строгою типізацією |
| **Vite** | Збірка та dev-сервер |
| **Redux Toolkit + RTK Query** | Глобальний стейт + кешовані API запити |
| **React Router DOM v6** | SPA маршрутизація з lazy loading |
| **Tailwind CSS** | Utility-first стилізація |
| **Framer Motion** | Анімації переходів між сторінками |
| **react-i18next** | Інтернаціоналізація (RO / RU) |
| **React Hot Toast** | Toast-нотифікації |

### Backend
| Технологія | Призначення |
|---|---|
| **Node.js + Express.js** | REST API сервер |
| **MongoDB + Mongoose** | База даних та ODM |
| **JWT + bcrypt** | Аутентифікація та хешування паролів |
| **Nodemailer** | Email-сервіс (верифікація, нотифікації) |
| **express-validator** | Серверна валідація запитів |
| **Winston** | Структуроване логування |
| **Multer** | Завантаження зображень |
| **dotenv** | Управління змінними середовища |

### Платіжні інтеграції
| Провайдер | Статус |
|---|---|
| **RunPay** (Moldova) ⏳ Підготовлено (очікує реєстрацію EU entity) |
| **PayNet** (Moldova) ⏳ Підготовлено (очікує реєстрацію EU entity) |
| **PayPal** ⏳ Підготовлено (очікує реєстрацію EU entity) |


### Інфраструктура
- **Hosting:** cPanel Shared Hosting (Node.js App)
- **Domain:** covaci.md з SSL (HTTPS)
- **Subdomain:** api.covaci.md для Backend API

---

## ✨ Функціональність

### 👤 Система аутентифікації
- Реєстрація покупців та продавців з різними формами
- **Email верифікація** — код підтвердження на пошту (10 хв. TTL)
- **Відновлення паролю** через email з кодом
- JWT-токени в httpOnly cookies
- Rate limiting на `/auth/login` (захист від brute-force)
- Автоматичне визначення мови з `Accept-Language` заголовка

### 🏪 Система ролей
```
buyer  → перегляд, кошик, замовлення, відгуки
seller → управління власними товарами + approval flow
admin  → повний контроль платформи
```

- **SellerGuard / AdminGuard** — захист роутів на рівні компонентів
- Seller approval flow: реєстрація → очікування → схвалення/відхилення адміном
- Email-нотифікації на кожному кроці (продавцю + всім адмінам)

### 🌳 Управління товарами (Trees)
- CRUD товарів для адміна та продавців
- **Модерація:** товари продавців потрапляють на схвалення
- Двомовні назви та описи (RU / RO)
- **Адмін-переклад:** окрема сторінка для перекладу товарів продавців
- Категорії з зображеннями
- Управління стоком
- Завантаження зображень з автоматичним очищенням невикористаних файлів

### 🛒 Покупки
- Кошик з localStorage (працює без авторизації)
- Оформлення замовлення (авторизований / гість)
- Автогенерація номерів замовлень: `ORD-YYYYMM-XXXX`
- Збереження адреси доставки
- Статуси замовлень: `awaiting_payment → paid → processing → shipped → delivered`
- Генерація PDF-інвойсів

### 💳 Платежі
- Уніфікований Payment Controller для кількох провайдерів
- Webhook-обробники від платіжних систем
- Модель `Payment` з прив'язкою до `Order`
- Підтримка гостьових платежів (без акаунту)

### 📬 Email-сервіс
- HTML-шаблони для всіх листів (RU / RO)
- Верифікація email при реєстрації
- Схвалення / відхилення продавця (з причиною)
- Схвалення товару
- Нотифікації всім адмінам про нові події

### 🔔 Система нотифікацій (Admin)
- Real-time лічильник непрочитаних
- Типи: `new_seller_registration`, `new_product_created`, `product_approved`, `seller_approved`, `seller_rejected`
- Позначення як прочитано / видалення
- Пагінація

### ⭐ Відгуки
- Створення, редагування, видалення відгуків
- Перегляд відгуків поточного користувача

### 📞 Контактна форма
- Відправка повідомлення через email

### 🌍 Інтернаціоналізація
- Мови: **Румунська (RO)** та **Російська (RU)**
- Автовизначення мови браузера
- JSON файли перекладів у `public/locales/`
- Всі серверні відповіді також локалізовані

---

## 🗂 Архітектура проекту

```
garden-market/
│
├── frontend/                    # React + TypeScript SPA
│   ├── src/
│   │   ├── app/routes/          # AnimatedRoutes з lazy loading
│   │   ├── components/          # Shared компоненти (Layout, Header, Cart)
│   │   ├── features/
│   │   │   ├── buyer/           # Кошик, замовлення, відгуки, платежі
│   │   │   └── seller/          # Dashboard продавця, управління товарами
│   │   ├── pages/               # Сторінки (Dashboard, AdminPanel, TreeDetail...)
│   │   ├── store/               # Redux store + RTK Query API slices
│   │   │   ├── api/             # authApi, treesApi, adminApi, categoryApi...
│   │   │   └── slices/          # authSlice, cartSlice, treeSlice, categorySlice
│   │   ├── types/               # TypeScript інтерфейси
│   │   └── hooks/               # Custom React hooks
│   └── public/locales/          # Переклади (ro.json, ru.json)
│
└── backend/                     # Node.js + Express REST API
    ├── controllers/             # Бізнес-логіка (user, tree, order, payment...)
    ├── models/                  # Mongoose схеми (User, Tree, Order, Payment...)
    ├── services/
    │   ├── payments/            # PayPal, RunPay, PayNet, Stripe сервіси
    │   └── emailService.js      # Nodemailer + HTML шаблони
    ├── utils/                   # checkAuth, checkAdmin, checkSeller middlewares
    ├── validations/             # express-validator схеми
    ├── config/                  # Logger (Winston), adminConfig
    └── index.js                 # Entry point, всі роути
```

---

## 🔒 Безпека

- JWT в httpOnly cookies (захист від XSS)
- bcrypt для хешування паролів (salt rounds: 10)
- Rate limiting на login endpoint
- CORS whitelist для дозволених origins
- express-validator на всіх мутуючих endpoints
- Webhook signature verification для платіжних систем
- Middleware-ланцюжок: `checkAuth → checkAdmin/checkSeller → controller`

---

## 📡 API Overview

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

## 🚀 Запуск локально

```bash
# Backend
cd backend
cp .env.example .env   # заповни змінні
npm install
npm run dev            # nodemon, порт 4444

# Frontend
cd frontend
npm install
npm run dev            # Vite, порт 5173
```

**Потрібні змінні середовища:**
```
DATABASE_URL=          # MongoDB connection string
JWT_SECRET=            # JWT secret key
EMAIL_USER=            # SMTP email
EMAIL_PASS=            # SMTP пароль
FRONTEND_URL=          # URL фронтенду
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
RUNPAY_API_KEY=
PAYNET_MERCHANT_ID=
```

---

## 👨‍💻 Автор

**Andrii** — Fullstack Developer  
Україна | живе в Німеччині

> Проект розроблено самостійно з нуля: від проектування схеми бази даних і REST API до React компонентів, Redux архітектури та деплою на продакшн сервер.

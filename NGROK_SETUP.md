# Налаштування ngrok для доступу до сайту з інтернету

## Крок 1: Встановлення ngrok

1. Завантажте ngrok з офіційного сайту: https://ngrok.com/download
2. Або встановіть через npm (якщо встановлений Node.js):
   ```bash
   npm install -g ngrok
   ```

## Крок 2: Реєстрація та отримання токену

1. Зареєструйтеся на https://ngrok.com (безкоштовно)
2. Отримайте ваш authtoken з панелі управління
3. Налаштуйте токен:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

## Крок 3: Запуск проекту

У **двох окремих терміналах** запустіть:

**Термінал 1 - Backend:**
```bash
cd backend
npm start
```

**Термінал 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Крок 4: Запуск ngrok

У **третьому терміналі** запустіть ngrok для frontend (порт 5173):

```bash
ngrok http 5173
```

Або використайте скрипт з package.json:
```bash
npm run ngrok
```

## Крок 5: Оновлення CORS на backend

Після запуску ngrok ви отримаєте URL типу: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

1. Скопіюйте цей URL
2. Оновіть файл `backend/.env`:
   ```
   FRONTEND_URL=https://xxxx-xx-xx-xx-xx.ngrok-free.app
   ```
3. Перезапустіть backend сервер

## Крок 6: Налаштування Stripe (якщо використовується)

Якщо використовується Stripe, потрібно оновити webhook URL в панелі Stripe:
1. Зайдіть в Stripe Dashboard → Developers → Webhooks
2. Додайте новий webhook з URL: `https://xxxx-xx-xx-xx-xx.ngrok-free.app/api/payments/webhook`

## Важливо!

- **ngrok безкоштовна версія** має обмеження:
  - URL змінюється при кожному перезапуску (якщо не використовується статичний домен)
  - Обмежена кількість підключень
  - Можливі затримки

- **Для постійного доступу** розгляньте:
  - Плану ngrok з статичним доменом
  - Або деплой на хостинг (Heroku, Vercel, Railway тощо)

## Альтернатива: Використання ngrok для обох серверів

Якщо потрібен прямий доступ до backend API:

**Термінал 4 - ngrok для backend:**
```bash
ngrok http 5000
```

Потім оновіть `frontend/vite.config.js`:
```javascript
proxy: {
  "/api": {
    target: "https://xxxx-backend.ngrok-free.app",
    changeOrigin: true,
  },
}
```


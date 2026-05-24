# SETUP — настройка инфраструктуры

Этот документ — пошаговая инструкция запуска проекта с нуля. Только для разделов, где требуется ручное действие в внешних сервисах (получение ключей, создание ресурсов). Всё что автоматизируется кодом — описано в `CLAUDE.md`.

---

## Telegram-бот @botfactoryby_bot

Бот — критическая часть воронки. Без env-переменных ниже он не запустится.

### 1. Bot token от @BotFather

1. Откройте Telegram → найдите @BotFather
2. `/mybots` → выберите `@botfactoryby_bot` → **API Token**
3. Скопируйте значение → положите в `.env.local` как `TG_BOT_TOKEN`
4. Бонус: `/mybots` → бот → **Bot Settings** → **Group Privacy** → **Turn off** (нужно если бот будет работать в группах; для приватных чатов с пользователями — не критично)

### 2. Admin-канал и chat ID

Бот шлёт уведомления о новых лидах в **приватный** Telegram-канал/чат — там вы видите анкету, промокод, AI-резюме и кнопки управления.

1. В Telegram: **Создать** → **Канал** → название «BOT FACTORY · Лиды», тип «**Приватный**»
2. Добавьте бота `@botfactoryby_bot` в канал как **админа** с правами публикации
3. Запостите любое сообщение в канале → перешлите его боту `@userinfobot`
4. В ответе ищите строку `Forwarded from chat: <id>` — это и есть `TG_ADMIN_CHAT_ID`
5. Формат — отрицательное число вида `-1001234567890`

### 3. Founder TG user ID

Команды `/check` и `/redeem` доступны только вам — gating по user ID.

1. Напишите боту `@userinfobot` в Telegram
2. Скопируйте значение `Id` → положите как `TG_ADMIN_USER_ID`
3. Формат: положительное число вида `123456789`

### 4. Grok API key (xAI)

Для AI-персонализации финального отчёта после квиза.

1. Перейдите на https://console.x.ai → войдите аккаунтом X
2. Меню → **API Keys** → **Create API Key** → имя «BOT FACTORY production»
3. Скопируйте ключ (формат `xai-...`) → положите как `XAI_API_KEY`
4. Пополните баланс (минимально $5 хватит на ~5000 лидов) → https://console.x.ai → **Billing**
5. Альтернатива: если Grok API недоступен / нет ключа — бот будет использовать статичный fallback-шаблон. Воронка работает без Grok, просто без персонализации.

### 5. Neon Postgres

Бесплатный Postgres для серверлесса.

1. https://console.neon.tech → **Sign up** через GitHub/Google
2. **Create project** → имя «botfactory» → регион **Europe (eu-central-1)** (ближайший к Беларуси)
3. После создания: **Dashboard** → **Connection string** → переключите на **Pooled connection** ← ВАЖНО (Vercel serverless требует pooled)
4. Скопируйте строку (формат `postgresql://user:pass@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`) → положите как `DATABASE_URL`

Применить миграции:
```bash
npm run db:generate  # сгенерировать SQL из bot/db/schema.ts
npm run db:migrate   # применить против Neon
```

### 6. Webhook secret

Случайная строка для верификации входящих запросов от Telegram.

Сгенерировать (Git Bash / WSL):
```bash
openssl rand -hex 32
```

Или PowerShell:
```powershell
-join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) })
```

Положите как `WEBHOOK_SECRET`.

### 7. Установка webhook (после деплоя)

После того как все env заданы в Vercel и проект задеплоен:

```bash
curl "https://botfactory.by/api/bot/webhook/setup?token=<WEBHOOK_SECRET>"
```

Ответ должен содержать `"ok": true` и `info.url = "https://botfactory.by/api/bot/webhook"`.

При смене ключа или URL — выполните этот запрос заново.

---

## Локальная разработка бота

Telegram требует HTTPS-URL для webhook'ов, поэтому локально нужен туннель.

```bash
# 1. Установить ngrok (один раз): https://ngrok.com/download
# 2. Запустить Next.js:
npm run dev

# 3. В другом терминале — пробросить туннель:
ngrok http 3000

# 4. Скопировать https-URL (например, https://abc123.ngrok.io)
#    и временно установить как BOT_PUBLIC_URL в .env.local
# 5. Зарегистрировать webhook:
curl "https://abc123.ngrok.io/api/bot/webhook/setup?token=<WEBHOOK_SECRET>"

# 6. Открыть в Telegram бот:
#    t.me/botfactoryby_bot?start=<base64payload>
#    или просто /start без payload — тоже работает
```

**Внимание:** пока локально активен webhook на ngrok-URL, production-бот не будет получать обновления. После теста — заново выполните setup против прод-URL.

---

## Vercel — где задать env

Vercel Dashboard → проект **nextjsbotfactory** → **Settings** → **Environment Variables**.

Все ключи бота (`TG_BOT_TOKEN`, `TG_ADMIN_CHAT_ID`, `TG_ADMIN_USER_ID`, `XAI_API_KEY`, `DATABASE_URL`, `WEBHOOK_SECRET`, `BOT_PUBLIC_URL`) задайте для **Production** + **Preview** окружений.

После добавления env — Vercel **не** перезапускает деплой автоматически. Сделайте редеплой вручную: **Deployments** → последний → **⋯** → **Redeploy**.

---

## Чеклист готовности перед запуском

- [ ] Bot token получен и в env
- [ ] Приватный канал создан, бот в нём админ, `TG_ADMIN_CHAT_ID` известен
- [ ] `TG_ADMIN_USER_ID` известен (свой ID)
- [ ] Grok API key получен (или принято решение работать без AI на старте)
- [ ] Neon проект создан, миграции применены
- [ ] `WEBHOOK_SECRET` сгенерирован
- [ ] Все env заданы в Vercel
- [ ] Проект задеплоен после добавления env
- [ ] `/api/bot/webhook/setup` дёрнут, ответ `ok: true`
- [ ] Тестовый `/start` в боте — пришло приветствие
- [ ] Тестовый квиз пройден — лид прилетел в admin-канал

После всех галочек — воронка живая.

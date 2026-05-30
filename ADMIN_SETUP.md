# Админка (Telegram Mini App) — настройка и деплой

TMA-админка для `@botfactoryby_bot`: аналитика, лиды (CRM), юзеры, рассылки.
URL: `https://botfactory.by/admin`. Доступ — только Telegram-аккаунту с
`TG_ADMIN_USER_ID`. Открывается командой **/admin** в боте.

## Переменные окружения (Vercel → Production + Preview)

Уже есть: `DATABASE_URL`, `TG_BOT_TOKEN`, `TG_ADMIN_USER_ID`, `TG_ADMIN_CHAT_ID`,
`WEBHOOK_SECRET`, `BOT_PUBLIC_URL`, `XAI_API_KEY`.

**Добавить два новых** (значения скопировать из локального `.env.local`):

| Переменная | Назначение |
|---|---|
| `ADMIN_SESSION_SECRET` | подпись session-cookie (JWT) |
| `CRON_SECRET` | защита эндпоинта дренера рассылок |

> `ADMIN_DEV_BYPASS` — только локально, в Vercel НЕ добавлять (в проде всё равно отключён).

## После деплоя

1. **Webhook** (изменился `allowed_updates` → +my_chat_member):
   открыть `https://botfactory.by/api/bot/webhook/setup?token=<WEBHOOK_SECRET>`
2. **Проверить вход**: в боте `/admin` → кнопка «Открыть админку».
3. **Тест рассылки**: создать на сегмент «Список ID» со своим Telegram ID → «Отправить сейчас».

## Рассылки и cron

- «Отправить сейчас» работает на любом тарифе (старт через `after()` сразу после создания).
- `vercel.json` cron стоит на **ежедневный** (`0 9 * * *`) — валидно на Hobby и Pro,
  служит дренером-страховкой.
- **Точное по времени планирование** требует частого тика. Варианты:
  - **Pro**: поменять schedule в `vercel.json` на `* * * * *` (раз в минуту).
  - **Любой тариф**: внешний пингер (cron-job.org и т.п.) раз в минуту на
    `https://botfactory.by/api/admin/broadcast/tick?token=<CRON_SECRET>`.

## БД

Миграция `0001` (broadcasts, broadcast_recipients, admin_audit + users.is_blocked/
unsubscribed_at) уже применена к проду — аддитивно, данные сохранены.

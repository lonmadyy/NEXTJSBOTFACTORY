// Генерация PDF-чеклиста «Чеклист запуска цифрового продукта».
// Запуск:  node scripts/generate-checklist-pdf.mjs
//
// Использует @react-pdf/renderer (Node, не браузер). Шрифты — Manrope из
// scripts/fonts/. Результат — public/botfactory-checklist.pdf.

import React from 'react'
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FONT_DIR = join(__dirname, 'fonts')

// Manrope Variable TTF поддерживает все веса. @react-pdf использует fontkit,
// который умеет извлекать нужный wght из variable шрифта.
Font.register({
  family: 'Manrope',
  fonts: [
    { src: join(FONT_DIR, 'Manrope-Variable.ttf'), fontWeight: 400 },
    { src: join(FONT_DIR, 'Manrope-Variable.ttf'), fontWeight: 500 },
    { src: join(FONT_DIR, 'Manrope-Variable.ttf'), fontWeight: 700 },
    { src: join(FONT_DIR, 'Manrope-Variable.ttf'), fontWeight: 800 },
  ],
})

// Отключаем default hyphenation — для кириллицы он работает плохо.
Font.registerHyphenationCallback((word) => [word])

const COLORS = {
  bg: '#050505',
  white: '#ffffff',
  ink: '#0a0a0a',
  muted: '#6b7280',
  border: '#e5e7eb',
  accent: '#4F46E5',
  cyan: '#06B6D4',
  surface: '#fafafa',
  warn: '#dc2626',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Manrope',
    fontSize: 10.5,
    lineHeight: 1.55,
    color: COLORS.ink,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 64,
    backgroundColor: COLORS.white,
  },
  pageCover: {
    fontFamily: 'Manrope',
    backgroundColor: COLORS.bg,
    color: COLORS.white,
    padding: 64,
  },
  // ─── Cover ───────────────────────────────────────────────────────────
  coverHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  coverBrand: {
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: 700,
    color: COLORS.white,
  },
  coverMeta: {
    fontSize: 9,
    color: '#9ca3af',
    letterSpacing: 1.2,
  },
  coverTitleBlock: {
    marginTop: 220,
  },
  coverEyebrow: {
    fontSize: 10,
    letterSpacing: 3,
    color: '#9ca3af',
    marginBottom: 18,
    textTransform: 'uppercase',
  },
  coverTitle: {
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1.05,
    color: COLORS.white,
  },
  coverTitleAccent: {
    color: COLORS.cyan,
  },
  coverSub: {
    marginTop: 22,
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 1.55,
    maxWidth: 380,
  },
  coverFooter: {
    position: 'absolute',
    left: 64,
    right: 64,
    bottom: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverFooterText: {
    fontSize: 9,
    color: '#9ca3af',
    letterSpacing: 1,
  },
  // ─── Content pages ───────────────────────────────────────────────────
  runningHeader: {
    position: 'absolute',
    top: 24,
    left: 64,
    right: 64,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8.5,
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 24,
    right: 64,
    fontSize: 8.5,
    color: COLORS.muted,
  },
  partLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: COLORS.accent,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  h1: {
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: 18,
    color: COLORS.ink,
  },
  h2: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 24,
    marginBottom: 10,
    color: COLORS.ink,
  },
  h3: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    color: COLORS.ink,
  },
  p: {
    marginBottom: 10,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginVertical: 20,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  pill: {
    fontSize: 8.5,
    fontWeight: 700,
    color: COLORS.muted,
    letterSpacing: 1.2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.7,
    borderColor: COLORS.border,
    borderRadius: 2,
    textTransform: 'uppercase',
  },
  // Bullet list
  bullet: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletMark: {
    width: 10,
    color: COLORS.muted,
    fontWeight: 700,
  },
  bulletText: {
    flex: 1,
  },
  // Numbered list
  numItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  numIdx: {
    width: 22,
    fontWeight: 800,
    color: COLORS.accent,
  },
  numBody: {
    flex: 1,
  },
  // Quoted/callout
  callout: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 14,
  },
  calloutLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.accent,
    fontWeight: 700,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  // Two-column "Берите если / Не берите"
  twoCol: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8,
  },
  col: {
    flex: 1,
    padding: 14,
    borderWidth: 0.7,
    borderColor: COLORS.border,
    borderRadius: 4,
  },
  colTitleGood: {
    fontSize: 10,
    fontWeight: 700,
    color: '#047857',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  colTitleBad: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.warn,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metaLine: {
    fontSize: 9.5,
    color: COLORS.muted,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  metaLineBold: {
    fontWeight: 700,
    color: COLORS.ink,
  },
  // Table
  table: {
    marginVertical: 12,
    borderWidth: 0.7,
    borderColor: COLORS.border,
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderBottomColor: COLORS.border,
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableHead: {
    fontWeight: 700,
    fontSize: 9,
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: COLORS.surface,
  },
  th: {
    padding: 8,
  },
  td: {
    padding: 8,
    fontSize: 10,
  },
  cellName: { width: '36%' },
  cellWhat: { flex: 1 },
  cellWhen: { width: '20%', textAlign: 'right', color: COLORS.muted },
  // Final page
  finalHero: {
    backgroundColor: COLORS.bg,
    color: COLORS.white,
    padding: 32,
    marginTop: 8,
  },
  finalTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: COLORS.white,
    marginBottom: 8,
  },
  finalSub: {
    fontSize: 11,
    color: '#d1d5db',
    marginBottom: 18,
    lineHeight: 1.5,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  contactItem: {
    width: '47%',
    padding: 12,
    borderWidth: 0.6,
    borderColor: '#1f2937',
    borderRadius: 3,
  },
  contactLabel: {
    fontSize: 8.5,
    letterSpacing: 1.5,
    color: '#9ca3af',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.white,
  },
  legal: {
    fontSize: 8.5,
    color: COLORS.muted,
    marginTop: 24,
    lineHeight: 1.5,
  },
})

// ─── Building blocks (React.createElement, no JSX for plain .mjs) ──────
const e = React.createElement
const T = (props, ...kids) => e(Text, props, ...kids)
const V = (props, ...kids) => e(View, props, ...kids)

const Para = (text, key) => T({ style: styles.p, key }, text)

const Pills = (items) =>
  V(
    { style: styles.pillRow },
    ...items.map((it, i) => T({ key: i, style: styles.pill }, it))
  )

const Bullet = (txt, key) =>
  V(
    { style: styles.bullet, key },
    T({ style: styles.bulletMark }, '—'),
    T({ style: styles.bulletText }, txt)
  )

const NumItem = (idx, title, body, key) =>
  V(
    { style: styles.numItem, key },
    T({ style: styles.numIdx }, String(idx).padStart(2, '0')),
    V(
      { style: styles.numBody },
      T({ style: styles.h3 }, title),
      T({ style: styles.p }, body)
    )
  )

const Callout = (label, body) =>
  V(
    { style: styles.callout },
    T({ style: styles.calloutLabel }, label),
    T(null, body)
  )

const Header = (left, right) =>
  V(
    { style: styles.runningHeader, fixed: true },
    T(null, left),
    T(null, right)
  )

const PageNum = () =>
  T(
    {
      style: styles.pageNumber,
      fixed: true,
      render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`,
    },
    ''
  )

// ─── Pages ─────────────────────────────────────────────────────────────

const CoverPage = () =>
  e(
    Page,
    { size: 'A4', style: styles.pageCover },
    V(
      { style: styles.coverHeaderRow },
      T({ style: styles.coverBrand }, 'BOT FACTORY'),
      T({ style: styles.coverMeta }, 'V. 2026.05 · Минск')
    ),
    V(
      { style: styles.coverTitleBlock },
      T({ style: styles.coverEyebrow }, 'Чеклист'),
      V(
        null,
        T({ style: styles.coverTitle }, 'Запуск цифрового'),
        T({ style: [styles.coverTitle, styles.coverTitleAccent] }, 'продукта')
      ),
      T(
        { style: styles.coverSub },
        'Что нужно знать прежде чем заказывать сайт, Telegram-бота, Mini App или AI-интеграцию. Без воды, без шаблонов, без «инноваций».'
      )
    ),
    V(
      { style: styles.coverFooter },
      T({ style: styles.coverFooterText }, 'botfactory.by'),
      T({ style: styles.coverFooterText }, 'для тех, кто заказывает в digital')
    )
  )

const IntroPage = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Чеклист запуска цифрового продукта', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Введение'),
    T({ style: styles.h1 }, 'Зачем эта брошюра'),
    Para(
      'Половина digital-проектов проседает не на разработке, а до неё. Заказчик не знает, что спрашивать. Подрядчик присылает универсальную смету. Через два месяца обе стороны ругаются на «не то, не так, не вовремя».'
    ),
    Para(
      'Эта брошюра — не про дизайн-тренды и не про «как выбрать студию с многолетним опытом». Она про четыре практичные вещи:'
    ),
    Bullet('Какой именно формат закроет вашу задачу', 'a'),
    Bullet('Что должно быть в брифе, чтобы не переделывать дважды', 'b'),
    Bullet('Как читать сроки от подрядчика, чтобы «через месяц» не превратилось «через три»', 'c'),
    Bullet('Какие вопросы задать, чтобы за 15 минут понять — справится команда или нет', 'd'),
    V({ style: { height: 14 } }),
    Para(
      'Если за следующие 20 минут вы вычеркнете для себя хотя бы три из этих пунктов — мы свою задачу выполнили.'
    ),
    Callout(
      'Дисклеймер',
      'Никто из нас не любит брошюры от digital-агентств. Эта тоже про продажи, но мы её писали так, как будто читать будем сами. Если что-то покажется водой — напишите, поправим.'
    ),
    T({ style: styles.metaLine }, '— Команда BOT FACTORY, Минск'),
    PageNum()
  )

const ChoosePage1 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 1 · Выбор формата', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Часть 1'),
    T({ style: styles.h1 }, 'Какой формат вам нужен'),
    Para(
      'Перед тем как искать подрядчика — поймите, ЧТО именно вы покупаете. Четыре опции, четыре разных продукта. Разные сроки, разные деньги, разные эффекты.'
    ),
    // Сайт
    T({ style: styles.h2 }, 'Сайт под ключ'),
    V(
      { style: styles.twoCol },
      V(
        { style: styles.col },
        T({ style: styles.colTitleGood }, '✓ Берите если'),
        Bullet('Клиенты ищут вас через поиск или приходят с рекламы', '1'),
        Bullet('Нужно упаковать услугу так, чтобы можно было показывать', '2'),
        Bullet('Длинный цикл сделки — нужна страница, закрывающая возражения за вас', '3')
      ),
      V(
        { style: styles.col },
        T({ style: styles.colTitleBad }, '✕ Не берите если'),
        Bullet('Аудитория сидит в Telegram и никуда оттуда не ходит', '1'),
        Bullet('Нужны быстрые повторные касания: рассылки, статусы, оплата', '2'),
        Bullet('Это решение «потому что у всех есть сайт» — без задачи', '3')
      )
    ),
    T(
      { style: styles.metaLine },
      T({ style: styles.metaLineBold }, 'Бюджет: '),
      '680–4000 BYN  ·  ',
      T({ style: styles.metaLineBold }, 'Срок: '),
      '1–3 недели'
    ),

    // Бот
    T({ style: styles.h2 }, 'Telegram-бот'),
    V(
      { style: styles.twoCol },
      V(
        { style: styles.col },
        T({ style: styles.colTitleGood }, '✓ Берите если'),
        Bullet('У вас 200+ активных контактов в Telegram', '1'),
        Bullet('Менеджеры тратят полдня на одни и те же вопросы', '2'),
        Bullet('Нужны заявки с автозаполнением и сразу в CRM', '3')
      ),
      V(
        { style: styles.col },
        T({ style: styles.colTitleBad }, '✕ Не берите если'),
        Bullet('Ваша аудитория — до 25 или после 55: в Telegram её мало', '1'),
        Bullet('Нет внятного сценария — «давайте бота на всякий случай»', '2'),
        Bullet('Заявок в день меньше трёх: ROI не сойдётся', '3')
      )
    ),
    T(
      { style: styles.metaLine },
      T({ style: styles.metaLineBold }, 'Бюджет: '),
      '680–3000 BYN  ·  ',
      T({ style: styles.metaLineBold }, 'Срок: '),
      '1–3 недели'
    ),
    PageNum()
  )

const ChoosePage2 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 1 · Выбор формата', 'BOT FACTORY'),

    T({ style: styles.h2 }, 'Telegram Mini App'),
    Para(
      'Это веб-приложение внутри Telegram. Не путать с ботом — у Mini App полноценный интерфейс: экраны, корзина, оплата, профиль.'
    ),
    V(
      { style: styles.twoCol },
      V(
        { style: styles.col },
        T({ style: styles.colTitleGood }, '✓ Берите если'),
        Bullet('Уже есть бот, воронка упёрлась в чатовый формат', '1'),
        Bullet('Нужно мобильное приложение, но не хочется в стор', '2'),
        Bullet('Продаёте что-то с каталогом, опциями, доставкой', '3')
      ),
      V(
        { style: styles.col },
        T({ style: styles.colTitleBad }, '✕ Не берите если'),
        Bullet('Задача решается одним лендингом', '1'),
        Bullet('Аудитория не Telegram-native', '2'),
        Bullet('Хочется «потому что все говорят про мини-аппы»', '3')
      )
    ),
    T(
      { style: styles.metaLine },
      T({ style: styles.metaLineBold }, 'Бюджет: '),
      '1500–5000 BYN  ·  ',
      T({ style: styles.metaLineBold }, 'Срок: '),
      '2–3 недели'
    ),

    T({ style: styles.h2 }, 'AI-интеграция'),
    V(
      { style: styles.twoCol },
      V(
        { style: styles.col },
        T({ style: styles.colTitleGood }, '✓ Берите если'),
        Bullet('У сотрудников есть процесс, который повторяется 20 раз в день', '1'),
        Bullet('Нужно классифицировать заявки, резюмировать диалоги, писать черновики', '2'),
        Bullet('Уже понятно, ЧТО автоматизировать (если нет — сначала аудит)', '3')
      ),
      V(
        { style: styles.col },
        T({ style: styles.colTitleBad }, '✕ Не берите если'),
        Bullet('Хотите «AI-чатбота на сайт», потому что у всех есть', '1'),
        Bullet('Нет процесса, который реально болит', '2'),
        Bullet('Нет данных, на которых модель должна работать', '3')
      )
    ),
    T(
      { style: styles.metaLine },
      T({ style: styles.metaLineBold }, 'Бюджет: '),
      '680–4000 BYN  ·  ',
      T({ style: styles.metaLineBold }, 'Срок: '),
      '1–3 недели'
    ),

    Callout(
      'Правило',
      'Не выбирайте формат «по тренду». Заказчик читает, что Mini Apps — это новое, и заказывает Mini App для задачи, которую закроет лендинг за неделю и втрое дешевле. Формат идёт от задачи, не от хайпа.'
    ),
    PageNum()
  )

const BriefPage1 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 2 · Бриф', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Часть 2'),
    T({ style: styles.h1 }, 'Бриф, который экономит две недели'),
    Para(
      'Подрядчик не телепат. Если из вашего письма «хочу сайт компании, посовременнее, как у X» можно угадать ровно ничего — готовьтесь к четырём итерациям прототипа и месяцу переделок.'
    ),
    Para('Хороший бриф отвечает на восемь вопросов. Не больше.'),

    NumItem(
      1,
      'Чем занимается компания (в одно предложение)',
      '«Делаем X для Y» — без эпитетов. Если предложение получилось длиннее 15 слов — упрощайте.',
      'q1'
    ),
    NumItem(
      2,
      'Кто целевая аудитория — одна, не три',
      'Возраст, должность, что у них болит. «Все, кому может быть полезно» — это не аудитория, это набор слов.',
      'q2'
    ),
    NumItem(
      3,
      'Какое одно действие должен сделать посетитель',
      'Оставить заявку? Скачать прайс? Записаться на демо? Один основной CTA. Остальное — второстепенное.',
      'q3'
    ),
    NumItem(
      4,
      'Чем вы отличаетесь от трёх главных конкурентов',
      'Не в маркетинговом смысле, а по факту: цена, скорость, гарантия, узкая специализация. Если не знаете — спросите у двух последних клиентов, почему выбрали вас.',
      'q4'
    ),
    PageNum()
  )

const BriefPage2 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 2 · Бриф', 'BOT FACTORY'),

    NumItem(
      5,
      'Какие материалы уже готовы',
      'Тексты, фото, кейсы, отзывы. Если ничего нет — это не блок, но честно скажите. Иначе подрядчик заложит в смету «копирайтинг» и счёт удвоится.',
      'q5'
    ),
    NumItem(
      6,
      'Что должно быть подключено',
      'CRM (какая именно), формы (куда падают заявки), оплата, аналитика, чат, мессенджеры. Список с конкретикой.',
      'q6'
    ),
    NumItem(
      7,
      'Какие сроки и почему',
      'Не «как можно быстрее», а конкретно. «Запускаем рекламу 15 июня — к этой дате нужен сайт». Если дедлайн привязан к событию — назовите событие.',
      'q7'
    ),
    NumItem(
      8,
      'Какой бюджет',
      'Не «обсуждаемо», а вилка от Х до Y. Сэкономите неделю на торговле и подрядчик честно скажет — влезаем или нет.',
      'q8'
    ),

    T({ style: styles.h3 }, 'Что не надо писать в брифе'),
    Bullet('«Хотим в нашем фирменном стиле» — приложите гайд или скажите, что его нет', 'n1'),
    Bullet('«Чтобы было wow» — это не критерий, а пожелание', 'n2'),
    Bullet('Ссылки на 15 «нравящихся» сайтов — выберите 2–3 и объясните, что именно нравится', 'n3'),

    Callout(
      'Эмпирика',
      'Из 10 брифов, в которых есть конкретный бюджет и дедлайн, 8 превращаются в проекты. Из 10 без них — 2. Цифры наши, выборка за 2025.'
    ),
    PageNum()
  )

const DeadlinesPage = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 3 · Сроки', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Часть 3'),
    T({ style: styles.h1 }, 'Сроки от подрядчика: как читать'),
    Para(
      'Если в коммерческом стоит «1–3 месяца» — это значит «не знаю, как пойдёт». Хороший подрядчик называет конкретный срок и привязывает его к этапам.'
    ),
    T({ style: styles.h3 }, 'Что должно быть в нормальном плане'),
    V(
      { style: styles.table },
      V(
        { style: [styles.tableRow, styles.tableHead] },
        T({ style: [styles.th, styles.cellName] }, 'Этап'),
        T({ style: [styles.th, styles.cellWhat] }, 'Что входит'),
        T({ style: [styles.th, styles.cellWhen] }, 'Срок')
      ),
      V(
        { style: styles.tableRow },
        T({ style: [styles.td, styles.cellName] }, 'Бриф и согласование'),
        T({ style: [styles.td, styles.cellWhat] }, 'Уточняющие вопросы, фиксация задач'),
        T({ style: [styles.td, styles.cellWhen] }, '2–3 дня')
      ),
      V(
        { style: styles.tableRow },
        T({ style: [styles.td, styles.cellName] }, 'Прототип и контент'),
        T({ style: [styles.td, styles.cellWhat] }, 'Структура страниц, тексты, заголовки'),
        T({ style: [styles.td, styles.cellWhen] }, '3–5 дней')
      ),
      V(
        { style: styles.tableRow },
        T({ style: [styles.td, styles.cellName] }, 'Дизайн'),
        T({ style: [styles.td, styles.cellWhat] }, 'Макеты, итерации до утверждения'),
        T({ style: [styles.td, styles.cellWhen] }, '5–7 дней')
      ),
      V(
        { style: styles.tableRow },
        T({ style: [styles.td, styles.cellName] }, 'Разработка'),
        T({ style: [styles.td, styles.cellWhat] }, 'Код, интеграции, формы, аналитика'),
        T({ style: [styles.td, styles.cellWhen] }, '5–10 дней')
      ),
      V(
        { style: styles.tableRow },
        T({ style: [styles.td, styles.cellName] }, 'Приёмка и тесты'),
        T({ style: [styles.td, styles.cellWhat] }, 'Багфиксы, ваши правки, чек-листы'),
        T({ style: [styles.td, styles.cellWhen] }, '3–5 дней')
      ),
      V(
        { style: styles.tableRowLast },
        T({ style: [styles.td, styles.cellName] }, 'Запуск'),
        T({ style: [styles.td, styles.cellWhat] }, 'Деплой, домен, мониторинг'),
        T({ style: [styles.td, styles.cellWhen] }, '1 день')
      )
    ),
    T({ style: styles.h3 }, 'Красные флаги'),
    Bullet('«Готово за 3 дня» — это шаблон без вашей кастомизации', 'r1'),
    Bullet('«Точные сроки скажем после согласования дизайна» — значит будет ехать', 'r2'),
    Bullet('Нет упоминания приёмки и тестов — баги после запуска ваши', 'r3'),
    PageNum()
  )

const MistakesPage1 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 4 · Ошибки', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Часть 4'),
    T({ style: styles.h1 }, 'Типовые ошибки запуска'),

    T({ style: styles.h2 }, 'Ошибки заказчиков'),

    NumItem(
      1,
      'Тянуть с контентом',
      'Подрядчик не может верстать на «привет привет». Готовьте тексты, фото, цены ДО старта дизайна. Иначе сроки сдвинутся на вашу же сторону, а виновным окажетесь не вы.',
      'm1'
    ),
    NumItem(
      2,
      'Менять задачу посередине',
      '«Давайте ещё добавим раздел блога» — на этапе вёрстки это +неделя. На этапе тестов — переделывать всё. Фиксируйте scope ДО старта, новые хотелки — после релиза, отдельной фазой.',
      'm2'
    ),
    NumItem(
      3,
      'Согласовывать дизайн всей командой',
      'Пять человек в чате — пять разных мнений. Выберите одного ответственного, остальные пишут ему, он подрядчику. Иначе три недели правок и итоговый Франкенштейн.',
      'm3'
    ),
    NumItem(
      4,
      'Экономить на гарантии и тестах',
      'Сэкономили 200 BYN на приёмке — потеряете 2000 BYN на багах после запуска. Не сходится.',
      'm4'
    ),
    PageNum()
  )

const MistakesPage2 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 4 · Ошибки', 'BOT FACTORY'),

    T({ style: styles.h2 }, 'Ошибки подрядчиков — что подсвечивает риск'),

    NumItem(
      1,
      'Универсальные сметы',
      'Если ответ на ваш бриф пришёл в течение часа и стоит «как в среднем по рынку» — это шаблон. Хороший подрядчик задаёт уточняющие вопросы и берёт паузу на расчёт.',
      'p1'
    ),
    NumItem(
      2,
      'Дизайн без структуры',
      'Дают красивые макеты, но не объяснили, почему этот блок здесь, а не там. Скорее всего, «делали красиво», а конверсия после запуска будет плохой.',
      'p2'
    ),
    NumItem(
      3,
      'Договор на одну страницу или его отсутствие',
      'Серьёзный подрядчик защищает обе стороны: сроки, ответственность, гарантия, штрафы за срыв — всё в договоре. Если на этом этапе «давайте без бюрократии» — потом «бюрократия» будет вам очень нужна.',
      'p3'
    ),
    NumItem(
      4,
      'Нет SLA после запуска',
      'Сайт сделан и брошен. Кто чинит баги через две недели? Кто отвечает на «упало» в пятницу вечером? Эти вопросы задайте ДО оплаты, не после.',
      'p4'
    ),

    Callout(
      'Признак зрелой команды',
      'Подрядчик сам говорит «эта функция нам не нужна, вы потратите деньги впустую». Если у него все сделки — «да-да-да», он продаёт, а не строит. С такими через полгода жалко самого себя.'
    ),
    PageNum()
  )

const QuestionsPage = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 5 · Вопросы', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'Часть 5'),
    T({ style: styles.h1 }, 'Восемь вопросов подрядчику'),
    Para(
      'За 15 минут разговора по этому списку вы поймёте, можно ли с командой работать. Если на половину вопросов мнётся — ищите другую.'
    ),

    NumItem(1, 'Покажете 2–3 кейса из моей ниши?', 'Из вашей конкретной — необязательно. Из похожих по сложности — должны быть. Просите ссылки, не «отзывы клиентов».', 'v1'),
    NumItem(2, 'Как считаете цену? Откуда 1500 BYN, а не 800?', 'Прозрачная декомпозиция = адекватный подрядчик. «Это рыночная цена» = не объяснил, увидите проблемы и в работе.', 'v2'),
    NumItem(3, 'Что входит в стоимость, а что нет?', 'Контент, фото, иконки, домен, хостинг, поддержка — конкретно. Чтобы потом не «доплати ещё».', 'v3'),
    NumItem(4, 'Кто будет работать над проектом?', 'Имена. Один человек, команда из трёх? Если PM один, а реально делают пять разных фрилансеров — будут проблемы со связью.', 'v4'),
    PageNum()
  )

const QuestionsPage2 = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Часть 5 · Вопросы', 'BOT FACTORY'),

    NumItem(5, 'Какие гарантии в договоре?', 'Срок гарантии, что покрывает, что не покрывает. Должно быть письменно, не на словах.', 'v5'),
    NumItem(6, 'Что будет, если я попрошу правку через 2 недели после запуска?', 'Бесплатно? Платно? Сколько часов в месяц включено? Какой SLA на ответ?', 'v6'),
    NumItem(7, 'Как мы будем общаться?', 'Telegram-чат, Zoom раз в неделю, email — что-то структурированное. «Пишите когда удобно» = бардак через две недели.', 'v7'),
    NumItem(8, 'Что делать, если вы заболеете или уйдёте в отпуск?', 'Backup-человек, регламент. Если подрядчик — один фрилансер без подстраховки, ваш проект может застрять на месяц.', 'v8'),

    Callout(
      'Бонус',
      'После всех ответов попросите: «Покажите как у вас выглядит работа изнутри — Trello, Notion, Telegram-чат, что угодно». Если подрядчик показывает живой процесс — это уже половина успеха.'
    ),
    PageNum()
  )

const ClosingPage = () =>
  e(
    Page,
    { size: 'A4', style: styles.page },
    Header('Итог', 'BOT FACTORY'),
    T({ style: styles.partLabel }, 'А дальше'),
    T({ style: styles.h1 }, 'Если вы дочитали…'),
    Para(
      'Вы уже в топ-10% заказчиков. Большинство выбирают подрядчика по красивой главной странице и шаблонному «делаем сайты под ключ от 500 BYN». Этот чеклист — попытка изменить пропорции в нашей нише хотя бы на несколько процентов.'
    ),
    Para(
      'Если хочется обсудить ваш проект — мы в BOT FACTORY делаем сайты, Telegram-боты, Mini Apps и AI-интеграции для бизнеса в Минске и по Беларуси. Без шаблонов. С договором. С прозрачной сметой.'
    ),

    V(
      { style: styles.finalHero },
      T({ style: styles.finalTitle }, 'Получите промокод −5% за 3 минуты'),
      T(
        { style: styles.finalSub },
        'В нашем боте — короткий квиз. На выходе персональная рекомендация и промокод на ближайший проект.'
      ),
      V(
        { style: styles.contactGrid },
        V(
          { style: styles.contactItem },
          T({ style: styles.contactLabel }, 'Сайт'),
          T({ style: styles.contactValue }, 'botfactory.by')
        ),
        V(
          { style: styles.contactItem },
          T({ style: styles.contactLabel }, 'Бот'),
          T({ style: styles.contactValue }, '@botfactoryby_bot')
        ),
        V(
          { style: styles.contactItem },
          T({ style: styles.contactLabel }, 'Почта'),
          T({ style: styles.contactValue }, 'botfactoryby@gmail.com')
        ),
        V(
          { style: styles.contactItem },
          T({ style: styles.contactLabel }, 'Телефон'),
          T({ style: styles.contactValue }, '+375 44 541 48 68')
        )
      )
    ),

    T(
      { style: styles.legal },
      'ИП Шевелёв Е. В., УНП HE7170411 · Минск, Беларусь',
      '\n',
      'Этот документ — справочный, не оферта. Цены ориентировочные, итоговые — после брифа.'
    ),
    PageNum()
  )

// ─── Compose document ─────────────────────────────────────────────────

const Doc = () =>
  e(
    Document,
    { title: 'Чеклист запуска цифрового продукта', author: 'BOT FACTORY' },
    CoverPage(),
    IntroPage(),
    ChoosePage1(),
    ChoosePage2(),
    BriefPage1(),
    BriefPage2(),
    DeadlinesPage(),
    MistakesPage1(),
    MistakesPage2(),
    QuestionsPage(),
    QuestionsPage2(),
    ClosingPage()
  )

// ─── Render and write ─────────────────────────────────────────────────

async function main() {
  const out = join(__dirname, '..', 'public', 'botfactory-checklist.pdf')
  const stream = await pdf(e(Doc)).toBuffer()
  // toBuffer returns a stream — collect to Buffer
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
  }
  const buf = Buffer.concat(chunks)
  writeFileSync(out, buf)
  console.log(`✓ PDF written: ${out} (${(buf.length / 1024).toFixed(1)} KB)`)
}

main().catch((err) => {
  console.error('PDF generation failed:', err)
  process.exit(1)
})

// Минимальный валидный PDF-плейсхолдер для lead-magnet'а.
// Используется до подготовки финального контента «Чеклист запуска цифрового продукта».
// Сделан вручную (PDF 1.4, один шрифт Helvetica), без сторонних библиотек —
// чтобы не тащить pdfkit/puppeteer ради заглушки.
//
// Запуск: node scripts/generate-placeholder-pdf.mjs

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const lines = [
  ['/F1 24 Tf', 'BOT FACTORY'],
  ['/F1 14 Tf', 'Cheklist zapuska tsifrovogo produkta'],
  ['/F1 11 Tf', ''],
  ['/F1 11 Tf', 'Eto vremennyi PDF. Final\'naya versiya cheklista'],
  ['/F1 11 Tf', 'gotovitsya komandoy BOT FACTORY.'],
  ['/F1 11 Tf', ''],
  ['/F1 11 Tf', 'Chto budet vnutri:'],
  ['/F1 11 Tf', '  - Kak vybrat\' format: sayt / bot / mini-app / AI'],
  ['/F1 11 Tf', '  - Cheklist brifinga pered startom'],
  ['/F1 11 Tf', '  - Sroki i etapy proekta'],
  ['/F1 11 Tf', '  - Tipovye oshibki na zapuske'],
  ['/F1 11 Tf', '  - Voprosy podryadchiku'],
  ['/F1 11 Tf', ''],
  ['/F1 11 Tf', 'botfactory.by'],
  ['/F1 11 Tf', 'botfactoryby@gmail.com'],
]

function buildContentStream() {
  const parts = ['BT', '50 780 Td']
  let isFirst = true
  for (const [font, text] of lines) {
    parts.push(font)
    if (!isFirst) parts.push('0 -22 Td')
    parts.push(`(${text.replace(/\(/g, '\\(').replace(/\)/g, '\\)')}) Tj`)
    isFirst = false
  }
  parts.push('ET')
  return parts.join('\n')
}

const content = buildContentStream()
const contentLen = Buffer.byteLength(content, 'binary')

const objects = []
const offsets = [0]

function addObject(num, body) {
  const offset = chunks.reduce((acc, c) => acc + c.length, 0)
  offsets[num] = offset
  const obj = `${num} 0 obj\n${body}\nendobj\n`
  chunks.push(Buffer.from(obj, 'binary'))
}

const chunks = []
chunks.push(Buffer.from('%PDF-1.4\n%\xff\xff\xff\xff\n', 'binary'))

addObject(1, '<< /Type /Catalog /Pages 2 0 R >>')
addObject(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>')
addObject(
  3,
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>'
)
addObject(4, `<< /Length ${contentLen} >>\nstream\n${content}\nendstream`)
addObject(5, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')

const xrefOffset = chunks.reduce((acc, c) => acc + c.length, 0)

const xref = [
  'xref',
  `0 ${offsets.length}`,
  '0000000000 65535 f ',
  ...offsets.slice(1).map((o) => `${String(o).padStart(10, '0')} 00000 n `),
  '',
].join('\n')

const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

chunks.push(Buffer.from(xref, 'binary'))
chunks.push(Buffer.from(trailer, 'binary'))

const pdfBuf = Buffer.concat(chunks)
const out = join(process.cwd(), 'public', 'botfactory-checklist.pdf')
writeFileSync(out, pdfBuf)
console.log(`PDF placeholder written to ${out} (${pdfBuf.length} bytes)`)

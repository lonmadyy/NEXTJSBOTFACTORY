import 'server-only'
import type { Api } from 'grammy'
import { InputFile } from 'grammy'
import path from 'node:path'
import fs from 'node:fs'

const PDF_FILENAME = 'botfactory-checklist.pdf'

// На MVP PDF лежит в public/. В Vercel `process.cwd()` указывает на корень репо.
function getPdfPath(): string {
  return path.join(process.cwd(), 'public', PDF_FILENAME)
}

export async function sendChecklistPdf(
  api: Api,
  chatId: number,
  caption: string
): Promise<boolean> {
  const filePath = getPdfPath()
  if (!fs.existsSync(filePath)) {
    console.warn('[pdf-delivery] file not found at', filePath)
    return false
  }
  try {
    await api.sendDocument(chatId, new InputFile(filePath, PDF_FILENAME), {
      caption,
    })
    return true
  } catch (err) {
    console.error('[pdf-delivery] send failed:', err)
    return false
  }
}

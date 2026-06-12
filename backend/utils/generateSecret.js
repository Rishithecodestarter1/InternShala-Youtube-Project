import crypto from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { error, info, success } from './colorLog.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(currentDir, '..')
const envPath = resolve(backendDir, '.env')

function upsertEnvValue(content, key, value) {
  const lines = content ? content.split(/\r?\n/) : []
  const nextLine = `${key}="${value}"`
  const existingIndex = lines.findIndex((line) => line.trim().startsWith(`${key}=`))

  if (existingIndex >= 0) {
    lines[existingIndex] = nextLine
    return lines.join('\n')
  }

  return [...lines.filter((line, index) => index !== lines.length - 1 || line.trim() !== ''), nextLine].join('\n')
}

try {
  const jwtSecret = crypto.randomBytes(64).toString('hex')
  const existingContent = existsSync(envPath) ? readFileSync(envPath, 'utf8') : 'PORT=5000\nMONGO_URI="mongodb://127.0.0.1:27017/youtube-clone"\n'
  const nextContent = `${upsertEnvValue(existingContent, 'JWT_SECRET', jwtSecret)}\n`

  writeFileSync(envPath, nextContent)

  success('Your new JWT secret was generated successfully:')
  success(jwtSecret)
  info('Saved it to backend/.env. Keep this file private and never commit it to GitHub.')
} catch (secretError) {
  error(`Unable to generate JWT secret: ${secretError.message}`)
  process.exit(1)
}

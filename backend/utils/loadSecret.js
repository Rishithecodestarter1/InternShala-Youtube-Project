import dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const backendDir = resolve(currentDir, '..')

dotenv.config({ path: resolve(backendDir, '.env'), quiet: true })

export function getJWTSecret() {
  const secret = process.env.JWT_SECRET

  if (!secret || secret.trim().length === 0) {
    throw new Error('JWT_SECRET is missing. Run node backend/utils/generateSecret.js first.')
  }

  const normalizedSecret = secret.trim()

  if (normalizedSecret.length < 32) {
    throw new Error('JWT_SECRET is too short. Run node backend/utils/generateSecret.js to create a stronger secret.')
  }

  return normalizedSecret
}

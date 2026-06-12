import { getJWTSecret } from './loadSecret.js'
import { error, success, warn } from './colorLog.js'

try {
  const secret = getJWTSecret()
  const isHex = /^[0-9a-f]+$/i.test(secret)

  if (secret.length < 32) {
    error('JWT_SECRET is too short. Generate a new secret with at least 32 characters.')
    process.exit(1)
  }

  if (!isHex) {
    warn('JWT_SECRET exists and is long enough, but it is not a hex-only value.')
    process.exit(0)
  }

  success(`JWT_SECRET is ready. Length: ${secret.length} characters.`)
} catch (secretError) {
  error(secretError.message)
  process.exit(1)
}

// authMiddleware.js - Validates JWT tokens from Authorization headers and attaches decoded user data to req.user.
import jwt from 'jsonwebtoken'
import { warn } from '../utils/colorLog.js'
import { getJWTSecret } from '../utils/loadSecret.js'

export function protect(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    warn(`Blocked protected route without token: ${request.method} ${request.originalUrl}`)
    return response.status(401).json({ message: 'No token provided. Please sign in.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // The token payload is created during login and contains the user's id and username.
    request.user = jwt.verify(token, getJWTSecret())
    return next()
  } catch (_error) {
    warn(`Blocked protected route with invalid token: ${request.method} ${request.originalUrl}`)
    return response.status(401).json({ message: 'Invalid or expired token.' })
  }
}

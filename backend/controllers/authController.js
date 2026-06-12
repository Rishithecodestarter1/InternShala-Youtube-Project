// authController.js - Handles registration and login, including password hashing and JWT creation.
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { getJWTSecret } from '../utils/loadSecret.js'

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), username: user.username }, getJWTSecret(), {
    expiresIn: '7d',
  })
}

export async function registerUser(request, response, next) {
  try {
    const { username, email, password } = request.body
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!username || !normalizedEmail || !password) {
      return response.status(400).json({ message: 'Username, email, and password are required.' })
    }

    if (username.trim().length < 3) {
      return response.status(400).json({ message: 'Username must be at least 3 characters.' })
    }

    if (password.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return response.status(400).json({ message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    })

    const token = createToken(user)

    return response.status(201).json({
      token,
      userId: user._id.toString(),
      username: user.username,
      avatar: user.avatar,
      channels: user.channels,
    })
  } catch (error) {
    return next(error)
  }
}

export async function loginUser(request, response, next) {
  try {
    const { email, password } = request.body
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail || !password) {
      return response.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return response.status(400).json({ message: 'Invalid email or password.' })
    }

    const passwordMatches = await user.matchPassword(password)
    if (!passwordMatches) {
      return response.status(400).json({ message: 'Invalid email or password.' })
    }

    const token = createToken(user)

    return response.status(200).json({
      token,
      userId: user._id.toString(),
      username: user.username,
      avatar: user.avatar,
      channels: user.channels,
    })
  } catch (error) {
    return next(error)
  }
}

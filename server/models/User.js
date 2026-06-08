// User.js - Mongoose schema for registered users. Passwords are stored as bcrypt hashes, never plaintext.
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: '',
    },
    channels: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

// This helper keeps password comparison logic near the password schema.
userSchema.methods.matchPassword = function matchPassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User

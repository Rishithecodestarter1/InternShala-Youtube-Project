// AuthPage.jsx - Combined registration and login page with inline validation messages.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance.js'
import { useAuth } from '../hooks/useAuth.js'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function AuthPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!isLogin && form.username.trim().length < 3) nextErrors.username = 'Username must be at least 3 characters.'
    if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    if (!isLogin && form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords must match.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!validate()) return

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email: form.email, password: form.password })
        login(response.data)
        navigate('/')
      } else {
        await api.post('/auth/register', {
          username: form.username,
          email: form.email,
          password: form.password,
        })
        // Assignment requires switching to the login form after successful registration.
        setIsLogin(true)
        setMessage('Registration successful. Please log in.')
        setForm({ username: '', email: form.email, password: '', confirmPassword: '' })
      }
    } catch (apiError) {
      setErrors({ api: apiError.response?.data?.message || 'Authentication failed.' })
    }
  }

  return (
    <main className="auth-page">
      <section className="form-card">
        <Link className="site-logo auth-page__logo" to="/">
          <span className="site-logo__mark">▶</span>
          <span>youtube-clone</span>
        </Link>
        <div className="auth-tabs">
          <button className={isLogin ? 'auth-tabs__button auth-tabs__button--active' : 'auth-tabs__button'} type="button" onClick={() => setIsLogin(true)}>
            Sign In
          </button>
          <button className={!isLogin ? 'auth-tabs__button auth-tabs__button--active' : 'auth-tabs__button'} type="button" onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" value={form.username} onChange={handleChange} />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
          )}
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          {!isLogin && (
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}
          {errors.api && <p className="error-text">{errors.api}</p>}
          {message && <p className="success-text">{message}</p>}
          <button className="primary-button" type="submit">
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AuthPage

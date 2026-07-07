import { useState } from 'react'
import { loginUser, registerUser } from '../services/api'
import '../styles/loginModal.css'

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  // Login fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [username, setUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser({ email, password })

      if (data.user.role !== 'admin') {
        setError('This account does not have admin access.')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onLoginSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await registerUser({
        username,
        email: regEmail,
        phone,
        password: regPassword,
      })

      // New accounts register as role 'user' by default (per backend).
      // Log them in locally but flag that they won't have admin access
      // until someone promotes them in the database.
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      if (data.user.role !== 'admin') {
        setError('Account created, but it needs admin access before you can use the panel. Ask an existing admin to grant it.')
        setLoading(false)
        return
      }

      onLoginSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {mode === 'login' ? (
          <>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="modal-error">{error}</p>}
              <button type="submit" className="modal-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="modal-switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => switchMode('register')}>Register</button>
            </p>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              {error && <p className="modal-error">{error}</p>}
              <button type="submit" className="modal-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>
            <p className="modal-switch">
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>Login</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginModal
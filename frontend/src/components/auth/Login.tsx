import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../../store/api/authApi'
import { setCredentials } from '../../store/slices/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './Login.module.scss'

const RULES = {
  pass: { min: 6 }
}

const EMAIL = /^[^@]+@[^@]+\.[a-z]{2,}$/i

interface FormData {
  email: string
  password: string
}

interface ValidationErrors {
  email?: string
  password?: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  })
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < RULES.pass.min) {
      errors.password = `Password must be at least ${RULES.pass.min} characters`
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      }).unwrap()
      
      dispatch(setCredentials(response.data))
      
      // Redirection basée sur le rôle
      if (response.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>
        
        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={validationErrors.email ? styles.error : ''}
          />
          {validationErrors.email && (
            <span className={styles.errorMessage}>{validationErrors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={validationErrors.password ? styles.error : ''}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validationErrors.password && (
            <span className={styles.errorMessage}>{validationErrors.password}</span>
          )}
        </div>

        {error && 'data' in error && (
          <div className={styles.apiError}>
            {(error.data as { message?: string })?.message || 'An error occurred during login'}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className={styles.registerLink}>
          Don't have an account ?{' '}
          <span onClick={() => navigate('/auth/register')}>Register here</span>
        </p>
      </form>
    </div>
  )
}

export default Login 
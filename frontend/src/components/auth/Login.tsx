import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../../store/api/authApi'
import { setUser } from '../../store/slices/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './Login.module.scss'

interface FormData {
  email: string
  password: string
}

interface ValidationErrors {
  email?: string
  password?: string
}

// Constantes de validation
const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
    } else if (!VALIDATION_RULES.PASSWORD.PATTERN.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
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
      
      // console.log('Login response:', response)

      if (response.token) {
        localStorage.setItem('token', response.token)
        dispatch(setUser(response.data.user))
        // console.log('Token stored and user state updated:', response)
        navigate('/')
      } else {
        console.error('No token in response:', response)
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
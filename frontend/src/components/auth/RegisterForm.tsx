import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation, useLoginMutation } from '../../store/api/authApi'
import { setUser } from '../../store/slices/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './RegisterForm.module.scss'

// Constantes de validation
const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
}

// Regex pour la validation
const REGEX = {
  EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  PHONE: /^(\+\d{1,3}[- ]?)?\d{10}$/
}

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  newsletter: boolean
}

interface ValidationErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  phoneNumber?: string
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [register, { isLoading: isRegistering, error: registerError }] = useRegisterMutation()
  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    newsletter: true
  })
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (
      formData.username.length < VALIDATION_RULES.USERNAME.MIN_LENGTH ||
      formData.username.length > VALIDATION_RULES.USERNAME.MAX_LENGTH
    ) {
      errors.username = `Username must be between ${VALIDATION_RULES.USERNAME.MIN_LENGTH} and ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!REGEX.EMAIL.test(formData.email)) {
      errors.email = 'Please provide a valid email address'
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`
    } else if (!VALIDATION_RULES.PASSWORD.PATTERN.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Validation du numéro de téléphone (optionnel)
    if (formData.phoneNumber && !REGEX.PHONE.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please provide a valid phone number'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
      newsletter: formData.newsletter
    }

    try {
      await register(userData).unwrap()

      // After successful registration, automatically log in
      const loginResponse = await login({
        email: formData.email,
        password: formData.password
      }).unwrap()

      if (loginResponse.token) {
        localStorage.setItem('token', loginResponse.token)
        dispatch(setUser(loginResponse.data.user))
        navigate('/')
      }
    } catch (err: any) {
      // console.log('Request details:', {
      //   url: err?.request?.url,
      //   method: err?.request?.method,
      //   headers: err?.request?.headers,
      //   body: err?.request?.body
      // })
    }
  }

  return (
    <div className={styles.registerContainer}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>Create Account</h2>
        
        <div className={styles.formGroup}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className={validationErrors.username ? styles.error : ''}
          />
          {validationErrors.username && (
            <span className={styles.errorMessage}>{validationErrors.username}</span>
          )}
        </div>

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
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number (optional)"
            className={validationErrors.phoneNumber ? styles.error : ''}
          />
          {validationErrors.phoneNumber && (
            <span className={styles.errorMessage}>{validationErrors.phoneNumber}</span>
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

        <div className={styles.formGroup}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={validationErrors.confirmPassword ? styles.error : ''}
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <span className={styles.errorMessage}>{validationErrors.confirmPassword}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span className={styles.checkmark}></span>
            Subscribe to our newsletter
          </label>
        </div>

        {registerError && 'data' in registerError && (
          <div className={styles.apiError}>
            {(registerError.data as { message?: string })?.message || 'An error occurred during registration'}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isRegistering || isLoggingIn}
        >
          {isRegistering ? 'Creating Account...' : isLoggingIn ? 'Logging in...' : 'Sign Up'}
        </button>

        <p className={styles.loginLink}>
          Already have an account ?{' '}
          <span onClick={() => navigate('/auth/login')}>
            Login here
          </span>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm 
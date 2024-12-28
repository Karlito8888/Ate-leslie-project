import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useRegisterMutation, useLoginMutation } from '../../store/api/authApi'
import { setCredentials } from '../../store/slices/authSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styles from './RegisterForm.module.scss'

const RULES = {
  name: { min: 3, max: 50 },
  pass: { min: 6 }
}

const EMAIL = /^[^@]+@[^@]+\.[a-z]{2,}$/i
const PHONE = /^\+?[\d\s-]{10,}$/

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  phoneNumber: string
  newsletterSubscribed: boolean
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
    newsletterSubscribed: true
  })
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (
      formData.username.length < RULES.name.min ||
      formData.username.length > RULES.name.max
    ) {
      errors.username = `Username must be between ${RULES.name.min} and ${RULES.name.max} characters`
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!EMAIL.test(formData.email)) {
      errors.email = 'Please provide a valid email address'
    }
    
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < RULES.pass.min) {
      errors.password = `Password must be at least ${RULES.pass.min} characters`
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (formData.phoneNumber && !PHONE.test(formData.phoneNumber)) {
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
      ...(formData.phoneNumber && { mobileNumber: formData.phoneNumber }),
      newsletterSubscribed: formData.newsletterSubscribed
    }

    try {
      await register(userData).unwrap()

      // After successful registration, automatically log in
      const loginResponse = await login({
        email: formData.email,
        password: formData.password
      }).unwrap()

      dispatch(setCredentials(loginResponse.data))
      navigate('/')
    } catch (err) {
      console.error('Registration/Login failed:', err)
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
              name="newsletterSubscribed"
              checked={formData.newsletterSubscribed}
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
          {isRegistering ? 'Creating account...' : isLoggingIn ? 'Logging in...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm 
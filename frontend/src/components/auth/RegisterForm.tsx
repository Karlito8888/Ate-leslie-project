import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../store/api/authApi'
import { baseUrl } from '../../store/api/baseApi'
import styles from './RegisterForm.module.scss'

// Constantes de validation
const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  PASSWORD: {
    MIN_LENGTH: 6
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
  const [register, { isLoading, error }] = useRegisterMutation()
  
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
      console.log('Attempting to register with data:', userData)
      const result = await register(userData).unwrap()
      console.log('Registration response:', result)
      navigate('/auth/login')
    } catch (err) {
      console.error('Registration failed - Full error:', err)
      console.log('Request details:', {
        url: `${baseUrl}/api/auth/register`,
        method: 'POST',
        data: userData
      })
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
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={validationErrors.password ? styles.error : ''}
          />
          {validationErrors.password && (
            <span className={styles.errorMessage}>{validationErrors.password}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={validationErrors.confirmPassword ? styles.error : ''}
          />
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

        {error && 'data' in error && (
          <div className={styles.apiError}>
            {(error.data as { message?: string })?.message || 'An error occurred during registration'}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
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
import React, { useState, FormEvent } from 'react'
import styles from './ChatModal.module.scss'
import { TiMessages } from "react-icons/ti"

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
  submit?: string
}

const ChatModal: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Error sending message')
      }

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', message: '' })
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsExpanded(false)
        setSubmitSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      setErrors({ ...errors, submit: 'Error sending message' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for modified field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  return (
    <div className={styles.chatModal}>
      {!isExpanded && (
        <div 
          className={styles.chatButton}
          onClick={() => setIsExpanded(true)}
          aria-label="Contact us"
        >
          <TiMessages />
        </div>
      )}

      {isExpanded && (
        <div className={styles.chatContent}>
          <div className={styles.chatHeader}>
            <h4>Contact Us</h4>
            <button className={styles.closeButton} onClick={() => setIsExpanded(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
          {submitSuccess ? (
            <div className={styles.successMessage}>
              <p>Message sent successfully!</p>
              <p>We will get back to you as soon as possible.</p>
            </div>
          ) : (
            <form className={styles.chatForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={errors.name ? styles.error : ''}
                />
                {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
              </div>
              <div className={styles.formGroup}>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>
              <div className={styles.formGroup}>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={4}
                  className={errors.message ? styles.error : ''}
                />
                {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
              </div>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
              {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default ChatModal 
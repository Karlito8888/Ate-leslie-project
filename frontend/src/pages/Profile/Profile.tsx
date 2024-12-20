import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../store/slices/authSlice'
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../store/api/userApi'
import { UserInfo } from '../../types/user'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './Profile.module.scss'

// Types pour les différentes sections
interface Quote {
  id: string
  date: string
  service: string
  status: 'pending' | 'accepted' | 'rejected'
  details: string
  amount?: number
}

interface Project {
  id: string
  name: string
  startDate: string
  status: 'in_progress' | 'completed' | 'on_hold'
  description: string
  lastUpdate: string
}

interface Document {
  id: string
  name: string
  type: 'quote' | 'invoice' | 'contract'
  date: string
  downloadUrl: string
}

interface Appointment {
  id: string
  date: string
  time: string
  subject: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  read: boolean
}

const Profile: React.FC = () => {
  const user = useSelector(selectCurrentUser)
  const { data: userData, isLoading: isLoadingProfile, error: profileError } = useGetUserProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation()

  const [activeTab, setActiveTab] = useState<string>('quotes')
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    email: '',
    fullName: {
      firstName: '',
      fatherName: '',
      lastName: '',
      gender: 'male'
    },
    landlineNumber: '',
    mobileNumber: '',
    birthDate: '',
    newsletter: false,
    address: {
      unit: '',
      buildingName: '',
      streetNumber: '',
      streetName: '',
      poBox: '',
      district: '',
      city: '',
      emirate: ''
    }
  })

  useEffect(() => {
    if (userData) {
      setUserInfo({
        username: userData.username || '',
        email: userData.email || '',
        fullName: userData.fullName || {
          firstName: '',
          fatherName: '',
          lastName: '',
          gender: 'male'
        },
        landlineNumber: userData.landlineNumber || '',
        mobileNumber: userData.mobileNumber || '',
        birthDate: userData.birthDate || '',
        newsletter: userData.newsletterSubscribed,
        address: userData.address || {
          unit: '',
          buildingName: '',
          streetNumber: '',
          streetName: '',
          poBox: '',
          district: '',
          city: '',
          emirate: ''
        }
      })
    }
  }, [userData])

  // États pour les différentes sections
  const [quotes] = useState<Quote[]>([])
  const [projects] = useState<Project[]>([])
  const [documents] = useState<Document[]>([])
  const [appointments] = useState<Appointment[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')

  const formatDateInput = (value: string): string => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Add slashes automatically
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  }

  const isValidDate = (dateStr: string): boolean => {
    // Check if the format is correct
    if (!/^(\d{2})\/(\d{2})\/(\d{4})$/.test(dateStr)) return false

    // Extract day, month, and year
    const [day, month, year] = dateStr.split('/').map(Number)
    
    // Create a date object and verify the values
    const date = new Date(year, month - 1, day)
    return date.getDate() === day &&
           date.getMonth() === month - 1 &&
           date.getFullYear() === year &&
           year >= 1900 &&
           year <= new Date().getFullYear()
  }

  const formatDateForInput = (dateStr: string | undefined): string => {
    if (!dateStr) return ''
    if (dateStr.includes('-')) return dateStr // Already in YYYY-MM-DD format
    
    // Convert from DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dateStr.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const formatDateFromInput = (dateStr: string): string => {
    if (!dateStr) return ''
    if (dateStr.includes('/')) return dateStr // Already in DD/MM/YYYY format
    
    // Convert from YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  // Gestionnaires d'événements
  const handleNewAppointment = () => {
    // TODO: Implémenter la logique de prise de rendez-vous
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: user?.username || 'User',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (name === 'birthDate') {
      if (type === 'date') {
        // Handle date picker input
        setUserInfo(prev => ({
          ...prev,
          birthDate: formatDateFromInput(value)
        }))
      } else {
        // Handle manual text input
        const formattedDate = formatDateInput(value)
        if (formattedDate.length <= 10) {
          // Only update if the date is valid or incomplete
          if (formattedDate.length < 10 || isValidDate(formattedDate)) {
            setUserInfo(prev => ({
              ...prev,
              birthDate: formattedDate
            }))
          }
        }
      }
      return
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'address') {
        setUserInfo(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }))
      }
    } else {
      setUserInfo(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }))
    }
  }

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      fullName: {
        ...(prev.fullName || {}),
        [name]: value
      }
    }));
    
    // Log pour déboguer
    // console.log('Updated fullName:', {
    //   ...(userInfo.fullName || {}),
    //   [name]: value
    // });
  };

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert date format for submission
    const formData = { ...userInfo }
    if (formData.birthDate) {
      // Log the date before conversion
      // console.log('Original birth date:', formData.birthDate)
      
      // Convert from DD/MM/YYYY to a proper ISO date string
      const [day, month, year] = formData.birthDate.split('/')
      const date = new Date(Number(year), Number(month) - 1, Number(day))
      formData.birthDate = date.toISOString()
      
      // Log the date after conversion
      // console.log('Converted birth date:', formData.birthDate)
    }

    // Log pour déboguer
    // console.log('Submitting form data:', formData);

    try {
      await updateProfile(formData).unwrap()
      toast.success('Profile updated successfully', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      })
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error('Failed to update profile. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored"
      })
    }
  }

  if (isLoadingProfile || isUpdating) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.profileContainer}>
      <header className={styles.profileHeader}>
        <h1>Welcome, {user?.username}</h1>
        <p>Manage your projects and communications</p>
      </header>

      {profileError && <div className={styles.error}>Failed to load profile data</div>}

      <nav className={styles.tabsNav}>
        <button 
          className={activeTab === 'info' ? styles.active : ''} 
          onClick={() => setActiveTab('info')}
        >
          Infos
        </button>
        <button 
          className={activeTab === 'quotes' ? styles.active : ''} 
          onClick={() => setActiveTab('quotes')}
        >
          Quotes
        </button>
        <button 
          className={activeTab === 'projects' ? styles.active : ''} 
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button 
          className={activeTab === 'documents' ? styles.active : ''} 
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button 
          className={activeTab === 'appointments' ? styles.active : ''} 
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button 
          className={activeTab === 'messages' ? styles.active : ''} 
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </nav>

      <main className={styles.content}>
        {activeTab === 'info' && (
          <section className={styles.infoSection}>
            <h2>Personal Information</h2>
            <form onSubmit={handleUserInfoSubmit} className={styles.infoForm}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userInfo.username}
                  onChange={handleUserInfoChange}
                  placeholder="Your username"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.withSeparator}`}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleUserInfoChange}
                  placeholder="Your email address"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="landlineNumber">Landline Number</label>
                <input
                  type="tel"
                  id="landlineNumber"
                  name="landlineNumber"
                  value={userInfo.landlineNumber}
                  onChange={handleUserInfoChange}
                  placeholder="+971 4 234 5678"
                  pattern="\+971 [2-9] [2-8][0-9]{6}"
                  title="Please enter a valid UAE landline number format: +971 followed by area code (2-9) and 7 digits (second digit 2-8). Example: +971 4 234 5678"
                />
              </div>

              <div className={`${styles.formGroup} ${styles.withSeparator}`}>
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={userInfo.mobileNumber}
                  onChange={handleUserInfoChange}
                  placeholder="+971 50 123 4567"
                  pattern="\+971 5[024568] [0-9]{3} [0-9]{4}"
                  title="Please enter a valid UAE mobile number format: +971 followed by valid prefix (50, 52, 54, 55, 56, 58) and 7 digits. Example: +971 50 123 4567"
                />
              </div>

              <div className={`${styles.formGroup} ${styles.withSeparator}`}>
                <label htmlFor="birthDate">Birth Date</label>
                <div className={styles.dateInputWrapper}>
                  <input
                    type="text"
                    id="birthDateText"
                    name="birthDate"
                    value={userInfo.birthDate}
                    onChange={handleUserInfoChange}
                    placeholder="DD/MM/YYYY"
                    pattern="(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/([0-9]{4})"
                    title="Please enter a valid date in DD/MM/YYYY format"
                  />
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formatDateForInput(userInfo.birthDate)}
                    onChange={handleUserInfoChange}
                    min="1900-01-01"
                    max={new Date().toISOString().split('T')[0]}
                    className={styles.calendarInput}
                    lang="en"
                  />
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.withSeparator}`}>
                <h3 className={styles.nameTitle}>Full Name</h3>
                <div className={styles.nameFields}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={userInfo.fullName?.firstName || ''}
                        onChange={handleFullNameChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="fatherName">Father's Name (optional)</label>
                      <input
                        type="text"
                        id="fatherName"
                        name="fatherName"
                        value={userInfo.fullName?.fatherName || ''}
                        onChange={handleFullNameChange}
                        placeholder="Father's Name"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">Family Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={userInfo.fullName?.lastName || ''}
                        onChange={handleFullNameChange}
                        placeholder="Family Name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        value={userInfo.fullName?.gender || 'male'}
                        onChange={handleFullNameChange}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.withSeparator}`}>
                <h3 className={styles.addressTitle}>Address</h3>
                <div className={styles.addressFields}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="unit">Unit/Apartment Number</label>
                      <input
                        type="text"
                        id="unit"
                        name="address.unit"
                        value={userInfo.address?.unit || ''}
                        onChange={handleUserInfoChange}
                        placeholder="Unit/Apartment Number"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="buildingName">Building Name</label>
                      <input
                        type="text"
                        id="buildingName"
                        name="address.buildingName"
                        value={userInfo.address?.buildingName || ''}
                        onChange={handleUserInfoChange}
                        placeholder="Building Name"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="streetNumber">Street Number</label>
                      <input
                        type="text"
                        id="streetNumber"
                        name="address.streetNumber"
                        value={userInfo.address?.streetNumber || ''}
                        onChange={handleUserInfoChange}
                        placeholder="Street Number"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="streetName">Street Name</label>
                      <input
                        type="text"
                        id="streetName"
                        name="address.streetName"
                        value={userInfo.address?.streetName || ''}
                        onChange={handleUserInfoChange}
                        placeholder="Street Name"
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="poBox">P.O. Box (optional)</label>
                    <input
                      type="text"
                      id="poBox"
                      name="address.poBox"
                      value={userInfo.address?.poBox || ''}
                      onChange={handleUserInfoChange}
                      placeholder="P.O. Box"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="district">District</label>
                    <input
                      type="text"
                      id="district"
                      name="address.district"
                      value={userInfo.address?.district || ''}
                      onChange={handleUserInfoChange}
                      placeholder="District"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="address.city"
                        value={userInfo.address?.city || ''}
                        onChange={handleUserInfoChange}
                        placeholder="City"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="emirate">Emirate</label>
                      <select
                        id="emirate"
                        name="address.emirate"
                        value={userInfo.address?.emirate || ''}
                        onChange={handleUserInfoChange}
                      >
                        <option value="">Select an emirate</option>
                        <option value="AZ">Abu Dhabi (AD)</option>
                        <option value="DU">Dubai (DU)</option>
                        <option value="SH">Sharjah (SH)</option>
                        <option value="AJ">Ajman (AJ)</option>
                        <option value="FU">Fujairah (FU)</option>
                        <option value="RK">Ras Al Khaimah (RK)</option>
                        <option value="UQ">Umm Al Quwain (UQ)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={userInfo.newsletter}
                    onChange={handleUserInfoChange}
                  />
                  Subscribe to newsletter
                </label>
              </div>

              <button type="submit" className={styles.submitButton}>
                Save Changes
              </button>
            </form>
          </section>
        )}

        {activeTab === 'quotes' && (
          <section className={styles.quotesSection}>
            <h2>Quote Requests</h2>
            {quotes.length === 0 ? (
              <p className={styles.emptyState}>No quote requests yet</p>
            ) : (
              <div className={styles.quotesList}>
                {quotes.map(quote => (
                  <div key={quote.id} className={styles.quoteCard}>
                    <h3>{quote.service}</h3>
                    <p>Date: {new Date(quote.date).toLocaleDateString()}</p>
                    <p>Status: {quote.status}</p>
                    <p>{quote.details}</p>
                    {quote.amount && <p>Amount: ${quote.amount}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'projects' && (
          <section className={styles.projectsSection}>
            <h2>Projects History</h2>
            {projects.length === 0 ? (
              <p className={styles.emptyState}>No projects yet</p>
            ) : (
              <div className={styles.projectsList}>
                {projects.map(project => (
                  <div key={project.id} className={styles.projectCard}>
                    <h3>{project.name}</h3>
                    <p>Started: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>Status: {project.status}</p>
                    <p>{project.description}</p>
                    <p>Last update: {new Date(project.lastUpdate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'documents' && (
          <section className={styles.documentsSection}>
            <h2>Documents & Invoices</h2>
            {documents.length === 0 ? (
              <p className={styles.emptyState}>No documents available</p>
            ) : (
              <div className={styles.documentsList}>
                {documents.map(doc => (
                  <div key={doc.id} className={styles.documentCard}>
                    <h3>{doc.name}</h3>
                    <p>Type: {doc.type}</p>
                    <p>Date: {new Date(doc.date).toLocaleDateString()}</p>
                    <a href={doc.downloadUrl} download className={styles.downloadButton}>
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'appointments' && (
          <section className={styles.appointmentsSection}>
            <h2>Appointments</h2>
            <button 
              className={styles.newAppointmentButton}
              onClick={handleNewAppointment}
            >
              Schedule New Appointment
            </button>
            {appointments.length === 0 ? (
              <p className={styles.emptyState}>No appointments scheduled</p>
            ) : (
              <div className={styles.appointmentsList}>
                {appointments.map(appointment => (
                  <div key={appointment.id} className={styles.appointmentCard}>
                    <h3>{appointment.subject}</h3>
                    <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                    <p>Time: {appointment.time}</p>
                    <p>Status: {appointment.status}</p>
                    {appointment.notes && <p>Notes: {appointment.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'messages' && (
          <section className={styles.messagesSection}>
            <h2>Team Communication</h2>
            <div className={styles.messagesList}>
              {messages.length === 0 ? (
                <p className={styles.emptyState}>No messages yet</p>
              ) : (
                messages.map(message => (
                  <div key={message.id} className={styles.messageCard}>
                    <div className={styles.messageHeader}>
                      <span>{message.sender}</span>
                      <span>{new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                    <p>{message.content}</p>
                  </div>
                ))
              )}
            </div>
            <div className={styles.messageInput}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Profile 
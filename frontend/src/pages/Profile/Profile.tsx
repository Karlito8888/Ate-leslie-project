import React, { useState, useEffect } from 'react'
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/profileApi'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './Profile.module.scss'

interface UserInfo {
  username: string
  email: string
  mobileNumber: string
  landlineNumber: string
  newsletterSubscribed: boolean
}

const Profile: React.FC = () => {
  const { data: userData, isLoading: isLoadingProfile, error: profileError } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    email: '',
    mobileNumber: '',
    landlineNumber: '',
    newsletterSubscribed: false
  })

  useEffect(() => {
    if (userData) {
      setUserInfo({
        username: userData.username || '',
        email: userData.email || '',
        mobileNumber: userData.mobileNumber || '',
        landlineNumber: userData.landlineNumber || '',
        newsletterSubscribed: userData.newsletterSubscribed || false
      })
    }
  }, [userData])

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setUserInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value
    }))
  }

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(userInfo).unwrap()
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Failed to update profile:', err)
      toast.error('Failed to update profile')
    }
  }

  if (isLoadingProfile) {
    return <div>Loading...</div>
  }

  if (profileError) {
    return <div>Error loading profile</div>
  }

  return (
    <div className={styles.profileContainer}>
      <form onSubmit={handleUserInfoSubmit} className={styles.profileForm}>
        <h2>Profile Information</h2>
        
        <div className={styles.formGroup}>
          <input
            type="text"
            name="username"
            value={userInfo.username}
            onChange={handleUserInfoChange}
            placeholder="Username"
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            placeholder="Email"
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="tel"
            name="mobileNumber"
            value={userInfo.mobileNumber}
            onChange={handleUserInfoChange}
            placeholder="Mobile Number"
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="tel"
            name="landlineNumber"
            value={userInfo.landlineNumber}
            onChange={handleUserInfoChange}
            placeholder="Landline Number"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="newsletterSubscribed"
              checked={userInfo.newsletterSubscribed}
              onChange={handleUserInfoChange}
            />
            Subscribe to newsletter
          </label>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}

export default Profile 
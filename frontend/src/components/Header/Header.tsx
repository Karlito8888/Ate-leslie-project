import React from 'react'
import { useSelector } from 'react-redux'
import Logo from '../Logo/Logo'
import { selectCurrentUser } from '../../store/slices/authSlice'
import styles from './Header.module.scss'

interface HeaderProps {
  isFirstVisit: boolean
}

const Header: React.FC<HeaderProps> = ({ isFirstVisit }) => {
  const user = useSelector(selectCurrentUser)

  return (
    <header className={styles.header}>
      <Logo isFirstVisit={isFirstVisit} />
      {user && (
        <div className={styles.welcomeMessage}>
          <span>Hello {user.username} 👋</span>
        </div>
      )}
    </header>
  )
}

export default Header 
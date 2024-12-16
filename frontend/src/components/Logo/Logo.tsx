import React from 'react'
import styles from './Logo.module.scss'

interface LogoProps {
  isFirstVisit: boolean
}

const Logo: React.FC<LogoProps> = ({ isFirstVisit }) => {
  return (
    <div className={`${styles.logo} ${isFirstVisit ? styles.animate : ''}`}>
    </div>
  )
}

export default Logo 
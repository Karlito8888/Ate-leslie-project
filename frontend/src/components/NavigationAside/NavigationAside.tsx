import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { RiHome2Line, RiLogoutCircleLine } from "react-icons/ri"
import { IoIosImages } from "react-icons/io"
import { LuBriefcaseBusiness, LuUserRoundPen } from "react-icons/lu"
import { MdOutlineAdminPanelSettings } from "react-icons/md"
import { BsInfoSquare } from "react-icons/bs"
import { TiMessages } from "react-icons/ti"
import { FiUserPlus, FiLogIn } from "react-icons/fi"
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../../store/slices/authSlice'
import styles from './NavigationAside.module.scss'

interface NavigationAsideProps {
  isFirstVisit: boolean
}

const NavigationAside: React.FC<NavigationAsideProps> = ({ isFirstVisit }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const isAuthenticated = !!localStorage.getItem('token')
  const isAdmin = currentUser?.role === 'admin'

  console.log('NavigationAside - currentUser:', currentUser)
  console.log('NavigationAside - isAdmin:', isAdmin)
  console.log('NavigationAside - role:', currentUser?.role)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login')
  }

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        // Pas besoin de setIsExpanded car nous utilisons le hover
      }, 6000) // Synchronisé avec la modale de chargement
      return () => clearTimeout(timer)
    }
  }, [isFirstVisit])

  return (
    <aside 
      className={`
        ${styles.navigationAside} 
        ${isFirstVisit ? styles.animate : ''} 
      `}
    >
      <div className={styles.toggleButton}>
        {String.fromCharCode(11106)}
      </div>
      
      <nav className={styles.navigation}>
        <ul className={styles.mainNav}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ''}>
              <span className={styles.iconWrapper}>
                <RiHome2Line className={styles.icon} />
              </span>
              <span className={styles.linkText}>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/services" className={({ isActive }) => isActive ? styles.activeLink : ''}>
              <span className={styles.iconWrapper}>
                <LuBriefcaseBusiness className={styles.icon} />
              </span>
              <span className={styles.linkText}>Services</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/portfolio" className={({ isActive }) => isActive ? styles.activeLink : ''}>
              <span className={styles.iconWrapper}>
                <IoIosImages className={styles.icon} />
              </span>
              <span className={styles.linkText}>Events & Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? styles.activeLink : ''}>
              <span className={styles.iconWrapper}>
                <BsInfoSquare className={styles.icon} />
              </span>
              <span className={styles.linkText}>About</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => isActive ? styles.activeLink : ''}>
              <span className={styles.iconWrapper}>
                <TiMessages className={styles.icon} />
              </span>
              <span className={styles.linkText}>Contact</span>
            </NavLink>
          </li>
        </ul>
        
        <ul className={styles.authNav}>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink 
                  to={isAdmin ? "/admin" : "/profile"} 
                  className={({ isActive }) => isActive ? styles.activeLink : ''}
                >
                  <span className={styles.iconWrapper}>
                    {isAdmin ? <MdOutlineAdminPanelSettings className={styles.icon} /> : <LuUserRoundPen className={styles.icon} />}
                  </span>
                  <span className={styles.linkText}>{isAdmin ? 'Dashboard' : 'Profile'}</span>
                </NavLink>
              </li>
              <li>
                <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <span className={styles.iconWrapper}>
                    <RiLogoutCircleLine className={styles.icon} />
                  </span>
                  <span className={styles.linkText}>Logout</span>
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/auth/register" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                  <span className={styles.iconWrapper}>
                    <FiUserPlus className={styles.icon} />
                  </span>
                  <span className={styles.linkText}>Sign Up</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/auth/login" className={({ isActive }) => isActive ? styles.activeLink : ''}>
                  <span className={styles.iconWrapper}>
                    <FiLogIn className={styles.icon} />
                  </span>
                  <span className={styles.linkText}>Login</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default NavigationAside 
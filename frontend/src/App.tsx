import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import NavigationAside from './components/NavigationAside/NavigationAside'
import LoadingModal from './components/LoadingModal/LoadingModal'
import styles from './App.module.scss'

const App: React.FC = () => {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedHome')
    
    if (!hasVisited) {
      const timer = setTimeout(() => {
        localStorage.setItem('hasVisitedHome', 'true')
        setIsFirstVisit(false)
      }, 6000)

      return () => clearTimeout(timer)
    } else {
      setIsFirstVisit(false)
    }
  }, [])

  return (
    <div className={styles.app}>
      {isFirstVisit && <LoadingModal />}
      <Header isFirstVisit={isFirstVisit} />
      <NavigationAside isFirstVisit={isFirstVisit} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  )
}

export default App 
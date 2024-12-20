import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header'
import NavigationAside from './components/NavigationAside/NavigationAside'
import LoadingModal from './components/LoadingModal/LoadingModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles/globals/_toast.scss'
import styles from './App.module.scss'
import Footer from './components/Footer/Footer'

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isFirstVisit && <LoadingModal />}
      <Header isFirstVisit={isFirstVisit} />
      <NavigationAside isFirstVisit={isFirstVisit} />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App 
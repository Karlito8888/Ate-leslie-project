import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { store } from './store/store.ts'
import App from './App'
import Home from './pages/Home/Home'
import RegisterForm from './components/auth/RegisterForm'
import Login from './components/auth/Login'
import Services from './pages/Services/Services'
import Portfolio from './pages/Portfolio/Portfolio'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Profile from './pages/Profile/Profile'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import './styles/main.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/auth/register',
        element: <RegisterForm />,
      },
      {
        path: '/auth/login',
        element: <Login />,
      },
      {
        path: '/services',
        element: <Services />,
      },
      {
        path: '/portfolio',
        element: <Portfolio />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
) 

import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetLinkSentPage from '../pages/ResetLinkSentPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import ProtectedRoute from './ProtectedRoute'
import { logout } from '../utils/logout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/get-started',
    element: <RegisterPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: (
          <>
            <div>Dashboard Page</div>
            <button onClick={logout}>Test Logout</button>
          </>
        ),
      },
    ],
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
{
  path: '/reset-link-sent',
    element: <ResetLinkSentPage />,
  },
{
  path: '/reset-password',
    element: <ResetPasswordPage />,
  },
])

export default router

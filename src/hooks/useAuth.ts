
import { useState } from 'react'
import axios from 'axios'
import {
  loginRequest,
  registerRequest,
  forgotPasswordRequest,
  resetPasswordRequest,
} from '../services/authService'

function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (email: string, password: string) => {
    setError('')
    setIsLoading(true)

    try {
      const { access_token, refresh_token } = await loginRequest({
        email: email.trim(),
        password,
      })

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      return true
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Invalid email or password.')
        } else if (err.response) {
          setError('Login failed. Please try again.')
        } else {
          setError('Unable to connect to the server. Please try again.')
        }
      } else {
        setError('Login failed. Please try again.')
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setError('')
    setIsLoading(true)

    try {
      await registerRequest({
        username: username.trim(),
        email: email.trim(),
        password,
      })

      return true
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError('An account with this email already exists.')
        } else if (err.response) {
          const detail = err.response.data?.detail

          if (Array.isArray(detail)) {
            setError(
              detail
                .map((item: { msg?: string }) => item.msg ?? 'Invalid input.')
                .join(' '),
            )
          } else {
            setError(
              'Registration failed. Please check your details and try again.',
            )
          }
        } else {
          setError('Unable to connect to the server. Please try again.')
        }
      } else {
        setError('Unable to connect to the server. Please try again.')
      }

      return false
    } finally {
      setIsLoading(false)
    }
  }

  
  const forgotPassword = async (email: string) => {
    setError('')
    setIsLoading(true)

    try {
      await forgotPasswordRequest({ email: email.trim() })
      return true
    } catch {
      setError(
        'We could not process your request right now. Please try again.',
      )
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    setError('')
    setIsLoading(true)

    try {
      await resetPasswordRequest({
        reset_token: token,
        new_password: newPassword,
      })
      return true
    } catch (caughtError: unknown) {
      const responseData = axios.isAxiosError(caughtError)
        ? caughtError.response?.data
        : undefined

      const detail = responseData?.detail
      const message =
        typeof detail === 'string'
          ? detail
          : detail?.error?.message

      setError(
        message ||
          'We could not reset your password. The link may have expired. Please request a new one.',
      )
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
  login,
  register,
  forgotPassword,
  resetPassword,
  isLoading,
  error,
  setError,
}
}

export default useAuth

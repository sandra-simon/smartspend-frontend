
import api from './api'

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    refresh_token: string
}

export async function loginRequest(
    credentials: LoginRequest,
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials,
    )

    return response.data
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export async function registerRequest(
  details: RegisterRequest,
): Promise<void> {
  await api.post('/auth/register', details)
}


export interface ForgotPasswordRequest {
  email: string
}

export async function forgotPasswordRequest(
  details: ForgotPasswordRequest,
): Promise<void> {
  await api.post('/auth/forgot-password', details)
}

export interface ResetPasswordRequest {
  reset_token: string
  new_password: string
}

export async function resetPasswordRequest(
  details: ResetPasswordRequest,
): Promise<void> {
  await api.post('/auth/password', details)
}

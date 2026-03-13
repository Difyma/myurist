import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          })
          return false
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/register', userData)
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          })
          return false
        }
      },

      demoLogin: async (email) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/demo', { email })
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return true
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Demo login failed',
            isLoading: false,
          })
          return false
        }
      },

      requestOTP: async (email) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/otp/request', { email })
          set({ isLoading: false })
          return { success: true, message: data.message }
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to send OTP',
            isLoading: false,
          })
          return { success: false, error: error.response?.data?.message }
        }
      },

      verifyOTP: async (email, code) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post('/auth/otp/verify', { email, code })
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
          return { success: true }
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Invalid verification code',
            isLoading: false,
          })
          return { success: false, error: error.response?.data?.message }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
        delete api.defaults.headers.common['Authorization']
      },

      clearError: () => set({ error: null }),

      initAuth: () => {
        const token = get().token
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      },
    }),
    {
      name: 'legalflow-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

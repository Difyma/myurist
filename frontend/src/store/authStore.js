import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../services/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state from Supabase session
      initAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          set({
            user: session.user,
            token: session.access_token,
            isAuthenticated: true,
          })
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            set({
              user: session.user,
              token: session.access_token,
              isAuthenticated: true,
            })
          } else if (event === 'SIGNED_OUT') {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            })
          }
        })
      },

      // Send OTP to email
      sendOTP: async (email) => {
        set({ isLoading: true, error: null })
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
            },
          })

          if (error) throw error

          set({ isLoading: false })
          return { success: true, message: 'Код отправлен на ваш email' }
        } catch (error) {
          set({
            error: error.message || 'Ошибка отправки кода',
            isLoading: false,
          })
          return { success: false, error: error.message }
        }
      },

      // Verify OTP
      verifyOTP: async (email, token) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
          })

          if (error) throw error

          set({
            user: data.user,
            token: data.session.access_token,
            isAuthenticated: true,
            isLoading: false,
          })

          return { success: true }
        } catch (error) {
          set({
            error: error.message || 'Неверный код подтверждения',
            isLoading: false,
          })
          return { success: false, error: error.message }
        }
      },

      // Logout
      logout: async () => {
        await supabase.auth.signOut()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'legalflow-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
)

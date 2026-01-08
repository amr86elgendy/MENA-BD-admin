import { create } from 'zustand'
import type { TLoginResponse } from '@/apis/auth'

type TAuthState = {
  accessToken: string | null
  isAuthenticated: boolean
  authenticateUser: (data: TLoginResponse) => void
  logUserOut: () => void
}

export const useAuthStore = create<TAuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,
  authenticateUser: (data: TLoginResponse) =>
    set(() => ({
      isAuthenticated: true,
      accessToken: data.accessToken,
    })),
  logUserOut: () => set(() => ({ accessToken: null, isAuthenticated: false })),
}))

export function getAccessTokenFromStore() {
  return useAuthStore.getState().accessToken
}
export function getIsAuthenticatedFromStore() {
  return useAuthStore.getState().isAuthenticated
}

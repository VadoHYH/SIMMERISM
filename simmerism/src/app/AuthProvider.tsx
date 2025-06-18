// src/app/AuthProvider.tsx
'use client'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [setUser])

  return <>{children}</>
}

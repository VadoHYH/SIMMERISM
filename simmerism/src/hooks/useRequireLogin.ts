// hooks/useRequireLogin.ts
"use client"

import { useAuthStore } from '@/stores/useAuthStore'
import { useLoginModal } from "@/context/LoginModalContext"

export const useRequireLogin = () => {
  const user = useAuthStore((state) => state.user)
  const { openModal } = useLoginModal()

  return (callback: () => void) => {
    if (user) {
      callback()
    } else {
      alert("請先登入才能使用此功能！")
      openModal("login") // 顯示登入 Modal
    }
  }
}

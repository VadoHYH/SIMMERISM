// hooks/useRequireLogin.ts
"use client"

import { useAuth } from "@/context/AuthContext"
import { useLoginModal } from "@/context/LoginModalContext"

export const useRequireLogin = () => {
  const { user } = useAuth()
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

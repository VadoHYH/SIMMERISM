// components/FogotPasswordModal.tsx
"use client"

import { Dialog } from "@headlessui/react"
import { useState } from "react"

export default function FogotPasswordModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password reset requested for:", email)
    setIsSubmitted(true)
    // 這邊可以加上 Firebase 登入、API call 等
    onClose() // 成功登入後關閉 modal
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <Dialog.Panel className="relative bg-[#f9f5f1] p-8 rounded shadow-lg w-full max-w-md ">
        {/* 陰影效果 */}
        <div className="absolute top-2 left-2 w-full h-full bg-black rounded -z-10"></div>

        <h1 className="text-2xl font-bold text-center mb-6">忘記密碼</h1>

        {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
            <div className="mb-6">
                <label htmlFor="email" className="block mb-2">
                電子信箱
                </label>
                <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-[#ff6347] text-white py-2 rounded font-medium hover:bg-[#e55a40] transition-colors"
            >
                發送重設密碼郵件
            </button>
            </form>
        ) : (
            <div className="text-center py-4">
            <p className="mb-4">重設密碼郵件已發送至 {email}</p>
            <p className="text-sm text-gray-600">請檢查您的郵箱並按照指示重設密碼</p>
            </div>
        )}

        <div className="mt-4 text-center">
        <button
            onClick={onSwitchToLogin}
            className="text-blue-500 font-medium"
          >
            返回登入頁面
          </button>
        </div>

        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg">
          ✕
        </button>
      </Dialog.Panel>
    </Dialog>
  )
}

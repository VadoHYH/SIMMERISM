// components/LoginModal.tsx
"use client"

import { Dialog } from "@headlessui/react"
import Link from "next/link"
import { useState } from "react"

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSwitchToForgotPassword,
}: {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
  onSwitchToForgotPassword: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password })
    // 這邊可以加上 Firebase 登入、API call 等
    onClose() // 成功登入後關閉 modal
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <Dialog.Panel className="relative bg-[#f9f5f1] p-8 rounded shadow-lg w-full max-w-md z-1">
        {/* 陰影效果 */}
        <div className="absolute top-2 left-2 w-full h-full bg-black rounded -z-10"></div>

        <h1 className="text-2xl font-bold text-center mb-6">登入帳號</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
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

          <div className="mb-6">
            <div className="flex justify-between mb-2">
                <label htmlFor="password">密碼</label>
                <button
                    type="button"
                    onClick={onSwitchToForgotPassword}
                    className="text-sm text-blue-500 hover:underline"
                >
                    忘記密碼？
                </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffc278] py-2 rounded font-medium hover:bg-[#ffb058] transition-colors"
          >
            登入
          </button>
        </form>

        <div className="mt-4 text-center">
            <span className="text-gray-600">還沒有帳號?</span>{" "}
            <button
            onClick={onSwitchToRegister}
            className="text-blue-500 font-medium"
          >
            立即註冊
          </button>
        </div>

        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg">
          ✕
        </button>
      </Dialog.Panel>
    </Dialog>
  )
}

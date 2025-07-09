// components/ForgotPasswordModal.tsx
"use client"

import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { FirebaseError } from "firebase/app"

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await sendPasswordResetEmail(auth, email)
      console.warn("重設密碼信已發送 ✅", email)
      setIsSubmitted(true)
      setTimeout(() => onClose(), 3000)
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        console.error("發送重設密碼郵件失敗 ❌", err.code, err.message) // 使用 console.error
        // 根據 Firebase 錯誤碼給出更友好的提示
        switch (err.code) {
          case "auth/user-not-found":
            setError("此電子信箱未註冊。")
            break;
          case "auth/invalid-email":
            setError("電子信箱格式不正確。")
            break;
          case "auth/missing-email":
            setError("請輸入電子信箱。")
            break;
          default:
            setError("發送失敗，請稍後再試。")
            break;
        }
      } else if (err instanceof Error) {
        console.error("發送重設密碼郵件失敗 ❌", err.message) // 使用 console.error
        setError("發生未知錯誤，請稍後再試。")
      } else {
        console.error("發送重設密碼郵件失敗 ❌", err) // 使用 console.error
        setError("發生未知錯誤，請稍後再試。")
      }
    }
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

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

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

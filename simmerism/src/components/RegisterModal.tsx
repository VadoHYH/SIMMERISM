// components/RegisterModal.tsx
"use client"

import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { auth } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { updateProfile } from "firebase/auth"
import { FirebaseError } from "firebase/app" 

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setRegisterError("密碼與確認密碼不一致，請重新輸入。"); 
      return
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, {
        displayName: name,
      })
      console.warn("註冊成功", userCredential.user.email); 
      onClose()
    } catch (err: unknown) { 
      if (err instanceof FirebaseError) {
        console.error("註冊失敗", err.code, err.message) 

        switch (err.code) {
          case "auth/email-already-in-use":
            setRegisterError("此電子信箱已被註冊，請改用其他信箱！")
            break;
          case "auth/weak-password":
            setRegisterError("密碼太簡單，請至少輸入六個字元！")
            break;
          case "auth/invalid-email":
            setRegisterError("電子信箱格式錯誤！")
            break;
          default:
            setRegisterError("註冊失敗，請稍後再試。")
            break;
        }
      } else if (err instanceof Error) {
        console.error("註冊失敗", err.message) 
        setRegisterError("發生未知錯誤，請稍後再試。")
      } else {
        console.error("註冊失敗", err) 
        setRegisterError("發生未知錯誤，請稍後再試。")
      }
    }
  }
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <Dialog.Panel className="relative bg-[#f9f5f1] p-8 rounded shadow-lg w-full max-w-md ">
        {/* 陰影效果 */}
        <div className="absolute top-2 left-2 w-full h-full bg-black rounded -z-10"></div>

        <h1 className="text-2xl font-bold text-center mb-6">註冊帳號</h1>

        <form onSubmit={handleSubmit}>
            <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
                姓名
            </label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            </div>

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
            <label htmlFor="password" className="block mb-2">
                密碼
            </label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            </div>

            <div className="mb-6">
            <label htmlFor="password" className="block mb-2">
                確認密碼
            </label>
            <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            </div>

            {registerError && (
              <p className="text-red-500 text-sm mb-4 text-center">{registerError}</p>
            )}

            <button
            type="submit"
            className="w-full bg-[#ffc278] py-2 rounded font-medium hover:bg-[#ffb058] transition-colors"
            >
            註冊
            </button>
        </form>

        <div className="mt-4 text-center">
            <span className="text-gray-600">已有帳號?</span>{" "}
            <button
            onClick={onSwitchToLogin}
            className="text-blue-500 font-medium"
          >
            立即登入
          </button>
        </div>

        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg">
          ✕
        </button>
      </Dialog.Panel>
    </Dialog>
  )
}

// components/LoginModal.tsx
"use client"

import { Dialog } from "@headlessui/react"
import { useState } from "react"
import { auth, googleProvider } from "@/lib/firebase"
import { signInWithEmailAndPassword, signInWithPopup,setPersistence ,browserLocalPersistence, inMemoryPersistence } from "firebase/auth"

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
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // ✅ 根據是否記住來設定持久化方式
      await setPersistence(auth, rememberMe ? browserLocalPersistence : inMemoryPersistence)
  
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("登入成功 ✅", userCredential.user)
      onClose()
    } catch (error: any) {
      console.error("登入失敗 ❌", error.message)
      alert("登入失敗，請檢查帳號密碼！")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : inMemoryPersistence); // 新增這行
  
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google 登入成功 ✅", user);
      onClose();
    } catch (error: any) {
      console.error("Google 登入失敗 ❌", error.message);
      alert("Google 登入失敗，請稍後再試");
    }
  };

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
                        className="text-sm text-[#ff6347] hover:underline"
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
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-700">記住我（保持登入）</label>
            </div>

            <button
                type="submit"
                className="w-full bg-[#ffc278] py-2 rounded font-medium hover:bg-[#ffb058] transition-colors"
            >
                登入
            </button>
            <button
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-gray-300 text-black py-2 rounded mt-4 hover:bg-gray-100"
                >
                以 Google 登入
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

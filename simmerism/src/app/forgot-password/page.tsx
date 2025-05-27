"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log("Password reset requested for:", email)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Shadow effect with offset */}
          <div className="absolute top-2 left-2 w-full h-full bg-black rounded"></div>

          {/* Main form container */}
          <div className="relative bg-white p-8 rounded shadow-lg">
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
              <Link href="/login" className="text-blue-500 font-medium">
                返回登入頁面
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

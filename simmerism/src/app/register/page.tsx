"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt with:", { name, email, password })
  }

  return (
    <div className="min-h-screen bg-[#f9f5f1] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Shadow effect with offset */}
          <div className="absolute top-2 left-2 w-full h-full bg-black rounded"></div>

          {/* Main form container */}
          <div className="relative bg-white p-8 rounded shadow-lg">
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

              <button
                type="submit"
                className="w-full bg-[#ffc278] py-2 rounded font-medium hover:bg-[#ffb058] transition-colors"
              >
                註冊
              </button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-gray-600">已有帳號?</span>{" "}
              <Link href="/login" className="text-blue-500 font-medium">
                立即登入
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"
import ForgetPasswordModal from "./ForgetPasswordModal" 
import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase" 

export default function Header() {
  const pathname = usePathname()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const switchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
    
  }

  const onSwitchToLogin = () => {
    setIsLoginOpen(true)
    setIsRegisterOpen(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("登出失敗", error)
    }
  }

  return (
    <header className="flex w-full border-2 border-black">
      <div className="flex items-center justify-center border-r border-black p-4 min-w-[100px] bg-[#F9F4EF]">
        <Link href="/" className="font-bold text-lg whitespace-nowrap">
          Simmer<span className="text-[#FB7659]">ism</span>
        </Link>
      </div>
      <nav className="flex flex-1">
        <Link
          href="/search"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/search" ? "bg-[#519181] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          查詢
        </Link>
        <Link
          href="/collection"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/collection" ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          收藏
        </Link>
        <Link
          href="/menu"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/menu" ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          菜單
        </Link>
        <Link
          href="/food-diary"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/food-diary" ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          食記
        </Link>
        <Link
          href="/shopping"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/shopping" ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          採購
        </Link>
        <Link
          href="/questions"
          className={`border-r border-black p-4 text-center transition-colors flex-1 ${
            pathname === "/questions" ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
          }`}
        >
          問問廚娘
        </Link>
      </nav>
      <div className="flex items-center justify-center p-4 bg-[#231f20] text-white min-w-[100px]">
        {user ? (
            <button onClick={handleSignOut} className="font-bold text-[#ff6347]">
              Sign out
            </button>
          ) : (
            <button onClick={() => setIsLoginOpen(true)} className="font-bold">
              Sign In !
            </button>
        )}

        {/* 彈跳視窗登入表單 */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={switchToRegister}
          onSwitchToForgotPassword={() => {
            setIsLoginOpen(false)
            setIsForgotPasswordOpen(true)
          }}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false)
          setIsLoginOpen(true)
          }}
        />

        <ForgetPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          onSwitchToLogin={() => {
            setIsForgotPasswordOpen(false)
            setIsLoginOpen(true)
          }}
        />
      </div>
    </header>
  )
}

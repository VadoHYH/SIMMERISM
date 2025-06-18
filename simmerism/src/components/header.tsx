"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLoginModal } from "@/context/LoginModalContext"
import NavItem from "@/components/NavItem" // 這是你剛寫好的 component

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const { openModal } = useLoginModal()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

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
        <NavItem path="/search" label="查詢" />
        <NavItem path="/collection" label="收藏" requireAuth />
        <NavItem path="/schedule" label="行程" requireAuth />
        <NavItem path="/shopping" label="採購" requireAuth />
        <NavItem path="/questions" label="問問廚娘" />
      </nav>
      <div className="flex items-center justify-center p-4 bg-[#231f20] text-white min-w-[100px]">
        {user ? (
          <button onClick={handleSignOut} className="font-bold text-[#ff6347]">
            Sign out
          </button>
        ) : (
          <button onClick={() => openModal("login")} className="font-bold">
            Sign In !
          </button>
        )}
      </div>
    </header>
  )
}

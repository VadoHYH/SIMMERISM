//components/header.tsx
"use client"

import Link from "next/link"
import { useState } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useLoginModal } from "@/context/LoginModalContext"
import NavItem from "@/components/NavItem"
import { useAuthStore } from "@/stores/useAuthStore"
import { Menu, X } from "lucide-react"

export default function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openModal } = useLoginModal()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      logout()
    } catch (error) {
      console.error("登出失敗", error)
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex w-full border-2 border-black">
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

      {/* Mobile Header */}
      <header className="md:hidden border-2 border-black bg-[#F9F4EF]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="font-bold text-xl">
            Simmer<span className="text-[#ff6347]">ism</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border-2 border-black bg-[#ffc278] rounded"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t-2 border-black bg-[#F9F4EF]">
            <nav className="flex flex-col">
              <NavItem path="/search" label="查詢" />
              <NavItem path="/collection" label="收藏" requireAuth />
              <NavItem path="/schedule" label="行程" requireAuth />
              <NavItem path="/shopping" label="採購" requireAuth />
              <NavItem path="/questions" label="問問廚娘" />
              {user ? (
                <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="p-4 text-center bg-[#231f20] text-white font-bold">
                  Sign out
                </button>
              ) : (
                <button onClick={() => { openModal("login"); setIsMobileMenuOpen(false); }} className="p-4 text-center bg-[#231f20] text-white font-bold">
                  Sign In !
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

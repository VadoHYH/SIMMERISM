import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ChatButton from "@/components/ChatButton"
import AuthProvider from '@/app/AuthProvider'
import { LoginModalProvider } from "@/context/LoginModalContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simmerism",
  description: "美味食譜查詢平台",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <AuthProvider>
          <LoginModalProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <ChatButton />
            </div>
          </LoginModalProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

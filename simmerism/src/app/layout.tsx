import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatButton from "@/components/chatButton"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simmerism",
  description: "美味食譜分享平台",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatButton />
        </div>
      </body>
    </html>
  )
}

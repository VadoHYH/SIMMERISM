"use client"

import { useState } from "react"
import { Send, Wrench } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function QuestionsPage() {
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#4169e1] rounded p-6">
            <h1 className="text-3xl font-bold mb-8 text-white">問問廚娘</h1>

            <div className="bg-white rounded p-4 h-80 mb-4">{/* Chat messages would go here */}</div>

            <div className="flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="來跟廚娘討論食譜吧..."
                className="flex-1 p-3 border border-gray-300 rounded-l focus:outline-none"
              />
              <button className="bg-[#ffc278] border border-black p-3 rounded-r flex items-center justify-center">
                發送 <Send size={18} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Wrench size={20} className="mr-2" />
                <h2 className="text-lg font-bold">為您推薦</h2>
              </div>

              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Link href={`/recipe/${i}`} key={i} className="block">
                      <div className="flex border border-gray-200 rounded overflow-hidden">
                        <div className="w-1/2 bg-gray-200 aspect-square relative">
                          <Image
                            src="/placeholder.svg?height=150&width=150"
                            alt="日式照燒雞腿飯"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="w-1/2 bg-[#ffc278] p-2">
                          <h3 className="font-bold text-sm">日式照燒雞腿飯</h3>
                          <div className="flex items-center text-xs mt-1">
                            <Clock size={12} className="mr-1" />
                            <span>30 分鐘</span>
                          </div>
                          <div className="flex items-center text-xs mt-1">
                            <Users size={12} className="mr-1" />
                            <span>2 人份</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              <p className="text-sm mt-4 text-center">
                想獲取更多個性化推薦？
                <br />
                告訴廚娘您的喜好和飲食需求
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

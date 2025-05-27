"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MenuPage() {
  const [currentDate, setCurrentDate] = useState("2025年5月15日")

  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">本日菜單</h1>

        <div className="flex justify-between items-center mb-8">
          <button className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center">
            <ChevronLeft size={18} className="mr-1" /> 前一天
          </button>

          <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold">{currentDate}</div>

          <button className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center">
            後一天 <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        <div className="space-y-8">
          {/* 早餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              早
            </div>

            <div className="flex items-center border-b border-gray-200 py-3">
              <div className="w-12 h-12 bg-gray-200 mr-4"></div>
              <div className="flex-1">
                <span>法式吐司</span>
                <span className="text-sm text-gray-500 ml-4">20分鐘</span>
              </div>
              <button className="bg-[#ff6347] text-white p-1 mr-2">
                <span className="sr-only">刪除</span>
                <span>刪</span>
              </button>
              <button className="bg-purple-200 border border-purple-500 p-1">
                <span className="text-purple-700 text-sm">查看配方</span>
              </button>
            </div>
          </div>

          {/* 中餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              中
            </div>

            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center border-b border-gray-200 py-3">
                  <div className="w-12 h-12 bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <span>法式吐司</span>
                    <span className="text-sm text-gray-500 ml-4">20分鐘</span>
                  </div>
                  <button className="bg-[#ff6347] text-white p-1 mr-2">
                    <span className="sr-only">刪除</span>
                    <span>刪</span>
                  </button>
                  {i === 0 ? (
                    <button className="bg-purple-200 border border-purple-500 p-1">
                      <span className="text-purple-700 text-sm">查看配方</span>
                    </button>
                  ) : i === 1 ? (
                    <button className="bg-[#5a9a8e] text-white p-1">
                      <span className="text-sm">已準備完成</span>
                    </button>
                  ) : (
                    <button className="bg-[#ffc278] border border-black p-1">
                      <span className="text-sm">開始烹飪</span>
                    </button>
                  )}
                </div>
              ))}
          </div>

          {/* 晚餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              晚
            </div>

            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center border-b border-gray-200 py-3">
                  <div className="w-12 h-12 bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <span>法式吐司</span>
                    <span className="text-sm text-gray-500 ml-4">20分鐘</span>
                  </div>
                  <button className="bg-[#ff6347] text-white p-1 mr-2">
                    <span className="sr-only">刪除</span>
                    <span>刪</span>
                  </button>
                  <button className="bg-purple-200 border border-purple-500 p-1">
                    <span className="text-purple-700 text-sm">查看配方</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

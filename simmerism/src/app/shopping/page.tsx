"use client"

import { Edit, Trash2 } from "lucide-react"

export default function ShoppingPage() {
  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">採購清單</h1>

        <div className="space-y-8">
          {/* 本周需採購清單 */}
          <div className="border-2 border-black rounded p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">本周需採購清單</h2>
              <button className="p-2 border border-purple-500 rounded">
                <Edit size={16} className="text-purple-500" />
              </button>
            </div>

            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-4 h-5 w-5" />
                      <span className="flex-1">胡椒粉</span>
                      <span className="text-sm text-gray-600 mr-2">0.2 罐(40公克)</span>
                      <button className="bg-[#ff6347] text-white p-1">
                        <span className="sr-only">刪除</span>
                        <span>刪</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div>
                <span className="font-bold">完成度：</span>
                <span>0 / 6</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center">
                  <Trash2 size={16} className="mr-1" />
                  <span>刪除清單</span>
                </button>
                <button className="bg-[#ffc278] border border-black px-4 py-1">
                  <span>標記全部完成</span>
                </button>
              </div>
            </div>
          </div>

          {/* 上周需採購清單 */}
          <div className="border-2 border-black rounded p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">上周需採購清單</h2>
              <button className="p-2 border border-purple-500 rounded">
                <Edit size={16} className="text-purple-500" />
              </button>
            </div>

            <div className="space-y-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-4 h-5 w-5" />
                      <span className="flex-1">胡椒粉</span>
                      <span className="text-sm text-gray-600 mr-2">0.2 罐(40公克)</span>
                      <button className="bg-[#ff6347] text-white p-1">
                        <span className="sr-only">刪除</span>
                        <span>刪</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div>
                <span className="font-bold">完成度：</span>
                <span>0 / 6</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center">
                  <Trash2 size={16} className="mr-1" />
                  <span>刪除清單</span>
                </button>
                <button className="bg-[#ffc278] border border-black px-4 py-1">
                  <span>標記全部完成</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

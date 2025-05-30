"use client"

import { Eye, Filter, Star } from "lucide-react"

export default function FoodDiaryPage() {
  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">我的食記</h1>

        <div className="bg-white border border-black rounded p-4 mb-8">
          <div className="flex items-center">
            <Filter size={18} className="mr-2" />
            <span className="font-bold mr-4">篩選：</span>

            <div className="flex gap-2">
              <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm">全部</button>
              <button className="border border-gray-300 px-3 py-1 rounded text-sm flex items-center">
                <span>公開</span>
              </button>
              <button className="border border-gray-300 px-3 py-1 rounded text-sm flex items-center">
                <span>私人</span>
              </button>
            </div>
          </div>
        </div>

        <div className="relative inline-block mb-8">
          <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            2025年 5月
          </div>
        </div>

        <div className="space-y-6">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white border-2 border-black rounded p-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">20</span>
                    <span className="text-sm ml-2">週一</span>
                    <span className="ml-2">{i === 0 ? "早" : "午"}</span>
                  </div>
                  <button className="bg-[#F9F4EF] border border-black rounded p-1 neo-button">
                    <Eye size={16} />
                  </button>
                </div>

                <h2 className="font-bold mb-2">日式照燒雞</h2>

                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${j < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                </div>

                <p className="text-sm mb-4">
                  今天第一次嘗試做照燒雞腿飯，效果比想像中的要好！我調整了醬汁的比例，增加了一點蜂蜜，雞腿肉質非常嫩，醬汁的甜鹹平衡也恰到好處。下次可以試著加入大蒜調味，整體來說是一道很成功的料理。
                </p>

                <div className="flex gap-2 mb-4">
                  <div className="w-24 h-24 bg-gray-200"></div>
                  <div className="w-24 h-24 bg-gray-200"></div>
                  <div className="w-24 h-24 bg-gray-200"></div>
                </div>

                <div className="flex justify-end gap-2">
                  <button className="bg-[#F7CEFA]  border border-black px-4 py-1 text-black neo-button">編輯</button>
                  <button className="bg-[#5a9a8e] text-white px-4 py-1 neo-button">查看詳情</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

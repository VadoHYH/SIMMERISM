"use client"
import RecipeCard from "@/components/recipeCard"
import SearchBar from "@/components/searchBar"
import Link from "next/link"
import { useState } from  "react"

export default function SearchPage() {
    const [keyword, setKeyword] = useState("")

  const handleSearch = () => {
    console.log("搜尋關鍵字：", keyword)
    // 後續可以在這裡觸發 API 或更新搜尋結果
  }

  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button className="border border-gray-800 rounded px-4 py-1 bg-white">全部</button>
          <button className="border border-gray-800 rounded px-4 py-1 bg-white">主食</button>
          <button className="border border-gray-800 rounded px-4 py-1 bg-white">甜點</button>
          <button className="border border-gray-800 rounded px-4 py-1 bg-white">湯品</button>
          <button className="border border-gray-800 rounded px-4 py-1 bg-white">前菜</button>
          <button className="border border-gray-800 rounded px-4 py-1 bg-white ml-auto">更多篩選</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Link href={`/recipe/${i}`} key={i}>
                <RecipeCard id={`recipe-${i}`} title="干貝蜜汁排骨" imageUrl="/placeholder.svg?height=300&width=300" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

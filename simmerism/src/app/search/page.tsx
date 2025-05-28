//src/app/search/page.tsx
"use client"
import RecipeCard from "@/components/recipeCard"
import SearchBar from "@/components/searchBar"
import Link from "next/link"
import { useState } from "react"
import { useRecipes } from "@/hooks/useRecipes"
import { useFavorite } from "@/hooks/useFavorite"

export default function SearchPage() {
  const [keyword, setKeyword] = useState("") // 使用者輸入框內容
  const [searchKeyword, setSearchKeyword] = useState("") // 按搜尋後才更新的值
  const [filterCategory, setFilterCategory] = useState("全部")
  const { recipes } = useRecipes()
  const { favorites, toggleFavorite } = useFavorite()

  const handleSearch = () => {
    console.log("搜尋關鍵字：", keyword)
    setSearchKeyword(keyword) // 這裡才觸發真正搜尋
  }

  const categoryMap: Record<string, string> = {
    全部: "",
    主菜: "main course",
    甜點: "dessert",
    湯品: "soup",
    小菜: "appetizer",
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const lowerSearch = searchKeyword.toLowerCase()
  
    // 容錯處理 dishTypes 與 diets 中的 zh
    const allDishTypesZh = recipe.dishTypes?.map(type =>
      typeof type === "string" ? type : type.zh
    ).join(" ") || ""
  
    const allDietsZh = recipe.diets?.map(diet =>
      typeof diet === "string" ? diet : diet.zh
    ).join(" ") || ""
  
    // 關鍵字搜尋條件
    const keywordMatch =
      !searchKeyword ||
      recipe.title?.zh?.toLowerCase().includes(lowerSearch) ||
      allDishTypesZh.toLowerCase().includes(lowerSearch) ||
      allDietsZh.toLowerCase().includes(lowerSearch)
  
    // 分類比對
    const categoryKey = categoryMap[filterCategory]
    const categoryMatch =
      filterCategory === "全部" ||
      recipe.dishTypes?.some((type) =>
        typeof type === "object" && type.en === categoryKey
      )
  
    return keywordMatch && categoryMatch
  })

  const categories = ["全部", "主菜", "甜點", "湯品", "小菜"]

  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              className={`border border-gray-800 rounded px-4 py-1 bg-white neo-button ${
                filterCategory === category ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setFilterCategory(category)

                if (category === "全部") {
                  setKeyword("")
                  setSearchKeyword("")
                }
              }}
            >
              {category}
            </button>
          ))}
          <button className="border border-gray-800 rounded px-4 py-1 bg-white ml-auto neo-button">
            更多篩選
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                liked={favorites.includes(recipe.id.toString())}
                readyInMinutes={recipe.readyInMinutes}
                dishTypes={recipe.dishTypes}
                diets={recipe.diets}
                onLike={() => toggleFavorite(recipe)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

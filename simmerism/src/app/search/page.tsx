//src/app/search/page.tsx
"use client"
import RecipeCard from "@/components/recipeCard"
import SearchBar from "@/components/searchBar"
import FilterModal, { type FilterOptions } from "@/components/FilterModal"
import Pagination from "@/components/pagination"
import Link from "next/link"
import {  Filter, X } from "lucide-react"
import { useState } from "react"
import { useRecipes } from "@/hooks/useRecipes"
import { useFavorite } from "@/hooks/useFavorite"

export default function SearchPage() {
  const [keyword, setKeyword] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [filterCategory, setFilterCategory] = useState("全部")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { favorites, toggleFavorite } = useFavorite()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    ingredients: [],
    tools: [],
    time: null,
    servings: null,
    tags: [],
  })

  const { recipes } = useRecipes()

  const filterCount =
    selectedFilters.ingredients.length +
    selectedFilters.tools.length +
    (selectedFilters.time ? 1 : 0) +
    (selectedFilters.servings ? 1 : 0) +
    selectedFilters.tags.length

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleFilterApply = (filters: FilterOptions) => {
    setSelectedFilters(filters)
    setCurrentPage(1)
  }

  const setFilterCategoryAndSearch = (category: string) => {
    setFilterCategory(category)
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const removeFilter = (type: keyof FilterOptions, value: string | number | null) => {
    setSelectedFilters((prev) => {
      if (type === "time" || type === "servings") {
        return { ...prev, [type]: null }
      } else if (Array.isArray(prev[type])) {
        return {
          ...prev,
          [type]: (prev[type] as string[]).filter((item) => item !== value),
        }
      }
      return prev
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      ingredients: [],
      tools: [],
      time: null,
      servings: null,
      tags: [],
    })
  }

  const categoryMap: Record<string, string> = {
    全部: "",
    主菜: "主菜",
    甜點: "甜點",
    湯品: "湯品",
    小菜: "小菜",
  }

  const filteredRecipes = recipes.filter((recipe: any) => {
    const lowerSearch = searchKeyword.toLowerCase()
  
    const safeIncludes = (val: any) =>
      typeof val === "string" && val.toLowerCase().includes(lowerSearch)
  
    const allDishTypesZh = recipe.dishTypes?.map((type: { zh: string }) => type.zh).join(" ") || ""
    const allDietsZh = recipe.diets?.map((diet: { zh: string }) => diet.zh).join(" ") || ""
    const allEquipmentsZh = recipe.equipment?.map((e: { zh: string }) => e.zh).join(" ") || ""
    const allIngredientsZh = recipe.ingredients?.map((i: { name: { zh: string } }) => i.name.zh).join(" ") || ""
  
    const timeStr = recipe.readyInMinutes?.toString() || ""
    const servingsStr = recipe.servings?.toString() || ""
  
    const keywordMatch =
      !searchKeyword ||
      safeIncludes(recipe.title?.zh) ||
      safeIncludes(allDishTypesZh) ||
      safeIncludes(allDietsZh) ||
      safeIncludes(allEquipmentsZh) ||
      safeIncludes(allIngredientsZh) ||
      safeIncludes(timeStr) ||
      safeIncludes(servingsStr)
  
    const categoryKey = categoryMap[filterCategory]
    const categoryMatch =
      filterCategory === "全部" ||
      (recipe.dishTypes || []).some((type: { zh: string }) => type.zh.includes(categoryKey))
  
    const ingredientMatch =
      selectedFilters.ingredients.length === 0 ||
      selectedFilters.ingredients.every((ing) =>
        recipe.ingredients?.some((rIng: { name: { zh: string } }) =>
          rIng.name.zh.includes(ing)
        )
      )
  
    const toolMatch =
      selectedFilters.tools.length === 0 ||
      selectedFilters.tools.every((tool) =>
        recipe.equipment?.some((e: { zh: string }) =>
          e.zh.includes(tool)
        )
      )
  
    const servingsMatch =
      !selectedFilters.servings ||
      Number(recipe.servings) === Number(selectedFilters.servings)
  
    const timeMatch =
      !selectedFilters.time ||
      Number(recipe.readyInMinutes) <= Number(selectedFilters.time)
  
    const allTagsZh = [...(recipe.dishTypes || []), ...(recipe.diets || [])].map(tag => tag.zh)
    const tagMatch =
      selectedFilters.tags.length === 0 ||
      selectedFilters.tags.every((tag) => allTagsZh.includes(tag))
  
    return keywordMatch && categoryMatch && ingredientMatch && toolMatch && servingsMatch && timeMatch && tagMatch
  })
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage)

  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  
  const categories = ["全部", "主菜", "甜點", "湯品", "小菜"]

  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 搜尋 + 分類 + 篩選區塊（響應式） */}
        <div className="mb-8">
          {/* 大尺寸：搜尋列置中 */}
          <div className="hidden sm:flex justify-center mb-4">
            <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />
          </div>

          {/* 小尺寸：搜尋列置中且保持橫向 */}
          <div className="sm:hidden mb-4 px-2">
            <SearchBar value={keyword} onChange={setKeyword} onSearch={handleSearch} />
          </div>

          {/* 分類與篩選按鈕：響應式排列 */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
            {/* 分類按鈕們：小尺寸橫向滑動，大尺寸自動換行 */}
            <div className="flex overflow-x-auto sm:overflow-visible gap-2 flex-nowrap sm:flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`border border-gray-800 rounded px-4 py-1 whitespace-nowrap neo-button bg-white ${
                    filterCategory === category ? "bg-gray-200" : ""
                  }`}
                  onClick={() => {
                    setFilterCategory(category)
                    setSearchKeyword(keyword)
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 更多篩選按鈕 */}
            <div className="ml-auto">
              <button
                className={`border border-gray-800 rounded px-4 py-1 flex items-center gap-1 whitespace-nowrap neo-button ${
                  filterCount > 0 ? "bg-[#5a9a8e] text-white" : "bg-white"
                }`}
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter size={16} />
                更多篩選
                {filterCount > 0 && <span className="ml-1">({filterCount})</span>}
              </button>
            </div>
          </div>
        </div>


        {/* 已應用的篩選條件標籤 */}
        {filterCount > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">已選擇:</span>
              {selectedFilters.ingredients.map((ingredient) => (
                <div
                  key={`ingredient-${ingredient}`}
                  className="bg-[#5a9a8e] text-white text-sm px-2 py-1 rounded-full flex items-center"
                >
                  <span>食材: {ingredient}</span>
                  <button
                    onClick={() => removeFilter("ingredients", ingredient)}
                    className="ml-1 p-0.5 hover:bg-[#4a8a7e] rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {selectedFilters.tools.map((tool) => (
                <div
                  key={`tool-${tool}`}
                  className="bg-[#5a9a8e] text-white text-sm px-2 py-1 rounded-full flex items-center"
                >
                  <span>器具: {tool}</span>
                  <button
                    onClick={() => removeFilter("tools", tool)}
                    className="ml-1 p-0.5 hover:bg-[#4a8a7e] rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {selectedFilters.time && (
                <div className="bg-[#5a9a8e] text-white text-sm px-2 py-1 rounded-full flex items-center">
                  <span>時間: {selectedFilters.time}分鐘內</span>
                  <button
                    onClick={() => removeFilter("time", selectedFilters.time)}
                    className="ml-1 p-0.5 hover:bg-[#4a8a7e] rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {selectedFilters.servings && (
                <div className="bg-[#5a9a8e] text-white text-sm px-2 py-1 rounded-full flex items-center">
                  <span>人數: {selectedFilters.servings}人</span>
                  <button
                    onClick={() => removeFilter("servings", selectedFilters.servings)}
                    className="ml-1 p-0.5 hover:bg-[#4a8a7e] rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {selectedFilters.tags.map((tag) => (
                <div
                  key={`tag-${tag}`}
                  className="bg-[#5a9a8e] text-white text-sm px-2 py-1 rounded-full flex items-center"
                >
                  <span>標籤: {tag}</span>
                  <button
                    onClick={() => removeFilter("tags", tag)}
                    className="ml-1 p-0.5 hover:bg-[#4a8a7e] rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={clearAllFilters} className="text-sm text-gray-600 underline hover:text-gray-800">
                清除全部
              </button>
            </div>
          </div>
        )}
  
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilterApply}
          initialFilters={selectedFilters}
          recipes={recipes}
        />

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {paginatedRecipes.map((recipe) => (
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
          ))}
        </div>
        {/* 分頁按鈕 */}
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  )
}
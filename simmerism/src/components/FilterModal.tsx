//components/FilterModal.tsx
"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import {
  generateIngredientOptions,
  generateToolOptions,
  generateTagOptions,
} from "@/utils/filterOptions"
import { Recipe } from "@/types/recipe"

export interface FilterOptions {
  ingredients: string[]
  tools: string[]
  time: number | null
  servings: number | null
  tags: string[]
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterOptions) => void
  initialFilters?: FilterOptions
  recipes?: Recipe[] // 新增 recipes prop 用於動態生成標籤
}

const defaultFilters: FilterOptions = {
  ingredients: [],
  tools: [],
  time: null,
  servings: null,
  tags: [],
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters, recipes = [] }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || defaultFilters)
  const [showAllIngredients, setShowAllIngredients] = useState(false)
  const [showAllTools, setShowAllTools] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  // 當 initialFilters 變化時更新內部狀態
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  // 預設選項
  const defaultIngredients = ["雞肉", "豬肉", "牛肉", "魚", "蝦", "蛋", "豆腐", "米飯", "麵條", "蔬菜"]
  const defaultTools = ["電鍋", "平底鍋", "炒鍋", "烤箱", "氣炸鍋", "微波爐", "電子壓力鍋", "慢燉鍋"]
  const timeOptions = [
    { label: "15分鐘內", value: 15 },
    { label: "30分鐘內", value: 30 },
    { label: "1小時內", value: 60 },
    { label: "2小時以上", value: 120 },
  ]
  const servingOptions = [
    { label: "1人", value: 1 },
    { label: "2人", value: 2 },
    { label: "4人", value: 4 },
    { label: "6人以上", value: 6 },
  ]

  const ingredientOptions = generateIngredientOptions(recipes, defaultIngredients)
  const toolOptions = generateToolOptions(recipes, defaultTools)
  const tagOptions = generateTagOptions(recipes)

  // 控制顯示的選項數量
  const displayedIngredients = showAllIngredients ? ingredientOptions : ingredientOptions.slice(0, 10)
  const displayedTools = showAllTools ? toolOptions : toolOptions.slice(0, 10)
  const displayedTags = showAllTags ? tagOptions : tagOptions.slice(0, 10)

  const handleIngredientToggle = (ingredient: string) => {
    setFilters((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredient)
        ? prev.ingredients.filter((i) => i !== ingredient)
        : [...prev.ingredients, ingredient],
    }))
  }

  const handleToolToggle = (tool: string) => {
    setFilters((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool) ? prev.tools.filter((t) => t !== tool) : [...prev.tools, tool],
    }))
  }

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    // 重置展開狀態
    setShowAllIngredients(false)
    setShowAllTools(false)
    setShowAllTags(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 模態對話框頭部 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">更多篩選條件</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full neo-button">
            <X size={24} />
          </button>
        </div>

        {/* 模態對話框內容 */}
        <div className="p-6 space-y-8">
          {/* 食材篩選 */}
          <div>
            <h3 className="text-lg font-bold mb-3">食材</h3>
            <div className="flex flex-wrap gap-2">
              {displayedIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => handleIngredientToggle(ingredient)}
                  className={`px-3 py-1 rounded border ${
                    filters.ingredients.includes(ingredient)
                      ? "bg-[#5a9a8e] text-white border-[#5a9a8e] neo-button"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {ingredient}
                </button>
              ))}
              {ingredientOptions.length > 10 && (
                <button
                  onClick={() => setShowAllIngredients(!showAllIngredients)}
                  className="px-3 py-1 rounded border border-gray-400 bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  {showAllIngredients ? `收起 (${ingredientOptions.length - 10})` : `更多 (${ingredientOptions.length - 10})`}
                </button>
              )}
            </div>
          </div>

          {/* 器具篩選 */}
          <div>
            <h3 className="text-lg font-bold mb-3">器具</h3>
            <div className="flex flex-wrap gap-2">
              {displayedTools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => handleToolToggle(tool)}
                  className={`px-3 py-1 rounded border ${
                    filters.tools.includes(tool)
                      ? "bg-[#5a9a8e] text-white border-[#5a9a8e] neo-button"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {tool}
                </button>
              ))}
              {toolOptions.length > 10 && (
                <button
                  onClick={() => setShowAllTools(!showAllTools)}
                  className="px-3 py-1 rounded border border-gray-400 bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  {showAllTools ? `收起 (${toolOptions.length - 10})` : `更多 (${toolOptions.length - 10})`}
                </button>
              )}
            </div>
          </div>

          {/* 時間篩選 */}
          <div>
            <h3 className="text-lg font-bold mb-3">烹飪時間</h3>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, time: prev.time === option.value ? null : option.value }))
                  }
                  className={`px-3 py-1 rounded border ${
                    filters.time === option.value
                      ? "bg-[#5a9a8e] text-white border-[#5a9a8e] neo-button"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 人數篩選 */}
          <div>
            <h3 className="text-lg font-bold mb-3">適合人數</h3>
            <div className="flex flex-wrap gap-2">
              {servingOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, servings: prev.servings === option.value ? null : option.value }))
                  }
                  className={`px-3 py-1 rounded border ${
                    filters.servings === option.value
                      ? "bg-[#5a9a8e] text-white border-[#5a9a8e] neo-button"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 標籤篩選 */}
          <div>
            <h3 className="text-lg font-bold mb-3">標籤</h3>
            <div className="flex flex-wrap gap-2">
              {displayedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded border ${
                    filters.tags.includes(tag) ? "bg-[#5a9a8e] text-white border-[#5a9a8e] neo-button" : "bg-white border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {tagOptions.length > 10 && (
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="px-3 py-1 rounded border border-gray-400 bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  {showAllTags ? `收起 (${tagOptions.length - 10})` : `更多 (${tagOptions.length - 10})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 模態對話框底部 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between">
          <button onClick={handleReset} className="px-6 py-2 border border-gray-300 rounded neo-button">
            重置
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded neo-button">
              取消
            </button>
            <button onClick={handleApply} className="px-6 py-2 bg-[#5a9a8e] text-white border border-[#5a9a8e] rounded neo-button">
              套用篩選
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
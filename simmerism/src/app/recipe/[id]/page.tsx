//app/recipe[id]/page.tsx
"use client"

import { Heart, Users, Timer} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AddToScheduleModal from "@/components/AddToScheduleModal";
import { useEffect, useState } from "react"
import { useRecipes } from "@/hooks/useRecipes"
import { useFavorite } from "@/hooks/useFavorite"
import { useSchedule } from "@/hooks/useSchedule"
import { useParams } from "next/navigation"

type ScheduleData = {
  date: Date;
  meal: string;
};

export default function RecipePage() {
  const [liked, setLiked] = useState(false)
  const { recipes, loading } = useRecipes()
  const params = useParams()
  const recipeId = params.id as string
  const recipe = recipes.find((r) => r.id === recipeId)
  const dishTypesWithSource = recipe?.dishTypes || []
  const dietsWithSource = recipe?.diets || []
  const combined = [...dishTypesWithSource, ...dietsWithSource]
  const { favorites, toggleFavorite } = useFavorite()
  const [isModalOpen, setModalOpen] = useState(false);
  const { addSchedule } = useSchedule()
  const [successMessage, setSuccessMessage] = useState("");

  const isFavorited = favorites.includes(recipeId.toString())
  
  useEffect(() => {
    setLiked(favorites.includes(recipeId.toString()))
  }, [favorites, recipeId])

  const uniquetags = Array.from(
    new Map(combined.map(item => [item.zh, item])).values()
  );

  // 載入中畫面
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">🍳 載入食譜中...</div>
  }

  // 找不到對應食譜
  if (!recipe) {
    return <div className="p-4 text-red-500">❌ 找不到這道食譜！<Link href="/" className="text-blue-500 underline">回首頁</Link></div>
  }

  let steps: string[] = [];
  if (typeof recipe.instructions.zh === "string") {
    // 原本你舊資料的情況 → 用正則拆
    steps = recipe.instructions.zh.match(/步驟\d+[：:\.][^步驟]+/g) || [];
  } else if (Array.isArray(recipe.instructions.zh)) {
    // 新資料如果直接是陣列 → 直接用
    steps = recipe.instructions.zh;
  } else {
    // 其他情況 → 不顯示步驟
    steps = [];
  }

  const handleAddSchedule = ({ date, meal }: ScheduleData) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    const formattedDate = localDate.toISOString().split("T")[0]

    addSchedule({
      recipeId: recipeId,
      date: formattedDate,
      mealType: meal as 'breakfast' | 'lunch' | 'dinner',
    })

    // 顯示成功訊息
    setSuccessMessage("已成功加入行程！");
    // 3 秒後自動清除提示
    setTimeout(() => setSuccessMessage(""), 3000);
    // 關閉 Modal
    setModalOpen(false);
  }
    
  return (
    <>
    {successMessage && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#ffc278] text-black border-2 border-black px-6 py-2 rounded-lg shadow-md font-bold z-50 neo-button transition-all duration-300">
        ✅ {successMessage}
      </div>
    )}

    <div className="bg-[#f9f5f1] min-h-screen min-w-1000 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-gray-200 aspect-square rounded border-2 border-black">
          <Image
            src={recipe.image}
            alt={recipe.title.zh}
            fill
            className="object-cover rounded-xl shadow-md"
          />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{recipe.title.zh}</h1>

            {recipe.summary.zh && Array.isArray(recipe.summary.zh) && (
              <div className="mb-6 space-y-2">
                {recipe.summary.zh
                  .filter((sentence) => sentence.trim() !== "")
                  .map((sentence, index) => (
                    <p key={index}>{sentence}</p>
                  ))}
              </div>
            )}

            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2 neo-button">
                <div className="bg-gray-800 text-white rounded-full p-1">
                  <Users size={16} />
                </div>
                <span>{recipe.servings} 人份</span>
              </div>
              <div className="flex items-center gap-2 neo-button">
                <div className="bg-gray-800 text-white rounded-full p-1">
                  <Timer size={16} />
                </div>
                <span>{recipe.readyInMinutes} 分鐘</span>
              </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {uniquetags.map((item, index) => (
                <button
                  key={index}
                  className="px-4 py-1 rounded-full bg-slate-200 hover:bg-slate-300 neo-button"
                >
                  {item.zh}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 border  ${liked ? "bg-[#5a9a8e]  border-black text-black " : "bg-[#5a9a8e]  border-black text-white neo-button"}`}
                onClick={() => toggleFavorite(recipe)}
              >
                <Heart className={isFavorited ? "fill-black" : ""} size={20} />
                {liked ? "已收藏" : "收藏"}
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#ffc278] border border-black neo-button"
                onClick={() => setModalOpen(true)}  // ⭐ 關鍵在這裡
              >
                加入行程
              </button>
              <AddToScheduleModal
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                  onSave={handleAddSchedule}
                />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="border-2 border-black rounded p-4 ">
            <div className="flex justify-between items-center mb-4 ">
              <h2 className="font-bold text-xl">食材</h2>
            </div>
            <div className="space-y-2">
              {recipe.ingredients.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="flex-1">{item.name.zh}</span>
                  <span className="text-sm text-gray-600">{item.amount.zh}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-black rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">步驟</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2">
              {steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 border-2 border-black rounded p-4">
          <h2 className="font-bold text-xl mb-4">所需器具</h2>
          <div className="relative">
            <div className="flex justify-between px-8 overflow-x-auto no-scrollbar gap-4">
              {recipe.equipment.map((item, index) => (
                <div key={index} className="text-center min-w-[100px]">
                  <div className="bg-[#ffc278] px-4 py-2 mb-2 border-2 border-black rounded">
                    {item.zh}
                    <div className="text-sm">{item.en}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


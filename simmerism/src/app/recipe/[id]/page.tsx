//app/recipe[id]/page.tsx
"use client"

import { ArrowRight, ChevronLeft, ChevronRight, Edit, Heart, Users, Star, Timer} from "lucide-react"
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

  const isFavorited = favorites.includes(recipeId.toString())
  
  useEffect(() => {
    setLiked(favorites.includes(recipeId.toString()))
  }, [favorites, recipeId])

  const handleLike = () => {
    toggleFavorite(recipeId)
    setLiked((prev) => !prev)
  }

  const uniquetags = Array.from(
    new Map(combined.map(item => [item.zh, item])).values()
  );

  // 載入中畫面
  if (loading) {
    return <div className="p-4">🍳 載入食譜中...</div>
  }

  // 找不到對應食譜
  if (!recipe) {
    return <div className="p-4 text-red-500">❌ 找不到這道食譜！<Link href="/" className="text-blue-500 underline">回首頁</Link></div>
  }

  const handleCategoryClick = (keyword:string) => {
    console.log("你點選的是：", keyword);
    // TODO: 根據 keyword 篩選資料或導向搜尋頁面
  };

  // 正則表達式：抓出「步驟1：...」「步驟2：...」的每個區段
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

  const handleAddSchedule = ({ date, meal }: { date: Date; meal: string }) => {
    const formattedDate = date.toISOString().split('T')[0] // "2025-05-29"
    addSchedule({
      recipeId: recipeId, // 從頁面取得的 id
      date: formattedDate,
      mealType: meal as 'breakfast' | 'lunch' | 'dinner',
    })
  };
    
  return (
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
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1">
              <ChevronLeft size={24} />
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1">
              <ChevronRight size={24} />
            </button>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{recipe.title.zh}</h1>
            {/* <p
              className="mb-6"
              dangerouslySetInnerHTML={{ __html: recipe.summary.zh }}
            /> */}

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
                  onClick={() => handleCategoryClick(item.en)}
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
              {/* <button className="p-2 bg-[#F7CEFA] border-2 border-black  neo-button">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.18695 16.8145L17.3289 6.67254L15.9149 5.25854L5.77295 15.4005V16.8145H7.18695ZM8.01595 18.8145H3.77295V14.5715L15.2079 3.13654C15.3955 2.94907 15.6498 2.84375 15.9149 2.84375C16.1801 2.84375 16.4344 2.94907 16.6219 3.13654L19.4509 5.96554C19.6384 6.15306 19.7437 6.40737 19.7437 6.67254C19.7437 6.9377 19.6384 7.19201 19.4509 7.37954L8.01595 18.8145ZM3.77295 20.8145H21.7729V22.8145H3.77295V20.8145Z"
                    fill="black"
                  />
                </svg>
              </button> */}
            </div>
            <div className="space-y-2">
              {recipe.ingredients.map((item, index) => (
                <div key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="flex-1">{item.name.zh}</span>
                  <span className="text-sm text-gray-600">{item.amount.zh}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-black rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">步驟</h2>
              {/* <button className="p-2 bg-[#F7CEFA] border-2 border-black  neo-button">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.18695 16.8145L17.3289 6.67254L15.9149 5.25854L5.77295 15.4005V16.8145H7.18695ZM8.01595 18.8145H3.77295V14.5715L15.2079 3.13654C15.3955 2.94907 15.6498 2.84375 15.9149 2.84375C16.1801 2.84375 16.4344 2.94907 16.6219 3.13654L19.4509 5.96554C19.6384 6.15306 19.7437 6.40737 19.7437 6.67254C19.7437 6.9377 19.6384 7.19201 19.4509 7.37954L8.01595 18.8145ZM3.77295 20.8145H21.7729V22.8145H3.77295V20.8145Z"
                    fill="black"
                  />
                </svg>
              </button> */}
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
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <ChevronLeft size={24} />
            </button>
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
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
      {/* <section className="bg-[#FB7659] py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-bold text-xl mb-6">他人食記</h2>

            <div className="space-y-6">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white p-4 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div>
                        <div className="font-bold">測試使用者</div>
                        <div className="text-xs text-gray-500">2023-05-15</div>
                      </div>
                    </div>
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
                    <div className="flex gap-2">
                      <div className="w-20 h-20 bg-gray-200"></div>
                      <div className="w-20 h-20 bg-gray-200"></div>
                      <div className="w-20 h-20 bg-gray-200"></div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button className="bg-[#5a9a8e] text-white px-4 py-1 rounded neo-button">查看詳情</button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-center mt-6">
              <Link href="/reviews" className="bg-[#5a9a8e] text-white px-4 py-1 rounded flex items-center neo-button">
                查看更多 <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
          </div>
        </section> */}
    </div>
  )
}


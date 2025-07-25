//首頁
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/RecipeCard"
import { ArrowRight, Edit } from "lucide-react"
import { useRecipes } from "@/hooks/useRecipes"
import { useFavorite } from "@/hooks/useFavorite"
import { useShoppingList } from "@/hooks/useShoppingList"
import { useSchedule } from "@/hooks/useSchedule"
import { useMemo } from "react"
import { useRequireLogin } from "@/hooks/useRequireLogin"
import { format, addDays } from 'date-fns'
import dayjs from 'dayjs'

export default function Home() {
  const { recipes } = useRecipes()
  const { favorites, toggleFavorite } = useFavorite()
  const { schedule } = useSchedule()
  const requireLogin = useRequireLogin()
  const router = useRouter()

  const today = new Date()
  const oneWeekLater = addDays(today, 6)
  const formattedStart = format(today, 'yyyy-MM-dd')
  const formattedEnd = format(oneWeekLater, 'yyyy-MM-dd')

  const { shoppingList, isChecked, toggleItem } = useShoppingList({
    schedule,
    startDate: formattedStart,
    endDate: formattedEnd,
  })

  const todayScheduleCounts = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const todaySchedules = schedule.filter(s => s.date === today)
    return {
      breakfast: todaySchedules.filter(s => s.mealType === 'breakfast').length,
      lunch: todaySchedules.filter(s => s.mealType === 'lunch').length,
      dinner: todaySchedules.filter(s => s.mealType === 'dinner').length,
    }
  }, [schedule])

  return (
    <div className="bg-[#f9f5f1]">
      <section className="bg-[#FB7659] py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 lg:grid-rows-7 gap-4 grid-cols-1">
            {/*介紹區 */}
            <div className="lg:col-span-3 lg:row-span-5 bg-white p-8 rounded border-2 border-black flex flex-col justify-between order-1">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
                  發現美味食譜<br />規劃完美餐點
                </h1>
                <p className="text-base md:text-xl">
                  SIMMERISM 幫助您探索美味食譜、規劃餐點、準備食材，並記錄您的烹飪旅程。
                </p>
              </div>
              <div className="flex justify-end mt-6">
                <Link href="/search" className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold transition-colors neo-button">
                  開始探索食譜 <ArrowRight className="inline ml-2" size={18} />
                </Link>
              </div>
            </div>

            {/* 採購清單 */}
            <div className="lg:col-start-4 lg:col-span-2 lg:row-start-1 lg:row-span-7 bg-white p-4 rounded border-2 border-black order-2">
              <h2 className="font-bold mb-4">本周需採購清單</h2>
              <div className="space-y-2 h-[350px] overflow-y-auto">
                {shoppingList.length > 0 ? (
                  shoppingList.slice(0, 10).map((item, index) => (
                    <div key={item.key || index} className="flex items-center group hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        className="mr-2 cursor-pointer"
                        checked={isChecked(item.key)}
                        onChange={() => toggleItem(item.key)}
                      />
                      <span
                        className={`flex-1 cursor-pointer transition-all ${
                          isChecked(item.key) ? 'line-through text-gray-400' : 'text-black'
                        }`}
                        onClick={() => toggleItem(item.key)}
                      >
                        {item.name}
                      </span>
                      <span className={`text-sm ${
                        isChecked(item.key) ? 'text-gray-400 line-through' : 'text-gray-600'
                      }`}>
                        {item.totalAmount} {item.unit.replace(/[\d.()（）]/g, '').trim() || '份'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    目前沒有採購項目<br />
                    <div
                      onClick={() => requireLogin(() => router.push("/schedule"))}
                      className="text-[#519181] underline text-sm cursor-pointer"
                    >
                      先去安排餐點行程吧！
                    </div>
                  </div>
                )}
                {shoppingList.length > 10 && (
                  <div className="text-center text-gray-500 text-sm py-2">
                    ... 還有 {shoppingList.length - 10} 項
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => requireLogin(() => router.push("/shopping"))}
                  className="p-2 bg-[#F7CEFA] border-2 border-black neo-button"
                >
                  <Edit size={20} />
                </button>
              </div>
            </div>

            {/* 早中晚 */}
            <div className="flex flex-row justify-between gap-2 lg:gap-4 order-3 lg:col-span-3 lg:col-start-1 lg:row-start-6 lg:row-span-2">
              {[{ label: "早", count: todayScheduleCounts.breakfast },
                { label: "午", count: todayScheduleCounts.lunch },
                { label: "晚", count: todayScheduleCounts.dinner }
              ].map(({ label, count }) => (
                <div
                  key={label}
                  onClick={() => requireLogin(() => router.push("/schedule"))}
                  className="flex-1 bg-white p-1 lg:p-2 rounded border-2 border-black relative hover:neo-card cursor-pointer min-h-[80px] lg:min-h-0"
                >
                  <div className="absolute top-1 left-1 w-8 h-8 lg:top-2 lg:left-2 lg:w-10 lg:h-10">
                    <svg viewBox="0 0 218 217" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M109 0L124.022 28.642L148.375 7.36053L152.036 39.4948L182.433 28.448L174.238 59.7346L206.573 60.4145L187.629 86.6281L217.535 98.9427L190.401 116.543L213.839 138.829L182.18 145.439L195.984 174.687L164.075 169.414L166.381 201.674L138.532 185.23L129.029 216.144L109 190.75L88.9713 216.144L79.4685 185.23L51.6189 201.674L53.9254 169.414L22.0161 174.687L35.8204 145.439L4.161 138.829L27.5987 116.543L0.464973 98.9427L30.3708 86.6281L11.4272 60.4145L43.7621 59.7346L35.5672 28.448L65.9642 39.4948L69.6247 7.36053L93.9785 28.642L109 0Z" fill="#519181" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs lg:text-sm font-bold">
                      {label}
                    </div>
                  </div>
                  <div className="h-full flex justify-center items-center">
                    <div className="text-2xl lg:text-5xl font-bold">{count}</div>
                  </div>
                  <div className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 text-2xl lg:text-xl text-black font-bold lg:font-normal">道</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl md:text-2xl font-bold">精選食譜</h2>
            <Link href="/search" className="bg-[#519181] text-white px-4 py-1 flex items-center border-2 border-black neo-button">
              查看更多 <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {recipes.slice(0, 4).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                liked={favorites.includes(recipe.id.toString())}
                readyInMinutes={recipe.readyInMinutes}
                dishTypes={recipe.dishTypes}
                diets={recipe.diets}
                onLike={() =>requireLogin(() => toggleFavorite(recipe))}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
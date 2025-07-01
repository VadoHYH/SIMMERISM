"use client"
import { useFavorite } from "@/hooks/useFavorite"
import RecipeCard from "@/components/RecipeCard"
import { useAuthStore } from '@/stores/useAuthStore'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CollectionPage() {
  const user = useAuthStore(state => state.user)
  const loadingAuth = useAuthStore(state => state.loading)
  const router = useRouter()
  const { favoriteDetails, toggleFavorite, loading, favorites } = useFavorite()

  // 如果尚未取得 user 且 auth 正在 loading，先不動作
  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/")
    }
  }, [user, loadingAuth, router])

  if (loadingAuth || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        ⏳ 資料載入中...
      </div>
    )
  }

  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">我的收藏</h1>

        {favoriteDetails.length === 0 ? (
          <div className="bg-white border-2 border-black rounded-lg p-8 text-center space-y-4 max-w-md mx-auto">
            <p className="text-xl font-semibold">你還沒有收藏任何食譜 🍽️</p>
            <p className="text-gray-600">可以先到搜尋頁找找看有沒有喜歡的料理喔！</p>
            <button
              className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold rounded-lg hover:bg-[#ffb452] neo-button"
              onClick={() => location.href = '/search'}
            >
              去探索食譜
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {favoriteDetails.map((recipe) => (
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
        )}
      </div>
    </div>
  )
}

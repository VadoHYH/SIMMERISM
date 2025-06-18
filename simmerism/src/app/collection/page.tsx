"use client"
import { useFavorite } from "@/hooks/useFavorite"
import RecipeCard from "@/components/recipeCard"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"


export default function CollectionPage() {
  const { user } = useAuth()
  const { favorites, toggleFavorite } = useFavorite()
  const [favoriteRecipes, setFavoriteRecipes] = useState<any[]>([])
  
  useEffect(() => {
    const loadFavoriteDetails = async () => {
      if (!user) return
      const results = await Promise.all(
        favorites.map(async (id) => {
          const docRef = doc(db, "users", user.uid, "favorites", id)
          const docSnap = await getDoc(docRef)
          return docSnap.exists() ? docSnap.data() : null
        })
      )
      setFavoriteRecipes(results.filter(Boolean))
    }

    loadFavoriteDetails()
  }, [favorites, user])

  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">我的收藏</h1>

        {favoriteRecipes.length === 0 ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteRecipes.map(recipe => (
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
        )}
      </div>
    </div>
  )
}
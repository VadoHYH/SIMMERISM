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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteRecipes.map(recipe => (
            <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                liked={favorites.includes(recipe.id.toString())}
                onLike={() => toggleFavorite(recipe)}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

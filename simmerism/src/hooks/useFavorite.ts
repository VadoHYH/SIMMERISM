import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { useAuthStore } from '@/stores/useAuthStore'

export const useFavorite = () => {
  const user = useAuthStore((state) => state.user)
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteDetails, setFavoriteDetails] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const toggleFavorite = async (recipe: any) => {
    if (!user) return
    setLoading(true)

    const recipeRef = doc(db, "users", user.uid, "favorites", recipe.id.toString())
    const isFavorited = favorites.includes(recipe.id.toString())

    if (isFavorited) {
      await deleteDoc(recipeRef)
      setFavorites(favorites.filter(id => id !== recipe.id.toString()))
      setFavoriteDetails(favoriteDetails.filter(r => r.id !== recipe.id))
    } else {
      await setDoc(recipeRef, {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        dishTypes: recipe.dishTypes,
        diets: recipe.diets,
        liked: recipe.liked
      })
      setFavorites([...favorites, recipe.id.toString()])
      setFavoriteDetails([...favoriteDetails, recipe])
    }

    setLoading(false)
  }

  const loadFavorites = async () => {
    if (!user) return
    setLoading(true)
    const favCol = collection(db, "users", user.uid, "favorites")
    const snapshot = await getDocs(favCol)
    const favs = snapshot.docs.map(doc => doc.data())
    setFavorites(favs.map(f => f.id.toString()))
    setFavoriteDetails(favs)
    setLoading(false)
  }

  useEffect(() => {
    loadFavorites()
  }, [user])

  return { favorites, favoriteDetails, toggleFavorite, loadFavorites, loading }
}

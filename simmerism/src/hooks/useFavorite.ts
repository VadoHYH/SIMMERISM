import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState, useEffect, useCallback } from "react"
import { useAuthStore } from '@/stores/useAuthStore'
import { Recipe } from "@/types/recipe"

export const useFavorite = () => {
  const user = useAuthStore((state) => state.user)
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteDetails, setFavoriteDetails] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const toggleFavorite = async (recipe: Recipe) => {
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

  const loadFavorites = useCallback(async () => {
    if (!user) {
        setFavorites([]);
        setFavoriteDetails([]);
        return;
    }
    setLoading(true);
    try {
      const favCol = collection(db, "users", user.uid, "favorites");
      const snapshot = await getDocs(favCol);
      // 修正：將從 Firestore 讀取的數據斷言為 Recipe 介面
      const favs = snapshot.docs.map(doc => doc.data() as Recipe); 
      setFavorites(favs.map(f => f.id.toString()));
      setFavoriteDetails(favs);
    } catch (error) {
        console.error("載入收藏失敗:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [user, loadFavorites]);

  return { favorites, favoriteDetails, toggleFavorite, loadFavorites, loading }
}

// src/hooks/useFavorite.ts
"use client"
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext" // 你有用 auth context 的話

export const useFavorite = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = async (recipe: any) => {
    if (!user) return

    const recipeRef = doc(db, "users", user.uid, "favorites", recipe.id.toString())
    const isFavorited = favorites.includes(recipe.id.toString())

    if (isFavorited) {
      await deleteDoc(recipeRef)
      setFavorites(favorites.filter(id => id !== recipe.id.toString()))
    } else {
      await setDoc(recipeRef, {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes:recipe.readyInMinutes,
        dishTypes:recipe.dishTypes,
        diets:recipe.diets,
        liked:recipe.liked
      })
      setFavorites([...favorites, recipe.id.toString()])
    }
  }

  const loadFavorites = async () => {
    if (!user) return
    const favCol = collection(db, "users", user.uid, "favorites")
    const snapshot = await getDocs(favCol)
    const ids = snapshot.docs.map(doc => doc.id)
    setFavorites(ids)
  }

  useEffect(() => {
    loadFavorites()
  }, [user])

  return { favorites, toggleFavorite, loadFavorites }
}

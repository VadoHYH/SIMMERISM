// hooks/useRecipeById.ts
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase" // 確保這是你初始化 firebase 的地方

export function useRecipeById(id: string) {
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setRecipe(docSnap.data())
      } else {
        setRecipe(null)
      }

      setLoading(false)
    }

    fetchRecipe()
  }, [id])

  return { recipe, loading }
}

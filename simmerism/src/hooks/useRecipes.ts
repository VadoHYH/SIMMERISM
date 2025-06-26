// src/hooks/useRecipes.ts
"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Recipe } from "@/types/recipe"

// export interface Ingredient {
//   name: { en: string; zh: string }
//   amount: { en: string; zh: string }
// }

// export interface Recipe {
//   id: string
//   title: { zh: string; en: string }
//   summary: { en: string[]; zh: string[]}
//   image: string
//   ingredients: Ingredient[]
//   instructions: { en: string; zh: string }
//   equipment: { en: string; zh: string }[]
//   liked?: boolean
//   readyInMinutes?: string
//   servings?: string
//   dishTypes?: { zh: string; en: string }[]
//   diets?: { zh: string; en: string }[]
// }

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, "recipes"))
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data()

          const recipe: Recipe = {
            id: doc.id,
            title: raw.title,
            summary: raw.summary,
            image: raw.image,
            ingredients: raw.ingredients?.zh || [],
            instructions: raw.instructions,
            equipment: raw.equipment || [],
            liked: false,
            readyInMinutes: raw.readyInMinutes?.toString() || "",
            servings: raw.servings?.toString() || "",
            dishTypes: raw.dishTypes || [],
            diets: raw.diets || [],
          }

          return recipe
        })

        setRecipes(data)
      } catch (error) {
        console.error("❌ 無法取得食譜資料：", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { recipes, loading }
}




// src/hooks/useRecipes.ts
"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Recipe, Ingredient, LocalizedString } from "@/types/recipe"

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, "recipes"))
        const data = snapshot.docs.map((doc) => {
          const raw = doc.data() as Record<string, any>;

          const mapLocalizedString = (obj: any): LocalizedString => ({
            zh: obj?.zh || '',
            en: obj?.en || '',
          });

          const mapLocalizedStringArray = (arr: any[] | undefined): LocalizedString[] =>
            (arr || []).map(mapLocalizedString);

          let mappedIngredients: Ingredient[] = [];
          if (raw.ingredients && typeof raw.ingredients === 'object') {
            const zhIngredientsArray = raw.ingredients.zh;
            if (Array.isArray(zhIngredientsArray)) {
                mappedIngredients = zhIngredientsArray.map((item: any): Ingredient => {
                    return {
                        name: mapLocalizedString(item.name),
                        amount: mapLocalizedString(item.amount),
                    };
                });
            }
        }

          const recipe: Recipe = {
            id: doc.id,
            title: mapLocalizedString(raw.title),
            summary: mapLocalizedString(raw.summary), 
            image: raw.image || '',
            // 這是 ingredients 最關鍵的部分：
            ingredients: mappedIngredients,
            instructions: mapLocalizedString(raw.instructions),
            equipment: mapLocalizedStringArray(raw.equipment),
            liked: false, // 預設值
            readyInMinutes: raw.readyInMinutes?.toString() || '',
            servings: raw.servings?.toString() || '',
            dishTypes: mapLocalizedStringArray(raw.dishTypes),
            diets: mapLocalizedStringArray(raw.diets),
          };  
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




// src/hooks/useRecipes.ts
"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Recipe, Ingredient, LocalizedString } from "@/types/recipe"

// 定義從 Firestore 讀取到的原始數據結構
interface RawRecipeDataFromFirestore extends DocumentData {
  title?: { zh?: string; en?: string; }; // 原始的 LocalizedString 結構
  summary?: { zh?: string; en?: string; };
  image?: string;
  ingredients?: { zh?: Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }>; }; // 原始的 Ingredient 結構
  instructions?: { zh?: string; en?: string; };
  equipment?: Array<{ zh?: string; en?: string; }>;
  readyInMinutes?: number | string; // 考慮 Firestore 可能存數字
  servings?: number | string;
  dishTypes?: Array<{ zh?: string; en?: string; }>;
  diets?: Array<{ zh?: string; en?: string; }>;
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, "recipes"))
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const raw = doc.data() as RawRecipeDataFromFirestore;

          const mapLocalizedString = (obj: { zh?: string; en?: string; } | undefined): LocalizedString => ({
            zh: obj?.zh || '',
            en: obj?.en || '',
          });

          const mapLocalizedStringArray = (arr:  Array<{ zh?: string; en?: string; }> | undefined): LocalizedString[] =>
            (arr || []).map(mapLocalizedString);

          let mappedIngredients: Ingredient[] = [];
          if (raw.ingredients && typeof raw.ingredients === 'object') {
            const zhIngredientsArray = raw.ingredients.zh;
            if (Array.isArray(zhIngredientsArray)) {
                mappedIngredients = zhIngredientsArray.map((item: { name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }): Ingredient => {
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
        if (error instanceof Error) {
          console.error("❌ 無法取得食譜資料：", error.message)
        } else {
          console.error("❌ 無法取得食譜資料：", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { recipes, loading }
}
// hooks/useSchedule.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useAuthStore } from '@/stores/useAuthStore'
import { LocalizedString, Ingredient } from '@/types/recipe'


interface RawRecipeDataFromFirestore extends DocumentData {
  title?: { zh?: string; en?: string; };
  readyInMinutes?: number | string; // 確保與 Firestore 原始存儲型別一致
  image?: string;
  ingredients?: {
    en?: Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }>;
    zh?: Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }>;
  };
}

export type ScheduleItem = {
  id: string
  userId: string
  recipeId: string
  date: string
  mealType: 'breakfast' | 'lunch' | 'dinner'
  isDone: boolean
  hasDiary: boolean
  createdAt: string
  reviewId?: string
  recipe?: {
    title: LocalizedString
    readyInMinutes: string
    image: string
    ingredients: {
      en: Ingredient[] 
      zh: Ingredient[]
    }
  }
}

export const useSchedule = () => {
  const user = useAuthStore((state) => state.user)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const mapLocalizedString = useCallback((obj: { zh?: string; en?: string; } | undefined): LocalizedString => ({
    zh: obj?.zh || '',
    en: obj?.en || '',
  }), []);


  const mapRawIngredientsArray = useCallback((rawIngredientsArray: Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }> | undefined): Ingredient[] => {
    return (rawIngredientsArray || []).map(item => ({
      name: mapLocalizedString(item.name),
      amount: mapLocalizedString(item.amount),
    }));
  }, [mapLocalizedString]);

  // 取得行程資料（不再另外查 recipe）
  const fetchSchedule = useCallback(async () => {
    if (!user) {
      setSchedule([]); // 用戶登出時清空行程
      return;
    }
    setLoading(true);

    try {
      const q = query(collection(db, 'schedules'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const schedules: ScheduleItem[] = querySnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        // 將原始數據斷言為 Omit<ScheduleItem, 'id'> 以便安全存取
        const data = docSnap.data() as Omit<ScheduleItem, 'id'>;
        return {
          id: docSnap.id,
          ...data,
          // 額外處理 recipe 字段的型別安全
          recipe: data.recipe ? {
            title: mapLocalizedString(data.recipe.title),
            readyInMinutes: data.recipe.readyInMinutes?.toString() || '', // 確保是 string
            image: data.recipe.image || '',
            ingredients: {
              en: mapRawIngredientsArray(data.recipe.ingredients?.en as Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }> | undefined),
              zh: mapRawIngredientsArray(data.recipe.ingredients?.zh as Array<{ name: { zh?: string; en?: string; }; amount: { zh?: string; en?: string; }; }> | undefined),
            },
          } : undefined,
        };
      });

      setSchedule(schedules);
    } catch (error) {
      console.error('讀取行程失敗：', error);
    } finally {
      setLoading(false);
    }
  }, [user, mapLocalizedString, mapRawIngredientsArray]); 

  // 新增一筆行程（將 recipe 資料寫入 schedule）
  const addSchedule = async ({
    recipeId,
    date,
    mealType,
  }: {
    recipeId: string
    date: string
    mealType: 'breakfast' | 'lunch' | 'dinner'
  }) => {
    if (!user) return

    try {
      const recipeRef = doc(db, 'recipes', recipeId)
      const recipeSnap = await getDoc(recipeRef)

      if (!recipeSnap.exists()) throw new Error('找不到該食譜')

      // 修正：將 recipeData 斷言為 RawRecipeDataFromFirestore
      const recipeData = recipeSnap.data() as RawRecipeDataFromFirestore;

      const newItem: Omit<ScheduleItem, 'id'> = {
        userId: user.uid,
        recipeId,
        date,
        mealType,
        isDone: false,
        hasDiary: false,
        createdAt: new Date().toISOString(),
        reviewId: '',
        recipe: {
          title: mapLocalizedString(recipeData.title), // 使用 mapLocalizedString
          readyInMinutes: recipeData.readyInMinutes?.toString() || '', // 確保型別為 string
          image: recipeData.image || '',
          // 這裡的 ingredients 處理，假設 Firestore 存儲為 { en: raw[], zh: raw[] }
          ingredients: {
            en: mapRawIngredientsArray(recipeData.ingredients?.en),
            zh: mapRawIngredientsArray(recipeData.ingredients?.zh),
          },
        },
      }

      await addDoc(collection(db, 'schedules'), newItem)
      await fetchSchedule()
    } catch (error) {
      console.error('新增行程失敗：', error)
    }
  }

  const updateSchedule = async (
    id: string,
    updatedFields: Partial<Omit<ScheduleItem, 'id' | 'userId' | 'createdAt'>>
  ) => {
    if (!user) return

    try {
      const scheduleRef = doc(db, 'schedules', id)
      await updateDoc(scheduleRef, updatedFields)

      setSchedule((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
      )
    } catch (error) {
      console.error('更新行程失敗：', error)
    }
  }

  const deleteSchedule = async (id: string) => {
    if (!user) return

    try {
      const scheduleRef = doc(db, 'schedules', id)
      await deleteDoc(scheduleRef)

      setSchedule((prev) => prev.filter((item) => item.id !== id))

      console.warn('成功刪除行程:', id)
    } catch (error) {
      console.error('刪除行程失敗：', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      fetchSchedule()
    } else {
      setSchedule([])
    }
  }, [user, fetchSchedule])

  return {
    schedule,
    loading,
    addSchedule,
    fetchSchedule,
    updateSchedule,
    deleteSchedule,
  }
}

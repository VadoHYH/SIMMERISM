// hooks/useSchedule.ts
'use client'

import { useState, useEffect } from 'react'
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
} from 'firebase/firestore'
import { useAuthStore } from '@/stores/useAuthStore'

export type Ingredient = {
  name: { en: string; zh: string }
  amount: { en: string; zh: string }
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
    title: { zh: string; en: string }
    readyInMinutes: number
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

  // ✅ 取得行程資料（不再另外查 recipe）
  const fetchSchedule = async () => {
    if (!user) return
    setLoading(true)

    try {
      const q = query(collection(db, 'schedules'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      const schedules: ScheduleItem[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ScheduleItem, 'id'>),
      }))

      console.log('🔍 fetchSchedule 完成，共取得', schedules.length, '筆行程資料')
      setSchedule(schedules)
    } catch (error) {
      console.error('讀取行程失敗：', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ 新增一筆行程（將 recipe 資料寫入 schedule）
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

      if (!recipeSnap.exists()) throw new Error('❌ 找不到該食譜')

      const recipeData = recipeSnap.data()

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
          title: recipeData.title,
          readyInMinutes: recipeData.readyInMinutes,
          image: recipeData.image,
          ingredients: recipeData.ingredients || { en: [], zh: [] },
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

      console.log('🗑️ 成功刪除行程:', id)
    } catch (error) {
      console.error('刪除行程失敗：', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      console.log('👤 用戶已登入，開始獲取行程資料...')
      fetchSchedule()
    } else {
      console.log('❌ 用戶未登入，清空行程資料')
      setSchedule([])
    }
  }, [user])

  return {
    schedule,
    loading,
    addSchedule,
    fetchSchedule,
    updateSchedule,
    deleteSchedule,
  }
}

// hooks/useSchedule.ts
'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

export type Ingredient = {
  name: { en: string; zh: string }
  amount: { en: string; zh: string }
}

export type ScheduleItem = {
  id: string
  userId: string 
  recipeId: string
  date: string // e.g., "2025-05-29"
  mealType: 'breakfast' | 'lunch' | 'dinner'
  isDone: boolean
  hasDiary: boolean
  createdAt: string
  reviewId? :string
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
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // 取得行程資料
  const fetchSchedule = async () => {
    if (!user) return
    setLoading(true)

    try {
      const q = query(collection(db, 'schedules'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)

      const schedules: ScheduleItem[] = [];

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data() as Omit<ScheduleItem, 'id'>;
        const recipeRef = doc(db, 'recipes', data.recipeId);
        const recipeSnap = await getDoc(recipeRef);
        const recipeData = recipeSnap.exists() ? recipeSnap.data() : null;
  
        schedules.push({
          id: docSnap.id,
          ...data,
          recipe: recipeData ? {
            title: recipeData.title,
            readyInMinutes: recipeData.readyInMinutes,
            image: recipeData.image,
            ingredients: recipeData.ingredients || { en: [], zh: [] }
          } : undefined
        });
      }

      console.log('🔍 fetchSchedule 完成，共取得', schedules.length, '筆行程資料')
      console.log('📋 行程資料詳情:', schedules)
      setSchedule(schedules);
    } catch (error) {
      console.error('讀取行程失敗：', error)
    } finally {
      setLoading(false)
    }
  }

  // 新增一筆行程
  const addSchedule = async ({
    recipeId,
    date,
    mealType,
  }: {
    recipeId: string
    date: string
    mealType: 'breakfast' | 'lunch' | 'dinner'
  }) => {
    if (!user) {
      console.log("user", user)
      return
    }

    const newItem: Omit<ScheduleItem, 'id'> = {
      recipeId,
      date,
      mealType,
      isDone: false,
      hasDiary: false,
      createdAt: new Date().toISOString(),
      userId: user.uid,
      reviewId:"",
    }

    try {
      const docRef = await addDoc(collection(db, 'schedules'), newItem)
      
      // 新增後重新獲取完整資料（包含食譜資料）
      await fetchSchedule()
    } catch (error) {
      console.error('新增行程失敗：', error)
    }
  }

  const updateSchedule = async (
    id: string,
    updatedFields: Partial<Omit<ScheduleItem, 'id' | 'userId' | 'createdAt'>>
  ) => {
    if (!user) return;
  
    try {
      const scheduleRef = doc(db, 'schedules', id);
      await updateDoc(scheduleRef, updatedFields);
  
      // 本地 state 也更新
      setSchedule((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      );
    } catch (error) {
      console.error('更新行程失敗：', error);
    }
  };

  // 刪除行程
  const deleteSchedule = async (id: string) => {
    if (!user) return;
  
    try {
      const scheduleRef = doc(db, 'schedules', id);
      await deleteDoc(scheduleRef);
  
      // 本地 state 也更新，移除被刪除的項目
      setSchedule((prev) => prev.filter((item) => item.id !== id));
      
      console.log('🗑️ 成功刪除行程:', id);
    } catch (error) {
      console.error('刪除行程失敗：', error);
      throw error; // 重新拋出錯誤，讓調用方可以處理
    }
  };

  // 在用戶登入時自動獲取行程資料
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
    deleteSchedule
  }
}
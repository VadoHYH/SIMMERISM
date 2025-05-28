// hooks/useSchedule.ts
'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore';

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

      const data: ScheduleItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScheduleItem, 'id'>),
      }))

      setSchedule(data)
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
      setSchedule((prev) => [...prev, { ...newItem, id: docRef.id }])
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

  return {
    schedule,
    loading,
    addSchedule,
    fetchSchedule,
    updateSchedule,
  }
}

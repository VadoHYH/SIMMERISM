// hooks/useShoppingList.ts
import { useEffect, useMemo, useState } from 'react'
import { ScheduleItem } from './useSchedule'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

// 用於生成唯一 key（normalized 名稱 + 單位）
const getIngredientKey = (nameZh: string, unit: string) => {
  const normalizedName = nameZh.trim().toLowerCase()
  const normalizedUnit = unit.trim()
  return `${normalizedName}-${normalizedUnit}`
}

// 提取數字開頭的值，例如從 "0.5（0.5）" 提取出 0.5
const extractAmountNumber = (amount: string): number => {
  const match = amount.match(/^\d*\.?\d+/)
  return match ? parseFloat(match[0]) : 0
}

export type ShoppingItem = {
  key: string
  name: string
  unit: string
  totalAmount: number
}

// 統一的 localStorage key
const SHOPPING_LIST_STORAGE_KEY = 'simmerism_shopping_list_status'

// 全域狀態管理 - 用於在不同頁面間共享狀態
let globalCheckedItems: Record<string, boolean> = {}
let listeners: Set<(items: Record<string, boolean>) => void> = new Set()
let isGlobalInitialized = false // 確保全域狀態只初始化一次

// 初始化載入 localStorage 資料
const loadFromStorage = (): Record<string, boolean> => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(SHOPPING_LIST_STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('載入採購清單狀態失敗:', error)
    }
  }
  return {}
}

// 儲存到 localStorage
const saveToStorage = (items: Record<string, boolean>) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SHOPPING_LIST_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('儲存採購清單狀態失敗:', error)
    }
  }
}

// 初始化全域狀態（只執行一次）
const initializeGlobalState = () => {
  if (!isGlobalInitialized && typeof window !== 'undefined') {
    globalCheckedItems = loadFromStorage()
    isGlobalInitialized = true
    console.log('🚀 全域狀態初始化完成:', globalCheckedItems)
  }
}

// 更新全域狀態並通知所有監聽器
const updateGlobalState = (items: Record<string, boolean>) => {
  globalCheckedItems = { ...items } // 創建新的物件引用
  saveToStorage(globalCheckedItems)
  console.log('📝 更新全域狀態:', globalCheckedItems)
  
  // 通知所有監聽器
  listeners.forEach(listener => {
    try {
      listener(globalCheckedItems)
    } catch (error) {
      console.error('通知監聽器時發生錯誤:', error)
    }
  })
}

// 立即初始化（在模組載入時）
if (typeof window !== 'undefined') {
  initializeGlobalState()
}

export const useShoppingList = ({
  schedule,
  startDate,
  endDate,
}: {
  schedule: ScheduleItem[]
  startDate: string
  endDate: string
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  // 確保全域狀態已初始化，並同步到本地狀態
  useEffect(() => {
    initializeGlobalState()
    setCheckedItems({ ...globalCheckedItems })
    console.log('🔄 組件初始化，同步全域狀態:', globalCheckedItems)
  }, [])

  // 監聽全域狀態變化
  useEffect(() => {
    const listener = (items: Record<string, boolean>) => {
      console.log('🔔 收到全域狀態更新通知:', items)
      setCheckedItems({ ...items })
    }
    
    listeners.add(listener)
    
    return () => {
      listeners.delete(listener)
      console.log('🗑️ 移除狀態監聽器')
    }
  }, [])

  // 依據日期過濾行程
  const filteredSchedule = useMemo(() => {
    // 如果沒有提供日期範圍，返回空陣列
    if (!startDate || !endDate) {
      return []
    }
    
    const start = dayjs(startDate).startOf('day')
    const end = dayjs(endDate).endOf('day')
  
    return schedule.filter((item) => {
      const itemDate = dayjs(item.date)
      return itemDate.isSameOrAfter(start) && itemDate.isSameOrBefore(end)
    })
  }, [schedule, startDate, endDate])

  // 合併相同食材與加總數量
  const shoppingList: ShoppingItem[] = useMemo(() => {
    const map = new Map<string, ShoppingItem>()

    // console.log('🟡 filteredSchedule:', filteredSchedule)

    for (const item of filteredSchedule) {
      console.log(`🔍 檢查行程項目:`, {
          id: item.id,
          recipeId: item.recipeId,
          date: item.date,
          hasRecipe: !!item.recipe,
          recipeTitle: item.recipe?.title?.zh
        })
      // 直接使用 ScheduleItem 中的 recipe 資料
      if (!item.recipe) {
          console.warn(`⚠️ 行程中沒有食譜資料：scheduleId=${item.id}, recipeId=${item.recipeId}`)
          continue
      }

      const ingredients = item.recipe.ingredients?.zh || []

      // 確保 ingredients 是陣列且不為空
      if (!Array.isArray(ingredients)) {
          console.warn(`⚠️ ingredients 不是陣列，跳過食譜：${item.recipe.title?.zh || item.recipeId}`, ingredients)
          continue
      }

      if (ingredients.length === 0) {
          console.warn(`⚠️ ingredients 陣列為空，跳過食譜：${item.recipe.title?.zh || item.recipeId}`)
          continue
      }

      for (const ing of ingredients) {
          // 檢查食材結構
          if (!ing || !ing.name || !ing.amount) {
          console.warn(`⚠️ 食材資料結構不完整，跳過:`, ing)
          continue
          }

          const name = ing.name.zh
          const unit = ing.amount.zh
          
          // 檢查必要欄位
          if (!name || !unit) {
          console.warn(`⚠️ 食材名稱或單位缺失，跳過:`, ing)
          continue
          }

          const key = getIngredientKey(name, unit)
          const amount = extractAmountNumber(unit)
          const existing = map.get(key)

          if (existing) {
          existing.totalAmount += amount
          } else {
          map.set(key, {
              key,
              name,
              unit,
              totalAmount: amount,
          })
          }
      }
  }

    const finalList = Array.from(map.values())
    // console.log('✅ 最終 shoppingList:', finalList)
    return finalList
  }, [filteredSchedule])

  const toggleItem = (key: string) => {
    const newCheckedItems = {
      ...checkedItems,
      [key]: !checkedItems[key],
    }
    setCheckedItems(newCheckedItems)
    updateGlobalState(newCheckedItems) // 立即更新全域狀態
  }
  
  // 檢查項目是否被勾選
  const isChecked = (key: string) => !!checkedItems[key]
  
  // 全部完成
  const completeAll = () => {
    const allChecked: Record<string, boolean> = { ...checkedItems }
    for (const item of shoppingList) {
      allChecked[item.key] = true
    }
    setCheckedItems(allChecked)
    updateGlobalState(allChecked) // 立即更新全域狀態
  }
  // 清除全部
  const removeAll = () => {
    setCheckedItems({})
    updateGlobalState({}) // 立即更新全域狀態
  }

  // 移除單個項目
  const removeItem = (key: string) => {
    const updated = { ...checkedItems }
    delete updated[key]
    setCheckedItems(updated)
    updateGlobalState(updated) // 立即更新全域狀態
  }

  // 計算完成率
  const completionRate = useMemo(() => {
    const total = shoppingList.length
    if (total === 0) return 0
    const done = shoppingList.filter((item) => isChecked(item.key)).length
    return Math.round((done / total) * 100)
  }, [shoppingList, checkedItems])

  // //清除不存在的勾選狀態
  // useEffect(() => {
  //   const validKeys = new Set(shoppingList.map((item) => item.key))
  //   const currentKeys = Object.keys(checkedItems)
  //   const hasInvalidKeys = currentKeys.some(key => !validKeys.has(key))
    
  //   if (hasInvalidKeys) {
  //     const cleaned: Record<string, boolean> = {}
  //     for (const key of currentKeys) {
  //       if (validKeys.has(key)) {
  //         cleaned[key] = checkedItems[key]
  //       }
  //     }
  //     console.log('🧹 清理無效的勾選狀態')
  //     setCheckedItems(cleaned)
  //     updateGlobalState(cleaned)
  //   }
  // }, [shoppingList, checkedItems])

  return {
    shoppingList,
    toggleItem,
    isChecked,
    completeAll,
    removeAll,
    removeItem,
    completionRate,
    filteredSchedule, // 額外返回過濾後的行程，方便頁面顯示
  }
}

// 匯出清理函數，可在應用程式關閉時使用
export const clearShoppingListStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SHOPPING_LIST_STORAGE_KEY)
  }
  globalCheckedItems = {}
  updateGlobalState({})
}

// 匯出手動同步函數，可在需要時強制同步狀態
export const syncShoppingListState = () => {
  initializeGlobalState()
  return { ...globalCheckedItems }
}

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

    console.log('🟡 filteredSchedule:', filteredSchedule)

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
        console.log(`🟢 處理食譜：${item.recipe.title?.zh || item.recipeId}`)
        console.log(`🔍 ingredients 原始資料:`, ingredients)
        console.log(`🔍 ingredients 是否為陣列:`, Array.isArray(ingredients))
        console.log(`🔍 ingredients 類型:`, typeof ingredients)

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
    console.log('✅ 最終 shoppingList:', finalList)
    return finalList
  }, [filteredSchedule])

  // 注意：在真實專案中，如果你需要持久化，可以使用其他方式替代 localStorage
  // 例如：資料庫儲存、sessionStorage（如果環境支援）等
  
  // 讀取儲存的勾選狀態（這裡暫時移除 localStorage）
  // useEffect(() => {
  //   const saved = localStorage.getItem('shoppingListStatus')
  //   if (saved) {
  //     setCheckedItems(JSON.parse(saved))
  //   }
  // }, [])

  // 儲存勾選狀態（這裡暫時移除 localStorage）
  // useEffect(() => {
  //   localStorage.setItem('shoppingListStatus', JSON.stringify(checkedItems))
  // }, [checkedItems])

  const toggleItem = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isChecked = (key: string) => !!checkedItems[key]

  const completeAll = () => {
    const allChecked: Record<string, boolean> = {}
    for (const item of shoppingList) {
      allChecked[item.key] = true
    }
    setCheckedItems(allChecked)
  }

  const removeAll = () => {
    setCheckedItems({})
  }

  const removeItem = (key: string) => {
    setCheckedItems((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const completionRate = useMemo(() => {
    const total = shoppingList.length
    if (total === 0) return 0
    const done = shoppingList.filter((item) => isChecked(item.key)).length
    return Math.round((done / total) * 100)
  }, [shoppingList, checkedItems])

  // 清除不存在的勾選狀態
  useEffect(() => {
    const validKeys = new Set(shoppingList.map((item) => item.key))
    setCheckedItems((prev) => {
      const cleaned: Record<string, boolean> = {}
      for (const key of Object.keys(prev)) {
        if (validKeys.has(key)) {
          cleaned[key] = prev[key]
        }
      }
      return cleaned
    })
  }, [shoppingList])

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
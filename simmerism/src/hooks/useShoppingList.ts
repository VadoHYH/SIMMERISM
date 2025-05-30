// hooks/useSoppingList.ts
import { useEffect, useMemo, useState } from 'react'
import { ScheduleItem } from './useSchedule'
import { useRecipes } from './useRecipes'

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
  }: {
    schedule: ScheduleItem[]
    startDate: string
    endDate: string
  }) => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

    const [startDate, setStartDate] = useState(() => {
        const today = new Date()
        return today.toISOString().split('T')[0] // yyyy-mm-dd
    })

    const [endDate, setEndDate] = useState(() => {
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 6)
        return nextWeek.toISOString().split('T')[0]
    })
  
    const { recipes } = useRecipes()

    // 依據日期過濾行程
    const filteredSchedule = useMemo(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        return schedule.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate >= start && itemDate <= end
        })
    }, [schedule, startDate, endDate])

    // 合併相同食材與加總數量
    const shoppingList: ShoppingItem[] = useMemo(() => {
        const map = new Map<string, ShoppingItem>()
    
        for (const item of filteredSchedule) {
        const recipe = recipes.find((r) => r.id === item.recipeId)
        const ingredients = recipe?.ingredients || []
    
        for (const ing of ingredients) {
            const name = ing.name.zh
            const unit = ing.amount.zh
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
  
        return Array.from(map.values())
    }, [filteredSchedule, recipes])

    // 讀取 localStorage 狀態
    useEffect(() => {
        const saved = localStorage.getItem('shoppingListStatus')
        if (saved) {
        setCheckedItems(JSON.parse(saved))
        }
    }, [])

    // 寫入 localStorage
    useEffect(() => {
        localStorage.setItem('shoppingListStatus', JSON.stringify(checkedItems))
    }, [checkedItems])

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
        startDate,
        endDate,
        setStartDate,
        setEndDate,
    }
}

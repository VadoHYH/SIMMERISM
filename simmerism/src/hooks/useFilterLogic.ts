import { useState, useEffect } from "react"
import { FilterOptions } from "@/components/FilterModal"

const defaultFilters: FilterOptions = {
  ingredients: [],
  tools: [],
  time: null,
  servings: null,
  tags: [],
}

export function useFilterLogic(initialFilters?: FilterOptions) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || defaultFilters)
  const [showAllIngredients, setShowAllIngredients] = useState(false)
  const [showAllTools, setShowAllTools] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  const toggle = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K] extends (infer U)[] ? U | null : FilterOptions[K] | null) => {
    setFilters((prev) => {
      const prevValue = prev[key];

      // 判斷 prevValue 是否為陣列
      if (Array.isArray(prevValue)) {
        const currentArray = prevValue as (string | number)[]; 
        if (currentArray.includes(value as string | number)) { 
          return {
            ...prev,
            [key]: currentArray.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [key]: [...currentArray, value as string | number], 
          };
        }
      } else {
        return {
          ...prev,
          [key]: prevValue === value ? null : value,
        };
      }
    });
  };

  const reset = () => {
    setFilters(defaultFilters)
    setShowAllIngredients(false)
    setShowAllTools(false)
    setShowAllTags(false)
  }

  return {
    filters,
    setFilters,
    reset,
    toggle,
    showAllIngredients,
    setShowAllIngredients,
    showAllTools,
    setShowAllTools,
    showAllTags,
    setShowAllTags,
  }
}
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

  const toggle = (key: keyof FilterOptions, value: string | number | null) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] instanceof Array
        ? (prev[key] as any[]).includes(value)
          ? (prev[key] as any[]).filter((v) => v !== value)
          : [...(prev[key] as any[]), value]
        : prev[key] === value
        ? null
        : value,
    }))
  }

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
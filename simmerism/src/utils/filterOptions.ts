// ✅ /utils/filterOptions.ts
import { Recipe } from "@/types/recipe"

export const generateIngredientOptions = (
  recipes: Recipe[] = [],
  defaults: string[] = []
) => {
  const ingredientSet = new Set(defaults)
  recipes.forEach((recipe) => {
    recipe.ingredients?.forEach((ing) => {
      if (ing.name?.zh) {
        ingredientSet.add(ing.name.zh)
      }
    })
  })
  return Array.from(ingredientSet).sort()
}
  
  export const generateToolOptions = (recipes: Recipe[] = [], defaults: string[] = []) => {
    const toolSet = new Set(defaults)
    recipes.forEach((recipe) => {
      recipe.equipment?.forEach((tool) => {
        if (tool.zh) toolSet.add(tool.zh)
      })
    })
    return Array.from(toolSet).sort()
  }
  
  export const generateTagOptions = (recipes: Recipe[] = []) => {
    const tagSet = new Set<string>()
    recipes.forEach((recipe) => {
      recipe.dishTypes?.forEach((type) => type.zh && tagSet.add(type.zh))
      recipe.diets?.forEach((diet) => diet.zh && tagSet.add(diet.zh))
    })
    return Array.from(tagSet).sort()
  }
  
export interface Ingredient {
    name: { en: string; zh: string }
    amount: { en: string; zh: string }
}
  
export interface Recipe {
    id: string
    title: { zh: string; en: string }
    summary: { en: string[]; zh: string[] }
    image: string
    ingredients: Ingredient[]
    instructions: { en: string; zh: string }
    equipment: { en: string; zh: string }[]
    liked?: boolean
    readyInMinutes?: string
    servings?: string
    dishTypes?: { zh: string; en: string }[]
    diets?: { zh: string; en: string }[]
}
  
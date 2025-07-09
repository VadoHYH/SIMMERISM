export interface LocalizedString { 
    en: string;
    zh: string;
}

export interface Ingredient {
    name: LocalizedString;
    amount: LocalizedString;
}
  
export interface Recipe {
    id: string
    title: LocalizedString;
    summary: LocalizedString;
    image: string
    ingredients: Ingredient[];
    instructions: LocalizedString;
    equipment: LocalizedString[];
    liked?: boolean
    readyInMinutes?: string
    servings?: string
    dishTypes?: LocalizedString[];
    diets?: LocalizedString[];
}
  
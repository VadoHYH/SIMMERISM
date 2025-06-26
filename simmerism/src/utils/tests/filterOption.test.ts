import {
    generateIngredientOptions,
    generateToolOptions,
    generateTagOptions,
  } from "@/utils/filterOptions"
  
  import type { Recipe } from "@/types/recipe"
  
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      title: { zh: "香煎雞肉", en: "Pan-fried Chicken" },
      summary: { zh: ["簡單又美味"], en: ["Simple and delicious"] },
      image: "https://example.com/chicken.jpg",
      ingredients: [
        {
          name: { zh: "雞肉", en: "chicken" },
          amount: { zh: "200克", en: "200g" }
        },
        {
          name: { zh: "豆腐", en: "tofu" },
          amount: { zh: "100克", en: "100g" }
        },
        {
          name: { zh: "蔥", en: "green onion" },
          amount: { zh: "2根", en: "2 stalks" }
        }
      ],
      instructions: { zh: "煎雞肉", en: "Pan fry the chicken" },
      equipment: [
        { zh: "平底鍋", en: "frying pan" },
        { zh: "烤箱", en: "oven" }
      ],
      dishTypes: [{ zh: "家常菜", en: "home-style" }],
      diets: [{ zh: "蛋奶素", en: "lacto-ovo vegetarian" }],
      liked: false
    },
    {
      id: "2",
      title: { zh: "氣炸蝦", en: "Air Fried Shrimp" },
      summary: { zh: ["快速料理"], en: ["Quick meal"] },
      image: "https://example.com/shrimp.jpg",
      ingredients: [
        {
          name: { zh: "蝦", en: "shrimp" },
          amount: { zh: "8隻", en: "8 pieces" }
        }
      ],
      instructions: { zh: "放入氣炸鍋", en: "Put into air fryer" },
      equipment: [{ zh: "氣炸鍋", en: "air fryer" }],
      dishTypes: [{ zh: "海鮮料理", en: "seafood" }],
      diets: [],
      liked: true
    }
  ]
  
  
  describe("generateIngredientOptions", () => {
    it("should include default and recipe ingredients without duplicates", () => {
      const defaultIngredients = ["雞肉", "牛肉"]
      const result = generateIngredientOptions(mockRecipes, defaultIngredients)
      expect(result).toEqual(["牛肉", "雞肉", "豆腐", "蝦", "蔥"].sort()) // 排序過的
    })
  })
  
  describe("generateToolOptions", () => {
    it("should combine default and recipe tools", () => {
      const defaultTools = ["電鍋"]
      const result = generateToolOptions(mockRecipes, defaultTools)
      expect(result).toEqual(["平底鍋", "氣炸鍋", "烤箱", "電鍋"])
    })
  })
  
  describe("generateTagOptions", () => {
    it("should extract zh tags from dishTypes and diets", () => {
      const result = generateTagOptions(mockRecipes)
      expect(result).toEqual(["家常菜", "海鮮料理", "蛋奶素"])
    })
  })
  
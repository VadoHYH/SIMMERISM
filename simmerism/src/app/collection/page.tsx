"use client"
import RecipeCard from "@/components/recipeCard"
import Link from "next/link"
import { useRecipes } from "@/hooks/useRecipes"

export default function CollectionPage() {
    const { recipes } = useRecipes()
    
  return (
    <div className="bg-[#f9f5f1] min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">我的收藏</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                    <RecipeCard {...recipe} />
                </Link>
                ))}
            </div>
      </div>
    </div>
  )
}

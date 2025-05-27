//components/recipeCard.tsx
import { Heart } from "lucide-react"
import Image from "next/image"

interface RecipeCardProps {
  id: string
  title: { zh: string; en: string}
  image: string
  liked?: boolean
  dishTypes?: { zh: string; en: string}[]
  diets?: { zh: string; en: string}[]
  readyInMinutes?: string
  onLike?: (id: string) => void
}

export default function RecipeCard({
  id,
  title,
  image,
  liked = false,
  dishTypes = [],
  diets = [],
  readyInMinutes,
  onLike,
}: RecipeCardProps) {
  const tags = [
    ...(dishTypes ? dishTypes.map(type => type.zh) : []),
    ...(diets ? diets.map(diet => diet.zh) : [])
  ]

  return (
    <div className="border-2 border-black rounded overflow-hidden">
      <div className="bg-gray-200 aspect-square relative">
        <Image src={image || "/placeholder.svg"} alt={title.zh} fill className="object-cover" />
      </div>
      <div className="bg-[#ffc278] p-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">{title.zh}</h3>
          <button
            onClick={() => onLike?.(id)}
            className="text-black hover:scale-105 transition-transform"
            aria-label="收藏這道食譜"
          >
            <Heart className={liked ? "fill-black" : ""} size={20} />
          </button>
        </div>
        <p className="text-xs mt-1">{readyInMinutes}分鐘</p>

        {/* 顯示合併後的標籤 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs border border-black rounded px-1 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
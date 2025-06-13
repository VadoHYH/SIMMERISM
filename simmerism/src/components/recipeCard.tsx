import { Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface RecipeCardProps {
  id: string
  title: { zh: string; en: string }
  image: string
  liked?: boolean
  dishTypes?: { zh: string; en: string }[]
  diets?: { zh: string; en: string }[]
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
  const router = useRouter()
  const [showAllTags, setShowAllTags] = useState(false)
  const MAX_VISIBLE_TAGS = 4

  const tags = [
    ...(dishTypes ? dishTypes.map((type) => type.zh) : []),
    ...(diets ? diets.map((diet) => diet.zh) : []),
  ]

  const displayedTags = showAllTags ? tags : tags.slice(0, MAX_VISIBLE_TAGS)
  const hiddenTagCount = tags.length - MAX_VISIBLE_TAGS

  return (
    <div
      className="flex flex-col h-fit border-2 border-black rounded overflow-hidden hover:neo-card transition-all cursor-pointer"
      onClick={() => router.push(`/recipe/${id}`)}
    >
      {/* Image */}
      <div className="bg-gray-200 relative w-full aspect-[4/3]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title.zh}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="bg-[#ffc278] p-2 flex flex-col gap-2 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">{title.zh}</h3>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onLike?.(id)
            }}
            className="text-black hover:scale-105 transition-transform"
            aria-label="收藏這道食譜"
          >
            <Heart className={liked ? "fill-black" : ""} size={20} />
          </button>
        </div>

        <p className="text-xs">{readyInMinutes} 分鐘</p>

        <div className="flex flex-wrap gap-1">
          {displayedTags.map((tag, index) => (
            <span
              key={index}
              className="text-xs border border-black rounded px-1 whitespace-nowrap"
            >
              {tag}
            </span>
          ))}

          {hiddenTagCount > 0 && !showAllTags && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowAllTags(true)
              }}
              className="text-xs border border-black rounded px-1 bg-[#519181] text-white hover:bg-[#417366]"
            >
              +{hiddenTagCount} 更多
            </button>
          )}

          {showAllTags && hiddenTagCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowAllTags(false)
              }}
              className="text-xs border border-black rounded px-1 bg-[#519181] text-white hover:bg-[#417366]"
            >
              收起
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

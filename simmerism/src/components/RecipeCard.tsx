import { Heart } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
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
  const [maxVisibleTags, setMaxVisibleTags] = useState(5)

  const tags = [
    ...dishTypes.map((type) => type.zh),
    ...diets.map((diet) => diet.zh),
  ]

  // 設定 maxVisibleTags 根據螢幕寬度
  useEffect(() => {
    const updateVisibleTags = () => {
      const width = window.innerWidth
      if (width < 640) setMaxVisibleTags(1)
      else if (width < 1024) setMaxVisibleTags(3)
      else setMaxVisibleTags(4)
    }

    updateVisibleTags()
    window.addEventListener("resize", updateVisibleTags)
    return () => window.removeEventListener("resize", updateVisibleTags)
  }, [])

  const displayedTags = showAllTags ? tags : tags.slice(0, maxVisibleTags)
  const hiddenTagCount = tags.length - maxVisibleTags

  return (
    <div
      className="flex flex-col h-fit border-2 border-black rounded overflow-hidden hover:neo-card transition-all cursor-pointer"
      onClick={() => router.push(`/recipe/${id}`)}
    >
      {/* 圖片 */}
      <div className="bg-gray-200 relative w-full aspect-[4/3]">
        <Image
          src={image || "/placeholder.svg"}
          alt={title.zh}
          fill
          className="object-cover"
        />
      </div>

      {/* 內容 */}
      <div className="bg-[#ffc278] p-2 flex flex-col gap-2 flex-grow">
        {/* 標題與收藏 */}
        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-bold text-sm sm:text-base lg:text-lg truncate"
            title={title.zh}
          >
            {title.zh}
          </h3>
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

        {/* 時間 */}
        <p className="text-xs">{readyInMinutes} 分鐘</p>

        {/* 標籤 */}
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

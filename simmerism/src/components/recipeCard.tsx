import { Heart } from "lucide-react"
import Image from "next/image"

interface RecipeCardProps {
  id: string
  title: string
  imageUrl: string
  liked?: boolean
}

export default function RecipeCard({ id, title, imageUrl, liked = false }: RecipeCardProps) {
  return (
    <div className="border-2 border-black rounded overflow-hidden ">
      <div className="bg-gray-200 aspect-square relative">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="bg-[#ffc278] p-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">{title}</h3>
          <button className="text-black">
            <Heart className={liked ? "fill-black" : ""} size={20} />
          </button>
        </div>
        <p className="text-xs mt-1">30分鐘</p>
        <div className="flex gap-1 mt-2">
          <span className="text-xs border border-black rounded px-1">主食</span>
          <span className="text-xs border border-black rounded px-1">下飯</span>
          <span className="text-xs border border-black rounded px-1">醬汁控</span>
          <span className="text-xs border border-black rounded px-1">DIY排骨</span>
        </div>
      </div>
    </div>
  )
}

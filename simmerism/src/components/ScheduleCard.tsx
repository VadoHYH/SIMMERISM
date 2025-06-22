//components/ScheduleCard.tsx
import type { ScheduleItem } from '@/hooks/useSchedule';
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

type ScheduleCardProps = {
    schedule: ScheduleItem;
    onClickStatus: (schedule: ScheduleItem) => void;
    onDelete?: (schedule: ScheduleItem) => void; // optional handler
};

export default function ScheduleCard({ schedule, onClickStatus, onDelete }: ScheduleCardProps) {
    // const getStatusButton = () => {
    //   if (!schedule.isDone) {
    //     return <button onClick={() => onClickStatus(schedule)} className="bg-[#ffc278] text-black p-1 neo-button">完成料理</button>;
    //   }
    //   if (schedule.isDone && !schedule.reviewId) {
    //     return <button onClick={() => onClickStatus(schedule)} className="bg-[#F7CEFA] border border-black p-1 neo-button">撰寫食記</button>;
    //   }
    //   return (
    //     <button onClick={() => onClickStatus(schedule)} className="bg-[#5a9a8e] border border-black p-1 neo-button">
    //       查看食記
    //     </button>
    //   );
    // };
    const router = useRouter()

    const handleCardClick = () => {
      if (schedule.recipeId) {
        router.push(`/recipe/${schedule.recipeId}`)
      }
    }
    
    const getStatusButton = () => {
      return (
        <button
          onClick={() => onClickStatus(schedule)}
          className={`p-1 sm:p-2 lg:px-4 neo-button border border-black text-sm sm:text-base ${
            schedule.isDone ? 'bg-[#5a9a8e] text-white' : 'bg-[#ffc278] text-black'
          }`}
        >
          {schedule.isDone ? '取消完成' : '完成料理'}
        </button>
      );
    };
  
    return (
      <div 
        className="flex items-center border-b border-gray-200 py-3 sm:py-4 lg:py-6"
        onClick={handleCardClick}
      >
        {/* 食譜圖片 */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 mr-3 sm:mr-4 aspect-square relative">
          <Image
            src={schedule.recipe?.image || "/placeholder.svg"}
            alt={schedule.recipe?.title?.zh || "食譜圖片"}
            fill
            className="object-cover rounded"
          />
        </div>

        {/* 食譜資訊 */}
        <div className="flex-1 text-sm sm:text-base lg:text-lg leading-snug">
          <div className="font-semibold truncate">{schedule.recipe?.title?.zh || '未知食譜'}</div>
          <div className="text-gray-500">
            {schedule.recipe?.readyInMinutes ? `${schedule.recipe.readyInMinutes} 分鐘` : '時間未知'}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div 
          className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onDelete?.(schedule)}
            className="bg-[#ff6347] text-black p-1 sm:p-2 lg:px-3 neo-button border border-black"
          >
            <Trash2 size={20} />
          </button>
          {getStatusButton()}
        </div>
      </div>
    );
}
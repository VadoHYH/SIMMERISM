//components/ScheduleCard.tsx
import type { ScheduleItem } from '@/hooks/useSchedule';
import Image from "next/image"
import { Trash2 } from "lucide-react"

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
    
    const getStatusButton = () => {
      return (
        <button
          onClick={() => onClickStatus(schedule)}
          className={`p-1 neo-button border border-black ${
            schedule.isDone ? 'bg-[#5a9a8e] text-white' : 'bg-[#ffc278] text-black'
          }`}
        >
          {schedule.isDone ? '取消完成' : '完成料理'}
        </button>
      );
    };
  
    return (
      <div className="flex items-center border-b border-gray-200 py-3">
        <div className="w-12 h-12 bg-gray-200 mr-4 aspect-square relative">
        <Image
            src={schedule.recipe?.image || "/placeholder.svg"}
            alt={schedule.recipe?.title?.zh || "食譜圖片"}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <span>{schedule.recipe?.title?.zh || '未知食譜'}</span>
          <span className="text-sm text-gray-500 ml-4">
            {schedule.recipe?.readyInMinutes ? `${schedule.recipe.readyInMinutes} 分鐘` : '時間未知'}
          </span>
        </div>
        <button onClick={() => onDelete?.(schedule)} className="bg-[#ff6347] text-black p-1 mr-2 neo-button"><Trash2 size={20}></Trash2></button>
        {getStatusButton()}
      </div>
    );
}
//components/ScheduleCard.tsx
import type { ScheduleItem } from '@/hooks/useSchedule';

type ScheduleCardProps = {
    schedule: ScheduleItem;
    onClickStatus: (schedule: ScheduleItem) => void;
    onDelete?: (schedule: ScheduleItem) => void; // optional handler
};

export default function ScheduleCard({ schedule, onClickStatus, onDelete }: ScheduleCardProps) {
    const getStatusButton = () => {
      if (!schedule.isDone) {
        return <button onClick={() => onClickStatus(schedule)} className="bg-[#5a9a8e] text-white p-1">完成料理</button>;
      }
      if (schedule.isDone && !schedule.reviewId) {
        return <button onClick={() => onClickStatus(schedule)} className="bg-[#ffc278] border border-black p-1">撰寫食記</button>;
      }
      return (
        <button onClick={() => onClickStatus(schedule)} className="bg-purple-200 border border-purple-500 p-1">
          <span className="text-purple-700 text-sm">查看食記</span>
        </button>
      );
    };
    
  
    return (
      <div className="flex items-center border-b border-gray-200 py-3">
        <div className="w-12 h-12 bg-gray-200 mr-4"></div>
        <div className="flex-1">
          <span>{schedule.recipeId}</span>
          <span className="text-sm text-gray-500 ml-4">20分鐘</span>
        </div>
        <button onClick={() => onDelete?.(schedule)} className="bg-[#ff6347] text-white p-1 mr-2">刪</button>
        {getStatusButton()}
      </div>
    );
}
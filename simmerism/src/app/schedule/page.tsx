//app/schedule/page.tsx
"use client"

import { useEffect,useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from 'dayjs'
import { useSchedule, ScheduleItem} from '@/hooks/useSchedule';
import ScheduleCard from '@/components/ScheduleCard';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
  const router = useRouter();
  const { schedule, fetchSchedule, updateSchedule } = useSchedule();
  const [loading, setLoading] = useState(true);

  const filteredSchedules = schedule.filter(
    s => s.date === currentDate.format('YYYY-MM-DD')
  );

  const breakfastSchedules = filteredSchedules.filter(s => s.mealType === 'breakfast');
  const lunchSchedules = filteredSchedules.filter(s => s.mealType === 'lunch');
  const dinnerSchedules = filteredSchedules.filter(s => s.mealType === 'dinner');

  const formatDate = (date: dayjs.Dayjs) => date.format('YYYY年M月D日');
  const [currentDate, setCurrentDate] = useState(dayjs());
  

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);
  
  

  if (loading) return <p>Loading...</p>;

  if (schedule.length === 0) return <p>還未安排任何行程</p>;

  const handleScheduleClick = async (schedule: ScheduleItem) => {
    if (!schedule.id) {
      console.error('Schedule ID 為 undefined，無法處理');
      return;
    }
    
    if (!schedule.isDone) {
      await updateSchedule(schedule.id, { isDone: true });
    } else if (schedule.isDone && !schedule.reviewId) {
      router.push(`/reviews/create?scheduleId=${schedule.id}`);
    } else {
      router.push(`/reviews/${schedule.reviewId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">本日菜單</h1>

        <div className="flex justify-between items-center mb-8">
          <button 
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center"
            onClick={() => setCurrentDate(prev => prev.subtract(1, 'day'))}
          >
            <ChevronLeft size={18} className="mr-1" /> 前一天
          </button>

          <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold">{formatDate(currentDate)}</div>

          <button 
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center"
            onClick={() => setCurrentDate(prev => prev.add(1, 'day'))}
          >
            後一天 <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        <div className="space-y-8">
          {/* 早餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              早
            </div>

            {breakfastSchedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClickStatus={handleScheduleClick}
              />
            ))}
          </div>

          {/* 中餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              中
            </div>

            {lunchSchedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClickStatus={handleScheduleClick}
              />
            ))}
          </div>

          {/* 晚餐 */}
          <div className="border-2 border-black rounded p-6">
            <div className="relative w-12 h-12 bg-[#5a9a8e] rounded-full flex items-center justify-center text-white font-bold mb-4">
              晚
            </div>

            {dinnerSchedules.map(schedule => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                onClickStatus={handleScheduleClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

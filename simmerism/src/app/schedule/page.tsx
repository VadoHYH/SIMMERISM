//app/schedule/page.tsx
"use client"

import { useEffect,useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from 'dayjs'
import { useSchedule, ScheduleItem} from '@/hooks/useSchedule';
import ScheduleCard from '@/components/ScheduleCard';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function SchedulePage() {
  const router = useRouter();
  const { schedule, fetchSchedule, updateSchedule, loading } = useSchedule();
  const [localLoading, setLoading] = useState(true);
  
  const formatDate = (date: dayjs.Dayjs) => date.format('YYYY年M月D日');
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const filteredSchedules = schedule.filter(
    s => s.date === currentDate.format('YYYY-MM-DD')
  );

  const breakfastSchedules = filteredSchedules.filter(s => s.mealType === 'breakfast');
  const lunchSchedules = filteredSchedules.filter(s => s.mealType === 'lunch');
  const dinnerSchedules = filteredSchedules.filter(s => s.mealType === 'dinner');

  useEffect(() => {
    const loadData = async () => {
      await fetchSchedule();
      setLoading(false); // ✅ 記得設定 loading 為 false
    };
    loadData();
  }, [fetchSchedule]);
  
  if (localLoading) return <p>Loading...</p>;

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
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center neo-button"
            onClick={() => setCurrentDate(prev => prev.subtract(1, 'day'))}
          >
            <ChevronLeft size={18} className="mr-1" /> 前一天
          </button>

          <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold neo-button">
            <DatePicker
              selected={currentDate.toDate()}
              onChange={(date) => setCurrentDate(dayjs(date))}
              dateFormat="yyyy/MM/dd"
              className="text-center border border-black rounded px-2 py-1 font-bold bg-white"
            />
          </div>

          <button 
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center neo-button"
            onClick={() => setCurrentDate(prev => prev.add(1, 'day'))}
          >
            後一天 <ChevronRight size={18} className="ml-1" />
          </button>
        </div>

        <div className="space-y-8">
          {/* 早餐 */}
          <div className="border-2 border-black rounded p-6 ">
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mb-4">
              <svg
                viewBox="0 0 218 217"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M109 0L124.022 28.642L148.375 7.36053L152.036 39.4948L182.433 28.448L174.238 59.7346L206.573 60.4145L187.629 86.6281L217.535 98.9427L190.401 116.543L213.839 138.829L182.18 145.439L195.984 174.687L164.075 169.414L166.381 201.674L138.532 185.23L129.029 216.144L109 190.75L88.9713 216.144L79.4685 185.23L51.6189 201.674L53.9254 169.414L22.0161 174.687L35.8204 145.439L4.161 138.829L27.5987 116.543L0.464973 98.9427L30.3708 86.6281L11.4272 60.4145L43.7621 59.7346L35.5672 28.448L65.9642 39.4948L69.6247 7.36053L93.9785 28.642L109 0Z"
                  fill="#519181"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                早
              </div>
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
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mb-4">
              <svg
                viewBox="0 0 218 217"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M109 0L124.022 28.642L148.375 7.36053L152.036 39.4948L182.433 28.448L174.238 59.7346L206.573 60.4145L187.629 86.6281L217.535 98.9427L190.401 116.543L213.839 138.829L182.18 145.439L195.984 174.687L164.075 169.414L166.381 201.674L138.532 185.23L129.029 216.144L109 190.75L88.9713 216.144L79.4685 185.23L51.6189 201.674L53.9254 169.414L22.0161 174.687L35.8204 145.439L4.161 138.829L27.5987 116.543L0.464973 98.9427L30.3708 86.6281L11.4272 60.4145L43.7621 59.7346L35.5672 28.448L65.9642 39.4948L69.6247 7.36053L93.9785 28.642L109 0Z"
                  fill="#519181"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                午
              </div>
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
          <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold mb-4">
              <svg
                viewBox="0 0 218 217"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M109 0L124.022 28.642L148.375 7.36053L152.036 39.4948L182.433 28.448L174.238 59.7346L206.573 60.4145L187.629 86.6281L217.535 98.9427L190.401 116.543L213.839 138.829L182.18 145.439L195.984 174.687L164.075 169.414L166.381 201.674L138.532 185.23L129.029 216.144L109 190.75L88.9713 216.144L79.4685 185.23L51.6189 201.674L53.9254 169.414L22.0161 174.687L35.8204 145.439L4.161 138.829L27.5987 116.543L0.464973 98.9427L30.3708 86.6281L11.4272 60.4145L43.7621 59.7346L35.5672 28.448L65.9642 39.4948L69.6247 7.36053L93.9785 28.642L109 0Z"
                  fill="#519181"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                晚
              </div>
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

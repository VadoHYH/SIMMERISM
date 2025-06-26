//app/schedule/page.tsx
"use client"

import { useEffect,useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import dayjs from 'dayjs'
import { useSchedule, ScheduleItem} from '@/hooks/useSchedule';
import ScheduleCard from '@/components/ScheduleCard';
import { useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker' 
import { useAuthStore } from "@/stores/useAuthStore"

export default function SchedulePage() {
  const router = useRouter();
  const { schedule, updateSchedule, deleteSchedule, loading } = useSchedule();
  const user = useAuthStore((state) => state.user)
  const loadingAuth = useAuthStore(state => state.loading)
  
  const formatDate = (date: dayjs.Dayjs) => date.format('YYYY年M月D日');
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const filteredSchedules = schedule.filter(
    s => s.date === currentDate.format('YYYY-MM-DD')
  );

  const breakfastSchedules = filteredSchedules.filter(s => s.mealType === 'breakfast');
  const lunchSchedules = filteredSchedules.filter(s => s.mealType === 'lunch');
  const dinnerSchedules = filteredSchedules.filter(s => s.mealType === 'dinner');

  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/")
    }
  }, [user, loadingAuth, router])
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        ⏳ 資料載入中...
      </div>
    )
  }

  if (!loading &&schedule.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9f5f1] flex items-center justify-center">
        <div className="bg-white border-2 border-black rounded-lg p-8 max-w-md text-center space-y-6">
          <h2 className="text-2xl font-bold">目前尚未安排任何行程</h2>
          <p className="text-gray-600">可以開始探索食譜並加入喜歡的餐點到行程中喔！</p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold rounded-lg hover:bg-[#ffb452] neo-button"
              onClick={() => router.push('/search')}
            >
              去探索食譜
            </button>
            <button
              className="bg-white border-2 border-black px-4 py-2 font-bold rounded-lg hover:bg-gray-100 neo-button"
              onClick={() => router.push('/collection')}
            >
              查看收藏清單
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleScheduleClick = async (schedule: ScheduleItem) => {
    if (!schedule.id) {
      console.error('Schedule ID 為 undefined，無法處理');
      return;
    }
    
    // if (!schedule.isDone) {
    //   await updateSchedule(schedule.id, { isDone: true });
    // } else if (schedule.isDone && !schedule.reviewId) {
    //   router.push(`/reviews/create?scheduleId=${schedule.id}`);
    // } else {
    //   router.push(`/reviews/${schedule.reviewId}`);
    // }

    if (!schedule.reviewId) {
      await updateSchedule(schedule.id, { isDone: !schedule.isDone });
    } else {
      // 已經有食記的情況，就導向該頁
      router.push(`/reviews/${schedule.reviewId}`);
    }
  };

  const handleDeleteClick = (schedule: ScheduleItem) => {
    setConfirmDeleteItem(schedule);
  };
  
  const confirmDelete = async () => {
    if (!confirmDeleteItem?.id) return;
  
    try {
      await deleteSchedule(confirmDeleteItem.id);
      setSuccessMessage("已成功刪除行程！");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("刪除行程失敗:", error);
      alert("刪除行程失敗，請稍後再試");
    } finally {
      setConfirmDeleteItem(null); // 關閉彈窗
    }
  };

  return (
    <>
    {successMessage && (
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-[#ffc278] text-black border-2 border-black px-6 py-2 rounded-lg shadow-md font-bold z-50 neo-button transition-all duration-300">
        ✅ {successMessage}
      </div>
    )}

    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">本日菜單</h1>

        <div className="flex justify-between items-center mb-8">
          <button 
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center justify-center gap-1 neo-button"
            onClick={() => setCurrentDate(prev => prev.subtract(1, 'day'))}
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">前一天</span>
          </button>

          <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold neo-button">
            <DatePicker
              selected={currentDate.toDate()}
              onChange={(date: Date | null) => {
                if (date) {
                  setCurrentDate(dayjs(date))
                }
              }}
              dateFormat="yyyy/MM/dd"
            />
          </div>

          <button 
            className="bg-[#ffc278] border-2 border-black px-4 py-2 font-bold flex items-center justify-center gap-1 neo-button"
            onClick={() => setCurrentDate(prev => prev.add(1, 'day'))}
          >
            <span className="hidden sm:inline">後一天</span>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="space-y-8">
          {/* 早餐 */}
          <div className="border-2 border-black rounded p-6 bg-white">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-bold mb-4">
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

            {breakfastSchedules.length === 0 ? (
              <div className="text-gray-600 p-4 border border-dashed border-gray-300 rounded-lg text-center">
                🍞 早餐還沒安排呢～  
                <button
                  className="ml-2 text-[#519181] underline hover:text-[#3e6f63]"
                  onClick={() => router.push('/search')}
                >
                  去探索食譜
                </button>
              </div>
            ) : (
              breakfastSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onClickStatus={handleScheduleClick}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </div>

          {confirmDeleteItem && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white border-2 border-black rounded-xl p-6 w-[90%] max-w-md space-y-4 neo-button shadow-lg">
                <h2 className="text-xl font-bold">要刪除這個行程嗎？</h2>
                <p className="text-gray-700 text-sm">
                  「{confirmDeleteItem.recipe?.title?.zh || '未知食譜'}」將從行程中移除。
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-white border-2 border-black hover:bg-gray-100 font-bold"
                    onClick={() => setConfirmDeleteItem(null)}
                  >
                    取消
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-[#ffc278] border-2 border-black hover:bg-[#ffb452] font-bold"
                    onClick={confirmDelete}
                  >
                    確定刪除
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 中餐 */}
          <div className="border-2 border-black rounded p-6 bg-white">
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

            {lunchSchedules.length === 0 ? (
              <div className="text-gray-600 p-4 border border-dashed border-gray-300 rounded-lg text-center">
                🍛 午餐還沒安排呢～
                <button
                  className="ml-2 text-[#519181] underline hover:text-[#3e6f63]"
                  onClick={() => router.push('/search')}
                >
                  去探索食譜
                </button>
              </div>
            ) : (
              lunchSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onClickStatus={handleScheduleClick}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </div>

          {/* 晚餐 */}
          <div className="border-2 border-black rounded p-6 bg-white">
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

            {dinnerSchedules.length === 0 ? (
              <div className="text-gray-600 p-4 border border-dashed border-gray-300 rounded-lg text-center">
                🍲 晚餐還沒安排呢～
                <button
                  className="ml-2 text-[#519181] underline hover:text-[#3e6f63]"
                  onClick={() => router.push('/search')}
                >
                  去探索食譜
                </button>
              </div>
            ) : (
              dinnerSchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  onClickStatus={handleScheduleClick}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

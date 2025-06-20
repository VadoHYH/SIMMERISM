//app/shopping/page.tsx
'use client'

import { Trash2 } from 'lucide-react'
import { useEffect,useState } from 'react'
import { useShoppingList } from '@/hooks/useShoppingList'
import { useSchedule } from '@/hooks/useSchedule' // 假設這裡提供行程資料
import DatePicker from '@/components/DatePicker' 
import { format, addDays } from 'date-fns'
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "next/navigation";

export default function ShoppingPage() {
  const user = useAuthStore((state) => state.user)
  const loadingAuth = useAuthStore(state => state.loading)
  const router = useRouter();
  const today = new Date()
  const oneWeekLater = addDays(today, 6)

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([today, oneWeekLater])
  const [startDate, endDate] = dateRange

  const { schedule } = useSchedule()

  const formattedStart = startDate ? format(startDate, 'yyyy-MM-dd') : ''
  const formattedEnd = endDate ? format(endDate, 'yyyy-MM-dd') : ''

  const {
    shoppingList,
    toggleItem,
    isChecked,
    completeAll,
    removeAll,
    removeItem,
    completionRate,
  } = useShoppingList({
    schedule,
    startDate: formattedStart,
    endDate: formattedEnd,
  })

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push("/")
    }
  }, [user, loadingAuth, router])

  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">採購清單</h1>

        <div className="space-y-6 md:space-y-8">
          {/* 本周需採購清單 */}
          <div className="bg-white border-2 border-black rounded p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold">本周需採購清單</h2>
              {/* 可以未來加入時間區間編輯按鈕 */}
              {/* <button className="p-2 border border-purple-500 rounded">
                <Edit size={16} className="text-purple-500" />
              </button> */}
            </div>

            {/* 日期選擇區塊 - 改善 RWD */}
            <div className="flex justify-center md:justify-start items-center mb-6 md:mb-8">
              <div className="bg-[#ffc278] border-2 border-black px-3 md:px-6 py-2 font-bold neo-button w-full md:w-auto min-w-0">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(dates: [Date | null, Date | null]) => {
                    setDateRange(dates)
                  }}  
                  isClearable={true}
                />
              </div>
            </div>

            {/* 採購清單 */}
            <div className="space-y-3 md:space-y-4">
              {shoppingList.map((item) => (
                <div key={item.key} className="border-b border-gray-200 pb-3 md:pb-4">
                  <div className="flex items-center group hover:bg-gray-50 p-2 rounded gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      className="flex-shrink-0 h-4 w-4 md:h-5 md:w-5 cursor-pointer"
                      checked={isChecked(item.key)}
                      onChange={() => toggleItem(item.key)}
                    />
                    <span 
                      className={`flex-1 cursor-pointer transition-all text-sm md:text-base min-w-0 ${
                        isChecked(item.key) 
                          ? 'line-through text-gray-400' 
                          : 'text-black'
                      }`}
                      onClick={() => toggleItem(item.key)}
                    >
                      {item.name}
                    </span>
                    <span className={`text-xs md:text-sm flex-shrink-0 text-right transition-all ${
                      isChecked(item.key) 
                        ? 'text-gray-400 line-through' 
                        : 'text-gray-600'
                    }`}>
                      {item.totalAmount} {item.unit.replace(/[\d.()（）]/g, '').trim() || '份'}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* 空狀態 */}
              {shoppingList.length === 0 && (
                <div className="bg-white border border-dashed border-gray-400 rounded-lg p-4 md:p-6 text-center space-y-3 md:space-y-4">
                  <p className="text-base md:text-lg">🛒 目前沒有需要採購的項目</p>
                  {schedule.length === 0 ? (
                    <>
                      <p className="text-sm md:text-base text-gray-600">你還沒有安排任何行程喔</p>
                      <button
                        className="bg-[#ffc278] border-2 border-black px-3 md:px-4 py-2 font-bold rounded-lg hover:bg-[#ffb452] neo-button text-sm md:text-base"
                        onClick={() => window.location.href = '/schedule'}
                      >
                        去安排本週菜單
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm md:text-base text-gray-600">
                        目前所選日期範圍內的行程沒有需要採購的項目～
                      </p>
                      <button
                        className="bg-[#519181] text-white border-2 border-black px-3 md:px-4 py-2 font-bold rounded-lg hover:bg-[#5a9a8e] neo-button text-sm md:text-base"
                        onClick={() => setDateRange([today, oneWeekLater])}
                      >
                        重設為本週日期
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 底部操作區 - 改善 RWD */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 md:mt-6 gap-3 sm:gap-0">
              <div className="text-sm md:text-base">
                <span className="font-bold">完成度：</span>
                <span>
                  {
                    shoppingList.filter((item) => isChecked(item.key)).length
                  }{' '}
                  / {shoppingList.length}
                  {'（' + completionRate + '%）'}
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="bg-[#f9f5f1] border border-black px-3 md:px-4 py-1 neo-button flex items-center text-sm md:text-base flex-1 sm:flex-none justify-center"
                  onClick={removeAll}
                >
                  <Trash2 size={14} className="mr-1" />
                  <span>清除全部</span>
                </button>
                <button
                  className="bg-[#ffc278] border border-black px-3 md:px-4 py-1 neo-button text-sm md:text-base flex-1 sm:flex-none"
                  onClick={completeAll}
                >
                  <span>全部完成</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
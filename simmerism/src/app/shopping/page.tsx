//app/shopping/page.tsx
'use client'

import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useShoppingList } from '@/hooks/useShoppingList'
import { useSchedule } from '@/hooks/useSchedule' // 假設這裡提供行程資料
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, addDays } from 'date-fns'

export default function ShoppingPage() {
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

  console.log('📅 schedule in ShoppingPage:', schedule)
  console.log('📅 formattedStart, formattedEnd:', formattedStart, formattedEnd)
  return (
    <div className="min-h-screen bg-[#f9f5f1] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">採購清單</h1>

        <div className="space-y-8">
          {/* 本周需採購清單 */}
          <div className="bg-white border-2 border-black rounded p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">本周需採購清單</h2>
              {/* 可以未來加入時間區間編輯按鈕 */}
              {/* <button className="p-2 border border-purple-500 rounded">
                <Edit size={16} className="text-purple-500" />
              </button> */}
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="bg-[#ffc278] border-2 border-black px-6 py-2 font-bold neo-button">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(dates) => {
                    setDateRange(dates as [Date | null, Date | null])
                  }}
                  isClearable={true}
                />
              </div>
            </div>

            <div className="space-y-4">
              {shoppingList.map((item) => (
                <div key={item.key} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-4 h-5 w-5"
                      checked={isChecked(item.key)}
                      onChange={() => toggleItem(item.key)}
                    />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-sm text-gray-600 mr-2">
                      {item.totalAmount} {item.unit}
                    </span>
                    {/* <button
                      className="bg-[#ff6347] text-black p-1 mr-2 neo-button"
                      onClick={() => removeItem(item.key)}
                    >
                      <Trash2 size={20} />
                    </button> */}
                  </div>
                </div>
              ))}
              {shoppingList.length === 0 && (
                <div className="text-gray-500">目前尚無採購項目。</div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <div>
                <span className="font-bold">完成度：</span>
                <span>
                  {
                    shoppingList.filter((item) => isChecked(item.key)).length
                  }{' '}
                  / {shoppingList.length}
                  {'（' + completionRate + '%）'}
                </span>
              </div>
              <div className="flex gap-2">
                {/* <button
                  className="bg-[#f9f5f1] border border-black px-4 py-1 neo-button flex items-center"
                  onClick={removeAll}
                >
                  <Trash2 size={16} className="mr-1" />
                  <span>刪除清單</span>
                </button> */}
                <button
                  className="bg-[#ffc278] border border-black px-4 py-1 neo-button"
                  onClick={completeAll}
                >
                  <span>標記全部完成</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

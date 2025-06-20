//components/DatePicker.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Calendar, X } from "lucide-react"
import { createPortal } from "react-dom"

interface CustomDatePickerProps {
  // 單日選擇模式
  selectedDate?: Date
  onDateChange?: (date: Date) => void

  // 兼容原 DatePicker API
  selected?: Date
  onChange?: ((date: Date) => void) | ((dates: [Date | null, Date | null]) => void)

  // 範圍選擇模式
  selectsRange?: boolean
  startDate?: Date | null
  endDate?: Date | null

  // 有資料的日期高亮
  hasDataDates?: Date[]
  hasDataColor?: string

  // 其他選項
  isClearable?: boolean
  className?: string
  placeholder?: string
  dateFormat?: string
}

export default function CustomDatePicker({
  selectedDate,
  onDateChange,
  selected,
  onChange,
  selectsRange = false,
  startDate,
  endDate,
  hasDataDates = [],
  hasDataColor = "#10b981", // 預設為綠色
  isClearable = false,
  className = "",
  placeholder = "選擇日期",
  dateFormat = "yyyy/MM/dd",
}: CustomDatePickerProps) {
  // 處理兼容性：如果有 selected 屬性，優先使用它
  const currentSelectedDate = selected || selectedDate
  const currentOnChange = onChange || onDateChange

  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectsRange && startDate) return startDate.getMonth()
    if (currentSelectedDate) return currentSelectedDate.getMonth()
    return new Date().getMonth()
  })
  const [currentYear, setCurrentYear] = useState(() => {
    if (selectsRange && startDate) return startDate.getFullYear()
    if (currentSelectedDate) return currentSelectedDate.getFullYear()
    return new Date().getFullYear()
  })

  // 範圍選擇的臨時狀態
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null)
  
  // 用於定位的參考元素
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

  // 計算 modal 位置
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      const modalWidth = 320
      const modalHeight = 400
      const padding = 10 // 邊界 padding
      
      // 計算 modal 的理想位置
      let top = rect.bottom + scrollY + 8 // 8px 間距
      let left = rect.left + scrollX + rect.width / 2 - modalWidth / 2
      
      // 水平邊界檢查 - 確保不會超出視窗左右邊界
      const maxLeft = window.innerWidth - modalWidth - padding
      const minLeft = padding
      
      if (left < minLeft) {
        left = minLeft
      } else if (left > maxLeft) {
        left = maxLeft
      }
      
      // 垂直邊界檢查 - 如果下方空間不足，顯示在上方
      const spaceBelow = window.innerHeight - (rect.bottom - scrollY)
      const spaceAbove = rect.top - scrollY
      
      if (spaceBelow < modalHeight + padding && spaceAbove > modalHeight + padding) {
        // 上方空間足够，顯示在上方
        top = rect.top + scrollY - modalHeight - 8
      } else if (spaceBelow < modalHeight + padding) {
        // 上下都空間不足，置中顯示
        top = scrollY + (window.innerHeight - modalHeight) / 2
        // 確保不會超出頂部
        if (top < scrollY + padding) {
          top = scrollY + padding
        }
      }
      
      setPosition({ top, left })
    }
  }, [isOpen])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 檢查點擊的是否是 portal 內的元素
        const portalElement = document.getElementById('datepicker-portal')
        if (portalElement && portalElement.contains(event.target as Node)) {
          return // 點擊在 portal 內，不關閉
        }
        setIsOpen(false)
        setTempStartDate(null)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // 檢查某個日期是否有資料
  const hasData = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day)
    return hasDataDates.some((dataDate) => {
      return (
        dataDate.getDate() === dayDate.getDate() &&
        dataDate.getMonth() === dayDate.getMonth() &&
        dataDate.getFullYear() === dayDate.getFullYear()
      )
    })
  }

  const formatDate = (date: Date) => {
    if (dateFormat === "yyyy/MM/dd") {
      return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    }
    return date.toLocaleDateString("zh-TW")
  }

  const formatDateRange = () => {
    if (selectsRange) {
      if (startDate && endDate) {
        return `${formatDate(startDate)} - ${formatDate(endDate)}`
      } else if (startDate) {
        return `${formatDate(startDate)} - 選擇結束日期`
      } else {
        return placeholder
      }
    } else {
      return currentSelectedDate ? formatDate(currentSelectedDate) : placeholder
    }
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)

    if (selectsRange) {
      if (!tempStartDate || (tempStartDate && endDate)) {
        // 開始新的範圍選擇
        setTempStartDate(clickedDate)
        ;(currentOnChange as (dates: [Date | null, Date | null]) => void)?.([clickedDate, null])
      } else {
        // 完成範圍選擇
        const newStartDate = tempStartDate <= clickedDate ? tempStartDate : clickedDate
        const newEndDate = tempStartDate <= clickedDate ? clickedDate : tempStartDate
        ;(currentOnChange as (dates: [Date | null, Date | null]) => void)?.([newStartDate, newEndDate])
        setTempStartDate(null)
        setIsOpen(false)
      }
    } else {
      // 單日選擇模式
      ;(currentOnChange as (date: Date) => void)?.(clickedDate)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    if (selectsRange) {
      ;(currentOnChange as (dates: [Date | null, Date | null]) => void)?.([null, null])
    } else {
      ;(currentOnChange as (date: Date) => void)?.(new Date())
    }
    setTempStartDate(null)
  }

  const isSelectedDate = (day: number) => {
    const dayDate = new Date(currentYear, currentMonth, day)

    if (selectsRange) {
      const currentStart = tempStartDate || startDate
      const currentEnd = endDate

      if (currentStart && currentEnd) {
        return dayDate >= currentStart && dayDate <= currentEnd
      } else if (currentStart) {
        return dayDate.getTime() === currentStart.getTime()
      }
      return false
    } else {
      return (
        currentSelectedDate &&
        currentSelectedDate.getDate() === day &&
        currentSelectedDate.getMonth() === currentMonth &&
        currentSelectedDate.getFullYear() === currentYear
      )
    }
  }

  const isRangeStart = (day: number) => {
    if (!selectsRange) return false
    const dayDate = new Date(currentYear, currentMonth, day)
    const currentStart = tempStartDate || startDate
    return currentStart && dayDate.getTime() === currentStart.getTime()
  }

  const isRangeEnd = (day: number) => {
    if (!selectsRange) return false
    const dayDate = new Date(currentYear, currentMonth, day)
    return endDate && dayDate.getTime() === endDate.getTime()
  }

  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  // Create calendar grid
  const calendarDays: (number | null)[] = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Calendar Modal 組件
  const CalendarModal = () => (
    <div 
      id="datepicker-portal"
      className="fixed"
      style={{ 
        top: position.top, 
        left: position.left,
        zIndex: 9999
      }}
    >
      <div className="relative">
        {/* Shadow */}
        <div className="absolute top-2 left-2 w-full h-full bg-black rounded"></div>

        {/* Calendar Container */}
        <div className="relative bg-[#ffc278] border-2 border-black rounded p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              <ChevronLeft size={16} className="text-black" />
            </button>

            <div className="text-black font-bold text-lg">
              {months[currentMonth]} {currentYear}
            </div>

            <button
              onClick={handleNextMonth}
              className="w-8 h-8 bg-white border-2 border-black rounded flex items-center justify-center hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              <ChevronRight size={16} className="text-black" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 bg-[#519181] border-2 border-black rounded flex items-center justify-center"
              >
                <span className="font-bold text-sm text-white">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div key={index} className="h-10">
                {day !== null ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full border-2 border-black rounded flex items-center justify-center font-bold text-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 relative ${
                      isRangeStart(day) || isRangeEnd(day)
                        ? "bg-[#519181] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : isSelectedDate(day)
                          ? "bg-[#519181] bg-opacity-50 text-white"
                          : isToday(day)
                            ? "bg-[#ff7a5a] text-white"
                            : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={hasData(day) ? "font-extrabold" : ""}
                      style={{
                        color: hasData(day) && !isSelectedDate(day) && !isToday(day) ? hasDataColor : undefined,
                      }}
                    >
                      {day}
                    </span>
                    {/* 有資料的日期添加小圓點指示器 */}
                    {hasData(day) && (
                      <div
                        className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: hasDataColor }}
                      ></div>
                    )}
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>

          {/* Range Selection Hint */}
          {selectsRange && tempStartDate && !endDate && (
            <div className="mt-3 text-center text-sm text-black bg-white bg-opacity-50 rounded p-2">
              請選擇結束日期
            </div>
          )}

          {/* 有資料日期的說明 */}
          {hasDataDates.length > 0 && (
            <div className="mt-3 text-center text-xs text-black bg-white bg-opacity-50 rounded p-2 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hasDataColor }}></div>
              <span>有安排的日期</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Date Input Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-center cursor-pointer flex items-center justify-center gap-2 font-bold"
      >
        <span className="truncate">{formatDateRange()}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isClearable && (startDate || currentSelectedDate) && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="hover:bg-black hover:bg-opacity-10 rounded p-1"
            >
              <X size={16} />
            </button>
          )}
          <Calendar size={16} />
        </div>
      </div>

      {/* Calendar Modal - 使用 Portal 渲染到 document.body */}
      {isOpen && typeof window !== 'undefined' && createPortal(
        <CalendarModal />,
        document.body
      )}
    </div>
  )
}
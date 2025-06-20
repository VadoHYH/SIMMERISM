import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const showPages = (): (number | string)[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)

    const visible: (number | string)[] = [1]
    if (currentPage > 3) visible.push("...")

    const range = [currentPage - 1, currentPage, currentPage + 1].filter(
      (n) => n > 1 && n < totalPages
    )
    visible.push(...range)

    if (currentPage < totalPages - 2) visible.push("...")
    visible.push(totalPages)

    return visible
  }

  const pageList = showPages()

  return (
    <div className="flex justify-center items-center flex-wrap gap-2 mt-8 px-4">
      {/* 上一頁箭頭 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border-2 border-black bg-[#FB7659] text-white font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
        aria-label="上一頁"
      >
        <ChevronLeft size={18} />
      </button>

      {/* 頁碼按鈕 */}
      {pageList.map((p, i) =>
        typeof p === "string" ? (
          <span key={i} className="px-2 font-bold">...</span>
        ) : (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-sm sm:text-base font-bold border-2 border-black ${
              currentPage === p
                ? "bg-[#519181] text-white"
                : "bg-[#FB7659] text-white hover:bg-orange-600"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* 下一頁箭頭 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border-2 border-black bg-[#FB7659] text-white font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
        aria-label="下一頁"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

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
    <div className="flex justify-center items-center mt-8">
      {/* 小尺寸簡約版：Simmerism 風格 */}
      <div className="sm:hidden flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center border-2 border-black text-white bg-[#FB7659] hover:bg-orange-600 disabled:opacity-40"
          aria-label="上一頁"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-bold border-2 border-black px-3 py-1 text-center bg-[#519181] text-white">
          第 {currentPage} / {totalPages} 頁
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center border-2 border-black text-white bg-[#FB7659] hover:bg-orange-600 disabled:opacity-40"
          aria-label="下一頁"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 👉 中大尺寸：顯示完整頁碼 */}
      <div className="hidden sm:flex flex-wrap justify-center gap-2 px-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border-2 border-black bg-[#FB7659] text-white font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
          aria-label="上一頁"
        >
          <ChevronLeft size={18} />
        </button>

        {pageList.map((p, i) =>
          typeof p === "string" ? (
            <span key={i} className="px-2 font-bold">...</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-sm font-bold border-2 border-black ${
                currentPage === p
                  ? "bg-[#519181] text-white"
                  : "bg-[#FB7659] text-white hover:bg-orange-600"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border-2 border-black bg-[#FB7659] text-white font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
          aria-label="下一頁"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

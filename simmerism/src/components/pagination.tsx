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
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }
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
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#FB7659] border-2 border-black px-4 py-1 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          &lt; 上一頁
        </button>
  
        {pageList.map((p, i) =>
          typeof p === "string" ? (
            <span key={i} className="px-2 font-bold">...</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-4 py-1 font-bold border-2 border-black ${
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
          className="bg-[#FB7659] border-2 border-black px-4 py-1 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
        >
          下一頁 &gt;
        </button>
      </div>
    )
  }
  
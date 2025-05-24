// components/SearchBar.tsx
import { Search } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="搜尋食譜..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 py-3 pl-10 pr-4 rounded-l"
      />
      <button
        className="absolute right-0 top-0 bottom-0 bg-blue-600 text-white px-6 rounded-r"
        onClick={onSearch}
      >
        搜尋
      </button>
    </div>
  )
}

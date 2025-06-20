import { Search, X } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <form
      onSubmit={onSearch}
      className="flex flex-row items-center w-full max-w-2xl mx-auto"
    >
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="text-gray-400" />
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-black"
          >
            <X size={18} />
          </button>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜尋食譜..."
          className="w-full border border-gray-300 py-3 pl-10 pr-4 rounded-l"
        />
      </div>

      <button
        type="submit"
        className="bg-[#1E49CF] text-white px-6 py-3 rounded-r neo-button whitespace-nowrap"
      >
        搜尋
      </button>
    </form>
  )
}

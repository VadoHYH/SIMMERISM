//components/NavItem.ts
import { usePathname, useRouter } from "next/navigation"
import { useRequireLogin } from "@/hooks/useRequireLogin"

interface NavItemProps {
  path: string
  label: string
  requireAuth?: boolean
}

export default function NavItem({ path, label, requireAuth = false }: NavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const requireLogin = useRequireLogin()

  const handleClick = () => {
    if (requireAuth) {
      requireLogin(() => router.push(path))
    } else {
      router.push(path)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`border-r border-black p-4 text-center transition-colors flex-1 ${
        pathname === path ? "bg-[#5a9a8e] text-white" : "hover:bg-[#5a9a8e] hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}

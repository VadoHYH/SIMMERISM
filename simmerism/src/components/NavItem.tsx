//components/NavItem.tsx
import { usePathname, useRouter } from "next/navigation"
import { useRequireLogin } from "@/hooks/useRequireLogin"
import { useTransitionStore } from "@/hooks/useTransitionStore"

interface NavItemProps {
  path: string
  label: string
  requireAuth?: boolean
}

export default function NavItem({ path, label, requireAuth = false }: NavItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const requireLogin = useRequireLogin()
  const { startTransition } = useTransitionStore()

  const handleClick = () => {
    const go = () => {
      startTransition()
      setTimeout(() => {
        router.push(path)
      }, 300) // 建議和動畫長度對齊
    }

    if (requireAuth) {
      requireLogin(go)
    } else {
      go()
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

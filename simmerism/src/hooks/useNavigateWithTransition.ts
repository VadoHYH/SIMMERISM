// hooks/useNavigateWithTransition.ts
import { useRouter } from "next/navigation"
import { useTransitionStore } from "./useTransitionStore"

export function useNavigateWithTransition() {
  const router = useRouter()
  const { startTransition } = useTransitionStore()

  return (url: string) => {
    startTransition(() => router.push(url))
  }
}

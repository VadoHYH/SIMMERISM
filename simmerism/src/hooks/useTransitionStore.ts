// hooks/useTransitionStore.ts
import { create } from "zustand"

interface TransitionState {
  isTransitioning: boolean
  isPageReady: boolean
  startTransition: (callback?: () => void) => void
  setPageReady: () => void
  endTransition: () => void
}

export const useTransitionStore = create<TransitionState>((set) => ({
  isTransitioning: false,
  isPageReady: false,

  startTransition: (callback) => {
    set({ isTransitioning: true, isPageReady: false })
    // ✅ 稍微延遲執行 callback（等待動畫開始）
    setTimeout(() => {
      callback?.()
    }, 50)
  },

  setPageReady: () => set({ isPageReady: true }),

  endTransition: () => set({ isTransitioning: false, isPageReady: false }),
}))
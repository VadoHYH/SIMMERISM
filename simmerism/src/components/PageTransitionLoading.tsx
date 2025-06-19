"use client"

import { useEffect, useState } from "react"
import { useTransitionStore } from "@/hooks/useTransitionStore"

export default function PageTransition() {
    const { isTransitioning, endTransition } = useTransitionStore()
    const [stage, setStage] = useState<"closing" | "opening" | "hidden">("hidden")
    const [holeSize, setHoleSize] = useState(0)
    
    useEffect(() => {
      if (isTransitioning) {
        setStage("closing")
        setHoleSize(100) // 一開始是大洞（全透明）
  
        // 階段1：橘色從外圍往中心收縮
        setTimeout(() => {
          setHoleSize(0) // 洞消失，變成全橘色
        }, 100)
  
        // 階段2：立即開始展開
        setTimeout(() => {
          setStage("opening")
          setTimeout(() => {
            setHoleSize(100) // 洞變大至全螢幕（全透明）
          }, 100)
          
          // 階段3：動畫結束
          setTimeout(() => {
            setStage("hidden")
            endTransition()
          }, 800)
        }, 400) // 收縮完成後等待一點點就開始展開
      }
    }, [isTransitioning, endTransition])
  
    if (stage === "hidden") return null
  
    return (
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        <div
          className="absolute inset-0 bg-orange-400 transition-all duration-700 ease-in-out"
          style={{
            clipPath: `circle(${100 - holeSize}% at center)`,
            backgroundColor: "#ffc278",
          }}
        />
      </div>
    )
}
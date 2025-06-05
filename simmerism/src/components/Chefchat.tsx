"use client"
import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { useRecipes } from "@/hooks/useRecipes"

// 定義食譜類型
export type Recipe = {
  title: { zh: string; en: string }
  summary: { zh: string; en: string }
  image?: string
}

export interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  recipes?: Recipe[]
  isAIPrompt?: boolean
  isLoading?: boolean
}

interface ChefChatProps {
  onMessagesChange: (messages: Message[]) => void
}

export interface ChefChatRef {
  handleSubmit: (input: string) => void
  handleAbort: () => void
  handleAIRequest: (accept: boolean, messageId: string) => void
  loadingRecipes: boolean
  loadingAI: boolean
}

const ChefChat = forwardRef<ChefChatRef, ChefChatProps>(({ onMessagesChange }, ref) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "你好！我是廚娘小助手，有什麼料理問題想問我嗎？",
      isUser: false,
      timestamp: new Date(),
    },
  ])

  // ChefChat 的狀態
  const [results, setResults] = useState<Recipe[]>([])
  const [response, setResponse] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [askAI, setAskAI] = useState(false)
  const [noResult, setNoResult] = useState(false)
  const [currentInput, setCurrentInput] = useState("")
  const abortControllerRef = useRef<AbortController | null>(null)
  const { recipes, loading: loadingRecipes } = useRecipes()

  // 黑名單關鍵詞：可擴充
  const blockedKeywords = ["程式", "coding", "Python", "C++", "愛情", "投資", "股票", "歷史", "哲學", "寫詩"]

  const containsBlockedKeyword = (input: string) => {
    return blockedKeywords.some((kw) => input.includes(kw))
  }

  // 當 messages 改變時通知父組件
  useEffect(() => {
    onMessagesChange(messages)
  }, [messages, onMessagesChange])

  useEffect(() => {
    if (askAI) handleGenerate()
  }, [askAI])

  const addMessage = (
    content: string,
    isUser: boolean,
    recipes?: Recipe[],
    isAIPrompt?: boolean,
    isLoading?: boolean,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      recipes,
      isAIPrompt,
      isLoading,
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage.id
  }

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)))
  }

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  const handleSubmit = (userInput: string) => {
    if (!userInput.trim()) return

    // 保存當前輸入
    setCurrentInput(userInput)

    // 添加用戶訊息
    addMessage(userInput, true)

    // 重置狀態
    setResponse("")
    setResults([])
    setNoResult(false)
    setAskAI(false)

    // 檢查黑名單關鍵詞
    if (containsBlockedKeyword(userInput)) {
      setTimeout(() => {
        addMessage("小廚娘只會回答跟料理相關的問題唷～試著問問「冰箱只剩蛋和泡菜，能煮什麼？」看看 🍳", false)
      }, 500)
      return
    }

    // 搜尋食譜 - 只有在食譜載入完成時才搜尋
    if (!loadingRecipes && recipes.length > 0) {
      const input = userInput.toLowerCase()
      const filtered = recipes.filter(
        (recipe) => recipe.title.zh.toLowerCase().includes(input) || recipe.title.en.toLowerCase().includes(input),
      )

      if (filtered.length > 0) {
        setResults(filtered)
        setTimeout(() => {
          addMessage("小廚娘找到這些食譜：", false, filtered)
        }, 500)
      } else {
        setNoResult(true)
        setTimeout(() => {
          addMessage("找不到相關食譜，要請小廚娘發揮創意幫你想一份嗎？", false, undefined, true)
        }, 500)
      }
    } else {
      // 如果食譜還在載入中，直接提供 AI 協助
      setTimeout(() => {
        addMessage("小廚娘正在準備食譜資料，讓我直接幫你想想看！", false)
        setAskAI(true)
      }, 500)
    }
  }

  const handleGenerate = async () => {
    setLoadingAI(true)
    setResponse("")

    // 添加載入訊息
    const loadingId = addMessage("小廚娘努力思考中...", false, undefined, false, true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const res = await fetch("https://api.chatanywhere.org/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "你是一位專門回答料理問題的小廚娘 AI，如果問題與料理無關請委婉拒絕，否則請推薦創意料理。",
            },
            {
              role: "user",
              content: currentInput,
            },
          ],
        }),
        signal: controller.signal,
      })

      const data = await res.json()
      const aiResponse = data?.choices?.[0]?.message?.content || "小廚娘暫時想不出來耶 😅"

      // 移除載入訊息並添加 AI 回應
      removeMessage(loadingId)
      addMessage(aiResponse, false)
    } catch (error: any) {
      removeMessage(loadingId)
      if (error.name === "AbortError") {
        addMessage("中止思考啦～等你再來找小廚娘唷 🫣", false)
      } else {
        console.error("GPT 回應失敗:", error)
        addMessage("喔不～小廚娘暫時沒靈感，請再試一次！", false)
      }
    } finally {
      setLoadingAI(false)
      setAskAI(false)
      abortControllerRef.current = null
    }
  }

  const handleAbort = () => {
    abortControllerRef.current?.abort()
  }

  const handleAIRequest = (accept: boolean, messageId: string) => {
    // 移除 AI 提示訊息
    removeMessage(messageId)

    if (accept) {
      setAskAI(true)
    } else {
      addMessage("好的，有其他問題隨時問我唷！", false)
    }
  }

  // 使用 useImperativeHandle 暴露方法給父組件
  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleAbort,
    handleAIRequest,
    loadingRecipes,
    loadingAI,
  }))

  return null // 這個組件不渲染任何UI，只處理邏輯
})

ChefChat.displayName = "ChefChat"

export default ChefChat

"use client"

import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react"
import { useRecipes } from "@/hooks/useRecipes"
import { Recipe } from "@/types/recipe"

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
  resetConversation: () => void
}

const ChefChat = forwardRef<ChefChatRef, ChefChatProps>(({ onMessagesChange }, ref) => {
  const initialMessage: Message = {
    id: "1",
    content: "你好！我是廚娘小助手，有什麼料理問題想問我嗎？",
    isUser: false,
    timestamp: new Date(),
  }

  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [loadingAI, setLoadingAI] = useState(false)

  const conversationHistoryRef = useRef<Array<{ role: string; content: string }>>([
    {
      role: "system",
      content:
        "你是一位專門回答料理問題的小廚娘 AI。你會記住之前的對話內容，能夠根據上下文進行連續對話。如果問題與料理無關請委婉拒絕，否則請推薦創意料理。請用親切可愛的語氣回答。",
    },
  ])

  const abortControllerRef = useRef<AbortController | null>(null)
  const { recipes, loading: loadingRecipes } = useRecipes()

  const blockedKeywords = ["程式", "coding", "Python", "C++", "愛情", "投資", "股票", "歷史", "哲學", "寫詩"]
  const containsBlockedKeyword = (input: string) => blockedKeywords.some((kw) => input.includes(kw))

  useEffect(() => {
    onMessagesChange(messages)
  }, [messages, onMessagesChange])

  const resetConversation = () => {
    conversationHistoryRef.current = [
      {
        role: "system",
        content:
          "你是一位專門回答料理問題的小廚娘 AI。你會記住之前的對話內容，請務必根據前面的對話上下文理解使用者的問題，並維持同一主題。如果問題與料理無關請委婉拒絕，否則請推薦創意料理。請用親切可愛的語氣回答。",
      },
    ]
    setMessages([initialMessage])
  }

  const addMessage = (
    content: string,
    isUser: boolean,
    recipes?: Recipe[],
    isAIPrompt?: boolean,
    isLoading?: boolean
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

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
  }

  const extractKeywordsWithAI = async (input: string): Promise<string[]> => {
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
              content: `請從使用者的句子中提取出與食材、料理方式、菜色名稱有關的中文關鍵詞。
              例如輸入：「冰箱只剩蛋和泡菜，能煮什麼？」
              回傳：蛋,泡菜
              只回傳以逗號分隔的詞，不要多餘說明。`,
            },
            { role: "user", content: input },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      })

      if (!res.ok) {
        return []
      }

      const data = await res.json()
      const content = data?.choices?.[0]?.message?.content || ""
      return content.split(",").map((kw: string) => kw.trim()).filter(Boolean)
    } catch (error: unknown) {
      console.error("提取關鍵字失敗：", error);
      return []
    }
  }

  const handleSubmit = async (userInput: string) => {
    if (!userInput.trim()) return
  
    addMessage(userInput, true)
    conversationHistoryRef.current.push({ role: "user", content: userInput })
  
    if (containsBlockedKeyword(userInput)) {
      const blockResponse = "小廚娘只會回答跟料理相關的問題唷～試著問問「冰箱只剩蛋和泡菜，能煮什麼？」看看 🍳"
      setTimeout(() => {
        addMessage(blockResponse, false)
        conversationHistoryRef.current.push({ role: "assistant", content: blockResponse })
      }, 500)
      return
    }
  
    // 新增：萃取關鍵字來判斷是否進行 recipe 搜尋
    const keywords = await extractKeywordsWithAI(userInput)
    const filteredKeywords = keywords.filter((k) => !["冰箱", "只剩", "能", "煮", "什麼"].includes(k))
  
    const shouldSearch = filteredKeywords.length > 0 && /[蛋肉菜飯麵醬湯燉炒烤煮]/.test(userInput)
  
    if (shouldSearch && recipes.length > 0) {
      await handleRecipeSearch(userInput)
    } else {
      await handleAIResponse()
    }
  }

  const handleRecipeSearch = async (userInput: string) => {
    const keywords = await extractKeywordsWithAI(userInput)
    const filteredKeywords = keywords.filter((k) => !["冰箱", "只剩", "能", "煮", "什麼"].includes(k))

    if (filteredKeywords.length === 0) {
      const noKeywordResponse = "讓小廚娘直接幫你想想創意料理！"
      setTimeout(() => {
        addMessage(noKeywordResponse, false)
        conversationHistoryRef.current.push({ role: "assistant", content: noKeywordResponse })
      }, 500)
      await handleAIResponse()
      return
    }

    const filtered = recipes.filter((recipe) => {
      const ingredientsText = recipe.ingredients
        .map((ing) => `${ing.name.zh} ${ing.name.en}`)
        .join(" ")
        .toLowerCase()
        const summaryZhText = recipe.summary?.zh || "";
        const summaryEnText = recipe.summary?.en || "";
    
        const fullText = `${ingredientsText} ${recipe.title.zh} ${recipe.title.en} ${summaryZhText} ${summaryEnText}`.toLowerCase()

      return filteredKeywords.every((kw) => fullText.includes(kw.toLowerCase()))
    })

    if (filtered.length > 0) {
      const response = `小廚娘找到了包含所有食材（${filteredKeywords.join("、")}）的食譜：`
      setTimeout(() => {
        addMessage(response, false, filtered)
        conversationHistoryRef.current.push({
          role: "assistant",
          content: response + "\n找到的食譜：" + filtered.map((r) => r.title.zh).join("、"),
        })
      }, 500)
    } else {
      const noMatch = `找不到同時包含所有食材（${filteredKeywords.join("、")}）的食譜，要請小廚娘發揮創意幫你想一份嗎？`
      setTimeout(() => {
        addMessage(noMatch, false, undefined, true)
      }, 500)
    }
  }

  const handleAIResponse = async () => {
    setLoadingAI(true)
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
          messages: conversationHistoryRef.current,
          temperature: 0.7,
          max_tokens: 500,
        }),
        signal: controller.signal,
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const data = await res.json()
      const aiResponse = data?.choices?.[0]?.message?.content || "小廚娘暫時想不出來耶 😅"
      removeMessage(loadingId)
      addMessage(aiResponse, false)
      conversationHistoryRef.current.push({ role: "assistant", content: aiResponse })
    } catch (error: unknown) {
      removeMessage(loadingId)
      const errorMessage =
        (error instanceof Error && error.name === "AbortError")
          ? "中止思考啦～等你再來找小廚娘唷 🫣"
          : "喔不～小廚娘暫時沒靈感，請再試一次！"
      addMessage(errorMessage, false)
      conversationHistoryRef.current.push({ role: "assistant", content: errorMessage })
    } finally {
      setLoadingAI(false)
      abortControllerRef.current = null
    }
  }

  const handleAbort = () => {
    abortControllerRef.current?.abort()
  }

  const handleAIRequest = (accept: boolean, messageId: string) => {
    removeMessage(messageId)
    if (accept) {
      const response = "好的，讓小廚娘發揮創意！"
      addMessage(response, false)
      conversationHistoryRef.current.push({ role: "assistant", content: response })
      handleAIResponse()
    } else {
      const decline = "好的，有其他問題隨時問我唷！"
      addMessage(decline, false)
      conversationHistoryRef.current.push({ role: "assistant", content: decline })
    }
  }

  useImperativeHandle(ref, () => ({
    handleSubmit,
    handleAbort,
    handleAIRequest,
    loadingRecipes,
    loadingAI,
    resetConversation,
  }))

  return null
})

ChefChat.displayName = "ChefChat"
export default ChefChat

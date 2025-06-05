"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, ChevronDown } from "lucide-react"
import ChefChat, { type Message, type ChefChatRef } from "@/components/Chefchat"
import Image from "next/image"

export default function QuestionsPage() {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const chefChatRef = useRef<ChefChatRef>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const previousMessagesLength = useRef(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const checkScrollPosition = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  // 只在新增訊息時自動滾動，且用戶在底部附近時才滾動
  useEffect(() => {
    const isNewMessage = messages.length > previousMessagesLength.current
    previousMessagesLength.current = messages.length

    if (isNewMessage && messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150

      // 只有在用戶接近底部時才自動滾動
      // if (isNearBottom) {
      //   setTimeout(scrollToBottom, 100)
      // }
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.trim() || !chefChatRef.current) return

    // 調用 ChefChat 的 handleSubmit 方法
    chefChatRef.current.handleSubmit(userInput)
    // 清空輸入框
    setUserInput("")

    // 移除強制滾動，讓 useEffect 處理
    // setTimeout(scrollToBottom, 100)
  }

  const handleMessagesChange = (newMessages: Message[]) => {
    setMessages(newMessages)
  }

  const isLoading = chefChatRef.current?.loadingAI || false
  const isRecipesLoading = chefChatRef.current?.loadingRecipes || false

  return (
    <div className="min-h-screen bg-[#F9F4EF] py-8">
      {/* ChefChat 邏輯組件 */}
      <ChefChat ref={chefChatRef} onMessagesChange={handleMessagesChange} />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute top-2 left-2 bg-black rounded px-6 py-3"></div>
            <div className="relative bg-[#1E49CF] text-white px-6 py-3 rounded border-2 border-black font-bold text-2xl">
              廚娘 AI 助手
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="relative">
          <div className="absolute top-2 left-2 w-full h-full bg-black rounded"></div>
          <div className="relative bg-white border-2 border-black rounded shadow-lg">
            {/* Chat Messages Area */}
            <div
              ref={messagesContainerRef}
              className="h-[500px] overflow-y-auto p-6 space-y-4"
              // onScroll={checkScrollPosition}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div className="relative max-w-[70%]">
                    {/* Message shadow */}
                    <div className="absolute top-1 left-1 w-full h-full bg-black rounded"></div>
                    {/* Message content */}
                    <div
                      className={`relative p-4 rounded border-2 border-black ${
                        msg.isUser ? "bg-[#FEC47E] text-black" : "bg-[#F9F4EF] text-black"
                      }`}
                    >
                      {!msg.isUser && (
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-black">廚</span>
                          </div>
                          <span className="font-bold text-sm">廚娘小助手</span>
                        </div>
                      )}

                      <p className="font-medium">{msg.content}</p>

                      {/* Loading Animation */}
                      {msg.isLoading && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <button
                            onClick={() => chefChatRef.current?.handleAbort()}
                            className="text-xs text-[#F7CEFA] underline hover:text-pink-400 ml-2"
                          >
                            中止
                          </button>
                        </div>
                      )}

                      {/* AI Prompt Buttons */}
                      {msg.isAIPrompt && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => chefChatRef.current?.handleAIRequest(true, msg.id)}
                            className="bg-[#519181] text-black px-3 py-1 rounded border border-black font-bold hover:bg-[#396358]"
                          >
                            是
                          </button>
                          <button
                            onClick={() => chefChatRef.current?.handleAIRequest(false, msg.id)}
                            className="bg-gray-300 text-black px-3 py-1 rounded border border-black font-bold hover:bg-gray-400"
                          >
                            否
                          </button>
                        </div>
                      )}

                      {/* Recipe Results */}
                      {msg.recipes && msg.recipes.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.recipes.map((recipe, index) => (
                            <div key={index} className="bg-white text-black p-3 rounded border border-black">
                              <h4 className="font-bold text-sm mb-1">{recipe.title.zh}</h4>
                              <p className="text-xs mb-2">{recipe.summary.zh}</p>
                              {recipe.image && (
                                <div className="relative w-full h-24">
                                  <Image
                                    src={recipe.image || "/placeholder.svg"}
                                    alt={recipe.title.zh}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs mt-2 opacity-75">{msg.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {/* {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-20 right-4 bg-[#5a9a8e] text-white p-2 rounded-full border-2 border-black shadow-lg hover:bg-[#4a8a7e] transition-colors z-10"
                title="滾動到底部"
              >
                <ChevronDown size={20} />
              </button>
            )} */}

            {/* Input Area */}
            <div className="border-t-2 border-black p-4 bg-[#1E49CF]">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute top-1 left-1 w-full h-full bg-black rounded"></div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="請輸入你的料理問題，例如：『冰箱只剩蛋和豆腐，可以煮什麼？』"
                    className="relative w-full p-3 border-2 border-black rounded focus:outline-none font-medium resize-none h-12 z-10"
                    disabled={isLoading}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e as any)
                      }
                    }}
                  />
                </div>
                <div className="relative">
                  <div className="absolute top-1 left-1 w-full h-full bg-black rounded z-0"></div>
                  <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className={`relative px-6 py-3 border-2 border-black rounded font-bold transition-colors flex items-center gap-2 h-12 z-10 ${
                      isLoading || !userInput.trim()
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#FB7659] text-white hover:bg-[#e55a40]"
                    }`}
                  >
                    {isLoading ? "思考中..." : isRecipesLoading ? "載入中..." : "詢問"}
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-8">
          <div className="relative inline-block mb-4">
            <div className="absolute top-1 left-1 bg-black rounded px-4 py-2"></div>
            <div className="relative bg-[#FEC47E] px-4 py-2 rounded border-2 border-black font-bold">常見問題</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "冰箱只剩蛋和豆腐，可以煮什麼？",
              "新手適合做什麼料理？",
              "如何調配照燒醬？",
              "素食者有什麼推薦食譜？",
            ].map((question, index) => (
              <div key={index} className="relative">
                <div className="absolute top-1 left-1 w-full h-full bg-black rounded"></div>
                <button
                  onClick={() => setUserInput(question)}
                  className="relative w-full p-3 bg-white border-2 border-black rounded text-left font-medium hover:bg-[#f0f0f0] transition-colors z-10"
                >
                  {question}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

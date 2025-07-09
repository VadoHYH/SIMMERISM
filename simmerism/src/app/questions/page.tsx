"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import ChefChat, { type Message, type ChefChatRef } from "@/components/ChefChat"
import Image from "next/image"

export default function QuestionsPage() {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chefChatRef = useRef<ChefChatRef>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const textarea = document.querySelector("textarea")
    if (textarea) {
      textarea.style.height = "auto" // 先重設，避免越調越高
      textarea.style.height = `${textarea.scrollHeight}px` // 根據內容高度調整
    }
  }, [userInput])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.trim() || !chefChatRef.current) return

    // 調用 ChefChat 的 handleSubmit 方法
    chefChatRef.current.handleSubmit(userInput)
    // 清空輸入框
    setUserInput("")

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

        {/* New Conversation Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              chefChatRef.current?.resetConversation()
              setUserInput("")
            }}
            className="bg-[#519181] text-white px-4 py-2 rounded border-2 border-black font-bold hover:bg-[#396358] transition-colors"
          >
            新對話
          </button>
        </div>

        {/* Chat Container */}
        <div className="relative">
          <div className="absolute top-2 left-2 w-full h-full bg-black rounded"></div>
          <div className="relative bg-white border-2 border-black rounded shadow-lg">
            {/* Chat Messages Area */}
            <div
              ref={messagesContainerRef}
              className="h-[500px] overflow-y-auto p-6 space-y-4"
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

                      <div className="font-medium">
                      <p>{msg.content}</p>
                      </div>

                      {/* Recipe Results - 保持現有的邏輯，但稍作調整 */}
                      {msg.recipes && msg.recipes.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.recipes.map((recipe, index) => (
                            <div
                              key={recipe.id || index}
                              className="flex items-start bg-white text-black p-3 rounded border border-black shadow-sm"
                            >
                              {/* 圖片在左側 */}
                              {recipe.image && (
                                <div className="relative w-20 h-20 flex-shrink-0 mr-4 border border-black rounded overflow-hidden">
                                  <Image
                                    src={recipe.image}
                                    alt={recipe.title.zh}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}

                              {/* 文字內容 */}
                              <div className="flex flex-col justify-between">
                                <h4 className="font-bold text-sm text-[#1E49CF] mb-1">{recipe.title.zh}</h4>
                                <p className="text-xs text-black/70 line-clamp-2 mb-2">{recipe.summary.zh}</p>
                                <a
                                  href={`/recipe/${recipe.id}`}
                                  className="text-xs text-[#1E49CF] underline hover:text-blue-800"
                                >
                                  查看完整食譜 →
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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

                      <div className="text-xs mt-2 opacity-75">{msg.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t-2 border-black p-4 bg-[#1E49CF]">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3"
              >
                <div className="flex-1 relative">
                  <div className="absolute top-1 left-1 w-full h-full bg-black rounded"></div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="請輸入你的料理問題，例如：『冰箱只剩蛋和豆腐，可以煮什麼？』"
                    className="relative w-full p-3 border-2 border-black rounded focus:outline-none font-medium resize-none z-10 overflow-hidden"
                    disabled={isLoading}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
                <div className="relative">
                  <div className="absolute top-1 left-1 w-full h-full bg-black rounded z-0"></div>
                  <button
                    type="submit"
                    disabled={isLoading || !userInput.trim()}
                    className={`relative w-full sm:w-auto px-6 py-3 border-2 border-black rounded font-bold transition-colors flex items-center justify-center sm:justify-start gap-2 h-12 z-10 neo-button ${
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
                  className="relative w-full p-3 bg-white border-2 border-black rounded text-left font-medium hover:bg-[#f0f0f0] transition-colors z-10 neo-button"
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

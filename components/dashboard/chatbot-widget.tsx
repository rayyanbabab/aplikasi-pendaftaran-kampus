"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Minimize2,
  RotateCcw,
} from "lucide-react"
import {
  chatWithAI,
  createChatSession,
  addMessageToSession,
  type ChatSession,
} from "@/lib/ai-service"
import { cn } from "@/lib/utils"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize chat session
  useEffect(() => {
    setSession(createChatSession())
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [session?.messages, isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setHasUnread(false)
    }
  }, [isOpen])

  const handleToggle = () => setIsOpen((prev) => !prev)

  const handleNewChat = () => {
    setSession(createChatSession())
    setInput("")
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !session || isLoading) return

    const userMessage = input.trim()
    setInput("")

    let updatedSession = addMessageToSession(session, "user", userMessage)
    setSession(updatedSession)
    setIsLoading(true)

    try {
      const response = await chatWithAI(userMessage, updatedSession.messages)
      updatedSession = addMessageToSession(updatedSession, "assistant", response)
      setSession(updatedSession)
      if (!isOpen) setHasUnread(true)
    } catch {
      const errorMsg = "Maaf, terjadi kesalahan. Silakan coba lagi."
      updatedSession = addMessageToSession(updatedSession, "assistant", errorMsg)
      setSession(updatedSession)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all duration-300 ease-in-out",
          isOpen
            ? "h-[520px] w-[360px] opacity-100 scale-100"
            : "h-0 w-[360px] opacity-0 scale-95 pointer-events-none"
        )}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Asisten PMB</p>
              <p className="text-xs opacity-75">Tanya jawab penerimaan mahasiswa</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              title="Chat baru"
              className="rounded-full p-1.5 transition hover:bg-white/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleToggle}
              title="Tutup"
              className="rounded-full p-1.5 transition hover:bg-white/20"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
          {session?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-2">
              <div className="text-3xl">💬</div>
              <p className="text-sm font-semibold text-gray-700">Halo! Ada yang bisa saya bantu?</p>
              <p className="text-xs text-gray-500">
                Tanyakan tentang program studi, jalur masuk, jadwal, atau proses pendaftaran.
              </p>
              <div className="w-full space-y-1.5 mt-1">
                {[
                  "Apa program studi yang tersedia?",
                  "Bagaimana jalur masuk SNBP?",
                  "Kapan pendaftaran dimulai?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      inputRef.current?.focus()
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-600 hover:border-primary hover:text-primary transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            session?.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-white border border-gray-200 text-gray-900 rounded-bl-none shadow-sm"
                  )}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span
                    className={cn(
                      "mt-1 block text-[10px]",
                      message.role === "user" ? "text-primary-foreground/70" : "text-gray-400"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-600 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white px-3 py-2.5 shrink-0">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ketik pertanyaan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-sm h-9 rounded-xl border-gray-200 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              className="h-9 w-9 rounded-xl p-0 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        aria-label="Buka Chatbot PMB"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          "bg-primary text-primary-foreground hover:scale-110 active:scale-95",
          isOpen && "rotate-0"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6 transition-transform duration-200" />
            {/* Unread badge */}
            {hasUnread && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                !
              </span>
            )}
          </>
        )}
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping" />
        )}
      </button>
    </>
  )
}

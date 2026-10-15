"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Minimize2,
  RotateCcw,
  Headphones,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react"
import {
  chatWithAI,
  createChatSession,
  addMessageToSession,
  type ChatSession,
} from "@/lib/ai-service"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const QUICK_TOPICS = [
  { label: "Batas Akhir Gelombang II", prompt: "Kapan batas akhir pendaftaran dan pembayaran Gelombang II?" },
  { label: "Syarat KIP-Kuliah", prompt: "Dokumen apa saja yang wajib diunggah untuk pendaftaran jalur beasiswa KIP-Kuliah?" },
  { label: "Skema Cicilan UKT", prompt: "Bagaimana cara mengajukan skema cicilan 3 tahap biaya UKT perkuliahan?" },
  { label: "Jadwal Ujian CBT", prompt: "Kapan pelaksanaan ujian tulis CBT dan apa saja materi yang diujikan?" },
]

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
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
      setTimeout(() => inputRef.current?.focus(), 120)
      setHasUnread(false)
    }
  }, [isOpen])

  // Escape key closes chat panel (R-32 Keyboard Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleToggle = () => setIsOpen((prev) => !prev)

  const handleNewChat = () => {
    setSession(createChatSession())
    setInput("")
    toast.info("Sesi percakapan baru telah dimulai.")
  }

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || !session || isLoading) return

    setInput("")
    let updatedSession = addMessageToSession(session, "user", messageContent)
    setSession(updatedSession)
    setIsLoading(true)

    try {
      const response = await chatWithAI(messageContent, updatedSession.messages)
      updatedSession = addMessageToSession(updatedSession, "assistant", response)
      setSession(updatedSession)
      if (!isOpen) setHasUnread(true)
    } catch {
      const errorMsg = "Mohon maaf, terjadi kendala saat menghubungkan ke asisten admisi. Silakan coba kembali sesaat lagi."
      updatedSession = addMessageToSession(updatedSession, "assistant", errorMsg)
      setSession(updatedSession)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success("Jawaban berhasil disalin ke clipboard.")
  }

  return (
    <>
      {/* Floating Chat Modal Panel */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transition-all duration-200 ease-out",
          isOpen
            ? "h-[540px] w-[380px] max-w-[calc(100vw-2.5rem)] opacity-100 scale-100"
            : "h-0 w-[380px] opacity-0 scale-95 pointer-events-none"
        )}
        style={{ transformOrigin: "bottom right" }}
        role="dialog"
        aria-label="Konsultasi Admisi PMB"
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-4 py-3.5 text-primary-foreground shrink-0 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
              <Headphones className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold leading-tight">Konsultasi Admisi PMB</p>
              <p className="text-[10px] text-white/75">Layanan Informasi & Bantuan Mahasiswa</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewChat}
              title="Mulai percakapan baru"
              className="rounded-md p-1.5 transition text-white/80 hover:text-white hover:bg-white/15"
              aria-label="Mulai percakapan baru"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleToggle}
              title="Tutup jendela konsultasi"
              className="rounded-md p-1.5 transition text-white/80 hover:text-white hover:bg-white/15"
              aria-label="Tutup jendela konsultasi"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-secondary/20">
          {session?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-2 py-4">
              <div className="h-10 w-10 rounded-xl bg-secondary border border-border text-foreground/80 flex items-center justify-center">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold font-serif text-foreground">
                  Pusat Bantuan Calon Mahasiswa
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                  Tanyakan hal teknis mengenai pendaftaran, konversi rapor, jadwal ujian, atau rincian UKT.
                </p>
              </div>

              <div className="w-full space-y-2 mt-2">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left pl-1">
                  Topik Pertanyaan Populer:
                </p>
                {QUICK_TOPICS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-left text-xs font-medium text-foreground hover:border-primary/40 hover:bg-secondary/60 transition-colors shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            session?.messages.map((message) => {
              const isUser = message.role === "user"
              return (
                <div
                  key={message.id}
                  className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed group relative",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-foreground shadow-2xs"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                      <span className={cn(isUser ? "text-primary-foreground/70" : "text-muted-foreground font-mono")}>
                        {message.timestamp.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="opacity-60 hover:opacity-100 text-muted-foreground transition-opacity"
                          title="Salin jawaban"
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border text-muted-foreground rounded-xl px-3.5 py-2 text-xs flex items-center gap-2 shadow-2xs">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Menyiapkan rujukan resmi...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-border bg-card p-3 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Tulis pertanyaan pendaftaran..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs h-9.5 rounded-lg border-border focus-visible:ring-primary bg-secondary/30"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              className="h-9.5 px-3.5 rounded-lg shrink-0 font-semibold"
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

      {/* Floating Button (Clean, no endless loop pulse - R-19) */}
      <button
        onClick={handleToggle}
        aria-label="Buka Asisten Admisi PMB"
        aria-expanded={isOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full shadow-lg transition-transform duration-200",
          "hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-primary",
          isOpen
            ? "bg-secondary text-foreground border border-border"
            : "bg-primary text-primary-foreground shadow-primary/20"
        )}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageSquare className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-red-600 ring-2 ring-background" />
            )}
          </>
        )}
      </button>
    </>
  )
}

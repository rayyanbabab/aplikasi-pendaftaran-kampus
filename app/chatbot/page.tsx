'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Loader2, ArrowLeft, Home, LayoutDashboard, Shield, Headphones, MessageSquare, RotateCcw } from 'lucide-react';
import { chatWithAI, createChatSession, addMessageToSession, type Message, type ChatSession } from '@/lib/ai-service';

export default function ChatbotPage() {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session on mount
  useEffect(() => {
    setSession(createChatSession());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !session || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    let updatedSession = addMessageToSession(session, 'user', userMessage);
    setSession(updatedSession);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await chatWithAI(userMessage, updatedSession.messages);

      // Add assistant message
      updatedSession = addMessageToSession(updatedSession, 'assistant', response);
      setSession(updatedSession);
    } catch (error) {
      console.error('[v0] Error:', error);
      const errorMessage =
        'Maaf, terjadi kendala saat memproses pertanyaan Anda. Silakan coba kembali sesaat lagi.';
      updatedSession = addMessageToSession(updatedSession, 'assistant', errorMessage);
      setSession(updatedSession);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSession(createChatSession());
    setInput('');
  };

  if (!session) return <div className="flex items-center justify-center h-screen bg-background text-foreground text-sm">Memuat sesi konsultasi...</div>;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 shadow-xs">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                <Shield className="h-4 w-4" />
              </Button>
            </Link>
            <div className="h-5 w-px bg-border"></div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                <Headphones className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold font-serif text-foreground">Konsultasi Admisi PMB</h1>
                <p className="text-xs text-muted-foreground">Pusat Informasi & Tanya Jawab Calon Mahasiswa</p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleNewChat} size="sm" className="gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Percakapan Baru
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto space-y-4">
          {session.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12">
              <Card className="p-8 text-center max-w-md border border-border bg-card shadow-xs">
                <div className="h-12 w-12 rounded-xl bg-secondary border border-border text-foreground/80 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-serif font-bold text-foreground mb-2">Mulai Konsultasi Pendaftaran</h2>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Tanyakan hal teknis mengenai program studi, akreditasi, alur pendaftaran, jadwal ujian, atau penetapan biaya UKT.
                </p>
                <div className="space-y-2 text-xs text-left bg-secondary/40 p-4 rounded-xl border border-border">
                  <p className="font-semibold text-foreground uppercase tracking-wider text-[11px]">Contoh topik pertanyaan:</p>
                  <ul className="text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Apa saja program studi dan akreditasi yang tersedia?
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Bagaimana syarat berkas untuk jalur beasiswa KIP-Kuliah?
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Kapan jadwal pelaksanaan tes seleksi mandiri CBT?
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          ) : (
            <>
              {session.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-2xl rounded-xl px-4 py-3 text-xs leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-card text-foreground border border-border shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-[10px] mt-1.5 block font-mono ${message.role === 'user' ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                      {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card text-muted-foreground border border-border rounded-xl px-4 py-2.5 text-xs flex items-center gap-2 shadow-xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Menyiapkan rujukan resmi...</span>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-4 sm:px-6 py-4 shadow-xs">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-2.5">
            <Input
              type="text"
              placeholder="Tuliskan pertanyaan Anda mengenai PMB..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-background border-border text-xs sm:text-sm h-10"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="gap-2 px-5 h-10 font-semibold text-xs"
            >
              <Send className="w-4 h-4" />
              Kirim
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Panduan: Masukkan pertanyaan seputar persyaratan berkas, kuota prodi, atau jadwal tahapan pendaftaran.
          </p>
        </form>
      </div>
    </div>
  );
}

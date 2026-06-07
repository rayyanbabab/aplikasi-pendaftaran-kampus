'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Loader2, ArrowLeft, Home, LayoutDashboard, Shield } from 'lucide-react';
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
        'Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.';
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

  if (!session) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0">
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Shield className="h-5 w-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asisten PMB</h1>
              <p className="text-sm text-gray-500">Tanya jawab tentang penerimaan mahasiswa baru</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleNewChat} size="sm">
            Chat Baru
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {session.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 text-center max-w-md">
                <div className="text-4xl mb-4">💬</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Mulai Percakapan</h2>
                <p className="text-gray-600 mb-6">
                  Tanyakan apa saja tentang program studi, jalur masuk, jadwal pendaftaran, atau proses pendaftaran.
                </p>
                <div className="space-y-2 text-sm text-left">
                  <p className="text-gray-500">Contoh pertanyaan:</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Apa program studi yang tersedia?</li>
                    <li>• Bagaimana jalur masuk SNBP?</li>
                    <li>• Kapan pendaftaran dimulai?</li>
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
                    className={`max-w-2xl rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 border border-gray-200 rounded-lg rounded-bl-none px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Sedang mengetik...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Ketik pertanyaan Anda..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tips: Tanyakan tentang program studi, jalur masuk, jadwal, atau proses pendaftaran
          </p>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "./actions";
import { useRouter } from "next/navigation";

interface ChatInterfaceProps {
  chatId: string;
  initialMessages: any[];
  currentUser: any;
  otherUser: any;
}

export default function ChatInterface({ chatId, initialMessages, currentUser, otherUser }: ChatInterfaceProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Polling for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  // Update messages when props change (from router.refresh())
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("text", text);

    setText("");
    await sendMessage(formData);
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Список сообщений */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f2f4f7]"
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.senderId === currentUser.id
                ? 'bg-[#0077ff] text-white rounded-tr-none'
                : 'bg-white text-[#222] rounded-tl-none border border-gray-100'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Форма отправки */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишите сообщение..."
            autoComplete="off"
            className="flex-1 bg-gray-100 border-none rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-[#0077ff]/20 transition-all text-sm"
          />
          <button
            type="submit"
            className="bg-[#0077ff] text-white p-3 rounded-full hover:bg-[#0066dd] transition-colors disabled:opacity-50"
            disabled={!text.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

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
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fast polling via API
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          // Only update if count changed or last message changed to avoid jitter
          if (data.length !== messages.length || (data.length > 0 && data[data.length-1].id !== messages[messages.length-1]?.id)) {
            setMessages(data);
          }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    const interval = setInterval(pollMessages, 2000);
    return () => clearInterval(interval);
  }, [chatId, messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;

    setSending(true);
    const formData = new FormData();
    formData.append("chatId", chatId);
    formData.append("text", text);

    const currentText = text;
    setText("");

    try {
      await sendMessage(formData);
      // Immediate poll after send
      const res = await fetch(`/api/messages/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      setText(currentText);
    } finally {
      setSending(false);
    }
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
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
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
            disabled={sending}
            className="flex-1 bg-gray-100 border-none rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-[#0077ff]/20 transition-all text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            className="bg-[#0077ff] text-white p-3 rounded-full hover:bg-[#0066dd] transition-colors disabled:opacity-50"
            disabled={!text.trim() || sending}
          >
            <Send size={20} className={sending ? "animate-pulse" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}

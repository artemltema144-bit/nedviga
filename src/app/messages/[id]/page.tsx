import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { sendMessage } from "./actions";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

export default async function ChatPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const { user } = await validateRequest();
  if (!user) return redirect("/login");

  const chat = await prisma.chat.findUnique({
    where: { id: params.id },
    include: {
      ad: true,
      users: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: true }
      }
    }
  });

  if (!chat || !chat.users.some(u => u.id === user.id)) notFound();

  const otherUser = chat.users.find(u => u.id !== user.id);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-64px)]">
      {/* Шапка чата */}
      <div className="bg-white border-b p-4 flex items-center gap-4">
        <Link href="/messages" className="md:hidden p-2 hover:bg-gray-100 rounded-full">
           <ArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {otherUser?.email[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-sm">{otherUser?.email}</h2>
          <Link href={`/ads/${chat.ad.id}`} className="text-xs text-[#0077ff] hover:underline">
            Объявление: {chat.ad.title}
          </Link>
        </div>
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f2f4f7]">
        {chat.messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
              msg.senderId === user.id
                ? 'bg-[#0077ff] text-white rounded-tr-none'
                : 'bg-white text-[#222] rounded-tl-none border border-gray-100'
            }`}>
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.senderId === user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Форма отправки */}
      <div className="p-4 bg-white border-t">
        <form action={sendMessage} className="flex gap-2">
          <input type="hidden" name="chatId" value={chat.id} />
          <input
            name="text"
            placeholder="Напишите сообщение..."
            autoComplete="off"
            className="flex-1 bg-gray-100 border-none rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-[#0077ff]/20 transition-all text-sm"
          />
          <button
            type="submit"
            className="bg-[#0077ff] text-white p-3 rounded-full hover:bg-[#0066dd] transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatInterface from "./ChatInterface";

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
          {(otherUser?.name || otherUser?.email || "?")[0].toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-sm">{otherUser?.name || otherUser?.email}</h2>
          <Link href={`/ads/${chat.ad.id}`} className="text-xs text-[#0077ff] hover:underline">
            Объявление: {chat.ad.title}
          </Link>
        </div>
      </div>

      <ChatInterface
        chatId={chat.id}
        initialMessages={chat.messages}
        currentUser={user}
        otherUser={otherUser}
      />
    </div>
  );
}

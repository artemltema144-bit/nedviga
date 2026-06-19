export const dynamic = "force-dynamic";
import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MessagesPage() {
  const { user } = await validateRequest();
  if (!user) return redirect("/login");

  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: { id: user.id }
      }
    },
    include: {
      ad: true,
      users: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Сообщения</h1>

      {chats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-gray-500">У вас пока нет активных диалогов</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y">
          {chats.map(chat => {
            const otherUser = chat.users.find(u => u.id !== user.id);
            const lastMessage = chat.messages[0];

            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  {otherUser?.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-[#222] truncate">{otherUser?.email}</p>
                    <p className="text-xs text-gray-400">
                      {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 font-medium truncate mb-1">
                    Объявление: {chat.ad.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {lastMessage?.text || "Нет сообщений"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

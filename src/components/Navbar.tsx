import { validateRequest } from "@/lib/auth-utils";
import Link from "next/link";
import { Search, User, MessageSquare, PlusSquare } from "lucide-react";

export default async function Navbar() {
  const { user } = await validateRequest();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Верхняя панель */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black text-[#222] tracking-tighter">
              nedviga
            </Link>
            <nav className="hidden md:flex gap-4 text-sm text-gray-600">
              <Link href="/?type=Продажа" className="hover:text-[#0077ff]">Купить</Link>
              <Link href="/?type=Аренда" className="hover:text-[#0077ff]">Снять</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/messages" className="text-gray-600 hover:text-[#0077ff] p-2">
              <MessageSquare size={24} />
            </Link>
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-[#0077ff] p-2">
                <User size={24} />
                <span className="hidden sm:inline text-sm font-medium">{user.name || user.email.split('@')[0]}</span>
              </Link>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-[#0077ff] font-medium text-sm">
                Вход и регистрация
              </Link>
            )}
            <Link
              href="/ads/create"
              className="bg-[#00aa61] text-white px-4 py-2 rounded-md hover:bg-[#008f51] transition-colors text-sm font-bold flex items-center gap-2"
            >
              <PlusSquare size={18} />
              Разместить объявление
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

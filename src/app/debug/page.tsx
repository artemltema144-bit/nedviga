import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DebugPage() {
  let dbStatus = "Checking...";
  let error: any = null;
  let currentDbUrl = process.env.DATABASE_URL || "НЕТУ (не задана)";

  // Маскируем пароль для безопасности
  const maskedUrl = currentDbUrl.replace(/:[^:@]+@/, ":****@");

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "Connected ✅";
  } catch (e: any) {
    dbStatus = "Error ❌";
    error = e.message;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white mt-10 rounded-2xl shadow-xl border border-gray-100 font-sans">
      <h1 className="text-3xl font-black mb-8 text-[#222]">Диагностика системы</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Статус базы данных</p>
            <p className={`text-xl font-bold ${dbStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
              {dbStatus}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Текущий порт подключения</p>
            <p className="text-xl font-mono font-bold text-gray-700">
              {currentDbUrl.includes(":6543") ? "6543 (Правильно)" : (currentDbUrl.includes(":5432") ? "5432 (ОШИБКА!)" : "Неизвестно")}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
          <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-2">Настройка в Netlify</p>
          <code className="text-xs text-blue-800 break-all font-mono bg-white/50 p-2 rounded block">
            DATABASE_URL={maskedUrl}
          </code>
        </div>

        {error && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-100">
            <p className="text-sm text-red-800 font-black mb-3">Техническая ошибка:</p>
            <div className="bg-white/80 p-4 rounded-xl text-xs text-red-700 font-mono overflow-auto max-h-40">
              {error}
            </div>
          </div>
        )}

        <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
          <h3 className="font-black text-amber-900 mb-3 flex items-center gap-2">
             Что нужно сделать:
          </h3>
          <ul className="text-sm text-amber-800 space-y-3">
            <li className="flex gap-2">
              <span className="font-black">1.</span>
              <span>В настройках Netlify должна быть строка с портом <b>6543</b> и <b>?pgbouncer=true</b> на конце.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">2.</span>
              <span>После смены пароля или ссылки в Netlify нужно нажать <b>"Clear cache and deploy site"</b>.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black">3.</span>
              <span>Если пишет "Error", проверьте, что в пароле <b>p4nO3Cn3GBXWz2Wx</b> нет лишних пробелов.</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link href="/" className="flex-1 text-center py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
            На главную
          </Link>
          <Link href="/login" className="flex-1 text-center py-4 bg-[#0077ff] text-white rounded-xl font-bold hover:bg-[#0066dd] transition-all shadow-lg shadow-blue-100">
            Попробовать войти
          </Link>
        </div>
      </div>
    </div>
  );
}

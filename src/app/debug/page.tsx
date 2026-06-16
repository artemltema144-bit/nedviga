import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function DebugPage() {
  let dbStatus = "Checking...";
  let error: any = null;

  try {
    // Попытка простого запроса
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "Connected ✅";
  } catch (e: any) {
    dbStatus = "Error ❌";
    error = e.message;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white mt-10 rounded-xl shadow-md border">
      <h1 className="text-2xl font-bold mb-6">Диагностика подключения</h1>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-gray-50 border">
          <p className="text-sm text-gray-500 uppercase font-bold mb-1">Статус базы данных</p>
          <p className={`text-lg font-mono ${dbStatus.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {dbStatus}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-100">
            <p className="text-sm text-red-800 font-bold mb-2">Техническая ошибка:</p>
            <pre className="text-xs text-red-700 whitespace-pre-wrap bg-white/50 p-2 rounded">
              {error}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
          <p className="font-bold mb-2">Советы по исправлению:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Проверьте, что в Netlify добавлена переменная <strong>DATABASE_URL</strong>.</li>
            <li>Строка должна начинаться с <code>postgresql://</code> или <code>postgres://</code>.</li>
            <li>Убедитесь, что пароль в строке указан верно (без квадратных скобок).</li>
            <li>Если используете Supabase Pooler, проверьте наличие <code>?pgbouncer=true</code> в конце.</li>
          </ul>
        </div>

        <Link href="/" className="block text-center mt-6 text-gray-500 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

import { validateRequest } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { logout } from "./actions";

export default async function ProfilePage() {
  const { user } = await validateRequest();

  if (!user) {
    return redirect("/login");
  }

  const ads = await prisma.ad.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#222]">Личный кабинет</h1>
        <form action={logout}>
          <button className="text-gray-500 hover:text-red-500 transition-colors">
            Выйти
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-2">{user.email}</h2>
        <p className="text-gray-500 text-sm">Вы на nedviga с июня 2026</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Мои объявления</h2>
          <Link
            href="/ads/create"
            className="bg-[#00aa61] text-white px-4 py-2 rounded-md hover:bg-[#008f51] transition-colors"
          >
            Разместить объявление
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">У вас пока нет активных объявлений</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <div key={ad.id} className="border rounded-lg overflow-hidden flex bg-white hover:shadow-md transition-shadow">
                <div className="w-1/3 bg-gray-200 h-32 flex items-center justify-center text-gray-400">
                  Нет фото
                </div>
                <div className="p-4 w-2/3">
                  <h3 className="font-semibold truncate">{ad.title}</h3>
                  <p className="text-lg font-bold text-[#222]">
                    {ad.price.toLocaleString()} {"}|{"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">{ad.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

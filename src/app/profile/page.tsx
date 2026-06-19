import { validateRequest } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { logout, updateNickname, deleteAd } from "./actions";
import { Trash2, User as UserIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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
    include: {
      images: {
        take: 1
      }
    }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Настройки профиля */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                <UserIcon size={40} />
              </div>
              <h2 className="text-xl font-bold text-center">{user.name || "Пользователь"}</h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            <form action={updateNickname} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Изменить имя
                </label>
                <input
                  name="name"
                  defaultValue={user.name || ""}
                  placeholder="Ваше имя"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0077ff] focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0077ff] text-white py-2 rounded-lg font-medium hover:bg-[#0066dd] transition-colors"
              >
                Сохранить
              </button>
            </form>

            <div className="mt-8 pt-6 border-t">
              <p className="text-xs text-gray-400 text-center">
                Вы на nedviga с июня 2026
              </p>
            </div>
          </div>
        </div>

        {/* Список объявлений */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Мои объявления</h2>
            <Link
              href="/ads/create"
              className="bg-[#00aa61] text-white px-4 py-2 rounded-md hover:bg-[#008f51] transition-colors text-sm font-bold"
            >
              Добавить
            </Link>
          </div>

          {ads.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">У вас пока нет активных объявлений</p>
              <Link href="/ads/create" className="text-[#0077ff] font-medium mt-2 inline-block">
                Разместите первое объявление прямо сейчас
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white border rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-32 sm:w-48 bg-gray-200 aspect-[4/3] flex-shrink-0 flex items-center justify-center text-gray-400 overflow-hidden">
                    {ad.images.length > 0 ? (
                      <img src={ad.images[0].data} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      "Нет фото"
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/ads/${ad.id}`} className="font-bold text-lg truncate hover:text-[#0077ff] transition-colors">
                          {ad.title}
                        </Link>
                        <form action={deleteAd} onSubmit={(e) => {
                          if(!confirm("Удалить объявление?")) e.preventDefault();
                        }}>
                          <input type="hidden" name="adId" value={ad.id} />
                          <button className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </form>
                      </div>
                      <p className="text-xl font-black text-[#222]">
                        {formatPrice(ad.price)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-gray-400">{ad.city}, {new Date(ad.createdAt).toLocaleDateString()}</p>
                      <Link href={`/ads/${ad.id}`} className="text-[#0077ff] text-sm font-medium hover:underline">
                        Просмотреть
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

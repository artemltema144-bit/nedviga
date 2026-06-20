export const dynamic = "force-dynamic";
import { validateRequest } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { logout, updateNickname, deleteAd } from "./actions";
import { Trash2, User as UserIcon, Calendar, Mail, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function ProfilePage() {
  let user = null;
  let dbError = false;

  try {
    const res = await validateRequest();
    user = res.user;
  } catch (e) {
    console.error("Profile auth check failed:", e);
  }

  if (!user) {
    return redirect("/login");
  }

  let ads: any[] = [];
  try {
    ads = await prisma.ad.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { images: { take: 1 } }
    });
  } catch (e) {
    console.error("Failed to fetch ads for profile:", e);
    dbError = true;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-[#222]">Личный кабинет</h1>
        <form action={logout}>
          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 hover:text-red-500 transition-all">
            Выйти
          </button>
        </form>
      </div>

      {dbError && (
        <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-800">
          <AlertCircle size={24} />
          <div>
            <p className="font-bold">Нет связи с базой данных</p>
            <p className="text-sm">Проверьте DATABASE_URL в Netlify. Порт должен быть 6543.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#0077ff] to-[#00a2ff] rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-100">
                <UserIcon size={48} />
              </div>
              <h2 className="text-2xl font-black text-center text-[#222]">{user.name || "Пользователь"}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>

            <form action={updateNickname} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                  Никнейм на сайте
                </label>
                <input
                  name="name"
                  defaultValue={user.name || ""}
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0077ff] outline-none transition-all font-medium"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#0077ff] text-white py-3 rounded-xl font-bold hover:bg-[#0066dd] transition-all"
              >
                Сохранить имя
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-[#222]">Мои объявления</h2>
            <Link href="/ads/create" className="bg-[#00aa61] text-white px-6 py-2.5 rounded-xl font-bold">
              + Создать
            </Link>
          </div>

          {!dbError && ads.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-gray-400 text-lg font-medium">У вас пока нет активных объявлений</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white border rounded-2xl overflow-hidden flex shadow-sm hover:shadow-md transition-all group">
                  <div className="w-40 sm:w-56 bg-gray-100 aspect-square sm:aspect-video flex-shrink-0 flex items-center justify-center text-gray-300 overflow-hidden relative">
                    {ad.images?.[0] ? (
                      <img src={ad.images[0].data} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      "Нет фото"
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <Link href={`/ads/${ad.id}`} className="font-black text-lg truncate hover:text-[#0077ff]">
                          {ad.title}
                        </Link>
                        <form action={deleteAd}>
                          <input type="hidden" name="adId" value={ad.id} />
                          <button className="text-gray-300 hover:text-red-500 p-2">
                            <Trash2 size={20} />
                          </button>
                        </form>
                      </div>
                      <p className="text-2xl font-black text-[#0077ff]">{formatPrice(ad.price)}</p>
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

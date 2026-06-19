import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, User, MessageCircle, Home as HomeIcon, Layers, Info } from "lucide-react";
import { validateRequest } from "@/lib/auth-utils";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default async function AdPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  let ad: any = null;
  let dbError = false;

  try {
    ad = await prisma.ad.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        images: true,
      },
    });
  } catch (e) {
    console.error("Ad fetch error:", e);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center mt-20">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка базы данных</h1>
        <p className="text-gray-600 mb-6">Не удалось загрузить данные объявления. Пожалуйста, проверьте подключение к базе данных.</p>
        <Link href="/debug" className="bg-[#0077ff] text-white px-6 py-2 rounded-lg font-bold">Проверить подключение</Link>
      </div>
    );
  }

  if (!ad) notFound();

  const { user: currentUser } = await validateRequest();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основной контент */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>

          <div className="bg-gray-100 rounded-xl mb-6 overflow-hidden border">
            {ad.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="aspect-square relative md:col-span-2 overflow-hidden">
                  <img src={ad.images[0].data} alt={ad.title} className="w-full h-full object-cover" />
                </div>
                {ad.images.slice(1).map((img: any, idx: number) => (
                  <div key={img.id} className="aspect-square relative overflow-hidden">
                    <img src={img.data} alt={`${ad.title} ${idx + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center text-gray-400 text-2xl">
                Фото временно отсутствуют
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-white border rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Комнат</p>
              <div className="flex items-center gap-2 font-bold">
                <HomeIcon size={18} className="text-[#0077ff]" />
                {ad.rooms || "—"}
              </div>
            </div>
            <div className="p-4 bg-white border rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Этаж</p>
              <div className="flex items-center gap-2 font-bold">
                <Layers size={18} className="text-[#0077ff]" />
                {ad.floor ? `${ad.floor} из ${ad.totalFloors || '?'}` : "—"}
              </div>
            </div>
            <div className="p-4 bg-white border rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Тип сделки</p>
              <div className="flex items-center gap-2 font-bold">
                <Info size={18} className="text-[#0077ff]" />
                {ad.type}
              </div>
            </div>
            <div className="p-4 bg-white border rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Категория</p>
              <div className="font-bold">{ad.category}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border mb-6">
            <h2 className="text-xl font-bold mb-4">Описание</h2>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-6">
              {ad.description}
            </p>

            {ad.houseType && (
              <div className="pt-4 border-t">
                <span className="text-gray-500 mr-2">Тип дома:</span>
                <span className="font-medium">{ad.houseType}</span>
              </div>
            )}
          </div>

          {ad.coordsX && ad.coordsY && (
            <div className="bg-white p-6 rounded-xl border mb-6">
              <h2 className="text-xl font-bold mb-4">Местоположение</h2>
              <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src="/artemovsk.png"
                  alt="Карта"
                  className="w-full h-full object-contain"
                />
                <div
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center pointer-events-none"
                  style={{ left: `${ad.coordsX}%`, top: `${ad.coordsY}%` }}
                >
                  <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute w-6 h-6 border-2 border-red-600 rounded-full opacity-50 animate-ping" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Точное расположение объекта в г. {ad.city}
              </p>
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {ad.city}{ad.transitStops ? `, ${ad.transitStops}` : ""}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(ad.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Сайдбар с ценой и кнопками */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border sticky top-24 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-4xl font-black text-[#222]">
                  {formatPrice(ad.price)}
                </p>
                <img src="/zhoron.png" alt="Zhoron" className="w-8 h-8 object-contain" />
              </div>
              <p className="text-gray-500">{ad.type}</p>
            </div>

            {currentUser?.id === ad.userId ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 font-medium">
                Это ваше объявление
              </div>
            ) : (
              <div className="space-y-4">
                <button className="w-full py-4 bg-[#0077ff] text-white rounded-lg font-bold hover:bg-[#0066dd] transition-colors flex items-center justify-center gap-2">
                  Показать телефон
                </button>
                <form action={`/messages/create?adId=${ad.id}`} method="POST">
                   <button
                    type="submit"
                    className="w-full py-4 bg-[#00aa61] text-white rounded-lg font-bold hover:bg-[#008f51] transition-colors flex items-center justify-center gap-2"
                   >
                    <MessageCircle size={20} />
                    Откликнуться
                  </button>
                </form>
              </div>
            )}

            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-[#222]">{ad.user.email.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">На nedviga с 2026 года</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

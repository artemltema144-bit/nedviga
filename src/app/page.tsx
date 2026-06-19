import { prisma } from "@/lib/db";
import Link from "next/link";
import { CATEGORIES, CITIES } from "@/lib/constants";
import { Search, Map as MapIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function Home({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await searchParamsPromise;
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  let ads: any[] = [];
  let dbError = false;

  try {
    ads = await prisma.ad.findMany({
      where: {
        city: city,
        category: category,
        title: query ? { contains: query } : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
      },
    });
  } catch (e) {
    console.error("Database error:", e);
    dbError = true;
    // Данные для демонстрации, если база не подключена
    ads = [
      {
        id: "demo-1",
        title: "Квартира в центре Артемовска (Демо)",
        price: 500000,
        city: "Артемовск",
        type: "Продажа",
        createdAt: new Date(),
        images: []
      },
      {
        id: "demo-2",
        title: "Дом у озера (Демо)",
        price: 1200000,
        city: "Вероград",
        type: "Продажа",
        createdAt: new Date(),
        images: []
      }
    ];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Поиск и фильтры */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 border">
        <form action="/" className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              name="q"
              defaultValue={query}
              placeholder="Поиск по объявлениям"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0077ff] outline-none"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>

          <select
            name="city"
            defaultValue={city}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0077ff] outline-none"
          >
            <option value="">Любой город</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            name="category"
            defaultValue={category}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0077ff] outline-none"
          >
            <option value="">Все категории</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[#0077ff] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#0066dd] transition-colors"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#222]">
          {city ? `Недвижимость в г. ${city}` : "Рекомендации для вас"}
        </h2>
        <Link href="/map" className="flex items-center gap-2 text-[#0077ff] font-medium hover:underline">
          <MapIcon size={20} />
          Показать на карте Ирновии
        </Link>
      </div>

      {dbError ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-xl text-center">
          <p className="text-red-800 font-bold mb-2">Ошибка подключения к базе данных</p>
          <p className="text-red-600 text-sm mb-4">Сайт загрузился, но не может получить список объявлений. Проверьте DATABASE_URL в настройках Netlify.</p>
          <Link href="/debug" className="text-red-800 underline font-medium">Перейти на страницу диагностики</Link>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {ads.map((ad) => (
            <Link href={`/ads/${ad.id}`} key={ad.id} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center text-gray-400 relative">
                  {ad.images.length > 0 ? (
                    <img src={ad.images[0].data} alt={ad.title} className="w-full h-full object-cover" />
                  ) : (
                    "Нет фото"
                  )}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                    {ad.type}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-gray-700 h-10 overflow-hidden group-hover:text-[#0077ff] transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-lg font-bold mt-1">
                    {formatPrice(ad.price)}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {ad.city}, {new Date(ad.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

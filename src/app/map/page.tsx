import Link from "next/link";
import { CITIES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Карта страны Ирновия</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Интерактивная схема */}
        <div className="md:col-span-2 relative aspect-square bg-[#a5d8ff] border-4 border-black rounded-lg overflow-hidden">
          {/* Схематичная отрисовка Ирновии на базе скриншотов */}
          <div className="absolute inset-0 flex flex-col">
             {/* Верхняя часть */}
             <div className="h-1/3 flex">
                <div className="w-1/4 border-r-2 border-dashed border-black bg-blue-400 opacity-50 flex items-center justify-center font-bold text-xs">
                   <Link href="/?city=бутрия" className="hover:scale-110 transition-transform">Бутрия</Link>
                </div>
                <div className="w-1/4 bg-white border-b-2 border-black"></div>
                <div className="w-1/4 bg-[#fff3bf] border-2 border-black flex items-center justify-center font-bold text-xs">
                   <Link href="/?city=Космобург" className="hover:scale-110 transition-transform text-center">КОСМОБУРГ</Link>
                </div>
             </div>
             {/* Средняя часть */}
             <div className="h-1/3 flex">
                <div className="w-1/5 border-r-2 border-black bg-blue-300">
                    <div className="h-1/4 flex items-center justify-center font-bold text-[10px]">
                        <Link href="/?city=зофск">Зофск</Link>
                    </div>
                    <div className="h-1/4 flex items-center justify-center font-bold text-[10px] bg-white border-y border-black">
                        <Link href="/?city=Ирновки">Ирновки</Link>
                    </div>
                    <div className="h-1/4 flex items-center justify-center font-bold text-[10px]">
                        <Link href="/?city=римск">Римск</Link>
                    </div>
                </div>
                <div className="flex-1 bg-blue-200 border-b-2 border-black relative">
                   <div className="absolute top-1/4 left-1/4 font-black text-4xl text-black/20 uppercase tracking-[1rem]">ИРНОВИЯ</div>
                   <div className="absolute top-1/3 right-1/4">
                      <Link href="/?city=Артемовск" className="bg-red-400 p-2 rounded-full border border-black hover:bg-red-500 transition-colors font-bold text-xs">
                        АРТЁМОВСК
                      </Link>
                   </div>
                </div>
             </div>
             {/* Нижняя часть */}
             <div className="h-1/3 flex">
                 <div className="w-1/4 bg-blue-400 border-r-2 border-black">
                    <div className="h-1/2 flex items-center justify-center font-bold text-[10px]">
                         <Link href="/?city=дзержинский">Дзержинский</Link>
                    </div>
                    <div className="h-1/2 flex items-center justify-center font-bold text-[10px] border-t border-black">
                         <Link href="/?city=вероград">Вероград</Link>
                    </div>
                 </div>
                 <div className="flex-1 bg-[#dcd3d1] border-2 border-dashed border-black relative">
                    <div className="absolute bottom-4 right-4 font-black text-2xl text-black/20 uppercase">МИСАЙЛЛ</div>
                 </div>
             </div>
          </div>
        </div>

        {/* Список городов для навигации */}
        <div className="bg-white p-6 rounded-xl border">
          <h2 className="text-xl font-bold mb-4">Выбор города</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {CITIES.sort().map(city => (
              <Link
                key={city}
                href={`/?city=${city}`}
                className="block p-3 rounded-lg hover:bg-blue-50 hover:text-[#0077ff] transition-colors border border-transparent hover:border-blue-200 text-sm font-medium"
              >
                {city === "Артемовск" ? "📍 " : ""}{city}
              </Link>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-xs text-yellow-800">
            Для <strong>Артемовска</strong> доступна детальная карта на базе Харькова.
          </div>
        </div>
      </div>
    </div>
  );
}

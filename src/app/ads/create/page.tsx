"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { CATEGORIES, CITIES } from "@/lib/constants";
import { createAd } from "./actions";
import { useRouter } from "next/navigation";
import PhotoUpload from "@/components/PhotoUpload";
import CoordinatePicker from "@/components/CoordinatePicker";

export default function CreateAdPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [selectedCity, setSelectedCity] = useState("Артемовск");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append("images", JSON.stringify(photos));
    if (coords) {
      formData.append("coordsX", coords.x.toString());
      formData.append("coordsY", coords.y.toString());
    }
    const result = await createAd(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/profile");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Новое объявление</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
          <input
            name="title"
            required
            placeholder="Например, 1-к. квартира, 40 м²"
            className="w-full px-3 py-2 border rounded-md focus:ring-[#00aa61] focus:border-[#00aa61]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select name="category" className="w-full px-3 py-2 border rounded-md">
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Тип сделки</label>
            <select name="type" className="w-full px-3 py-2 border rounded-md">
              <option value="Продажа">Продажа</option>
              <option value="Аренда">Аренда</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Город</label>
          <select
            name="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-[#00aa61] focus:border-[#00aa61]"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {selectedCity === "Артемовск" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Расположение на карте</label>
            <CoordinatePicker onCoordsChange={setCoords} />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Комнат</label>
            <input name="rooms" type="number" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Этаж</label>
            <input name="floor" type="number" className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Этажей в доме</label>
            <input name="totalFloors" type="number" className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип дома</label>
          <input name="houseType" placeholder="Например, Кирпичный" className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ближайшая остановка (метро/автобус)</label>
          <input name="transitStops" placeholder="Например, ст. м. Артемовская" className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена (в {"}|{"})</label>
          <input
            name="price"
            type="number"
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-[#00aa61] focus:border-[#00aa61]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea
            name="description"
            rows={5}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-[#00aa61] focus:border-[#00aa61]"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии</label>
          <PhotoUpload onPhotosChange={setPhotos} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#00aa61] text-white font-bold rounded-md hover:bg-[#008f51] transition-colors disabled:opacity-50"
        >
          {loading ? "Публикация..." : "Разместить объявление"}
        </button>
      </form>
    </div>
  );
}

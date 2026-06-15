"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface CoordinatePickerProps {
  onCoordsChange: (coords: { x: number; y: number } | null) => void;
}

export default function CoordinatePicker({ onCoordsChange }: CoordinatePickerProps) {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCoords = { x, y };
    setCoords(newCoords);
    onCoordsChange(newCoords);
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative aspect-[16/9] w-full border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair bg-gray-100"
      >
        <Image
          src="/artemovsk.png"
          alt="Карта Артемовска"
          fill
          className="object-contain"
          draggable={false}
        />

        {coords && (
          <div
            className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center pointer-events-none"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
          >
            <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
            <div className="absolute w-6 h-6 border-2 border-red-600 rounded-full opacity-50 scale-125" />
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-medium text-gray-700 pointer-events-none border border-gray-200">
          Нажмите на карту, чтобы указать расположение
        </div>
      </div>

      {coords ? (
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Координаты: {coords.x.toFixed(1)}, {coords.y.toFixed(1)}
          </p>
          <button
            type="button"
            onClick={() => {
              setCoords(null);
              onCoordsChange(null);
            }}
            className="text-xs text-red-500 hover:underline"
          >
            Сбросить
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">Местоположение не указано</p>
      )}
    </div>
  );
}

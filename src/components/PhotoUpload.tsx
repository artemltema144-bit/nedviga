"use client";

import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import Image from "next/image";

interface PhotoUploadProps {
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
}

export default function PhotoUpload({ maxPhotos = 5, onPhotosChange }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = maxPhotos - photos.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Сжимаем до JPEG с качеством 0.7
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          setPhotos(prev => {
            const newPhotos = [...prev, compressedBase64];
            onPhotosChange(newPhotos);
            return newPhotos;
          });
        };
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      onPhotosChange(newPhotos);
      return newPhotos;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
            <img src={photo} alt={`Upload ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-gray-500 hover:text-[#00aa61] hover:border-[#00aa61] transition-colors"
          >
            <Camera size={24} />
            <span className="text-[10px] mt-1">Добавить</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Максимум {maxPhotos} фото. Первое фото будет на обложке.
      </p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}

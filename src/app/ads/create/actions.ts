"use server";

import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAd(formData: FormData) {
  const { user } = await validateRequest();

  if (!user) {
    return { error: "Необходима авторизация" };
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const type = formData.get("type") as string;
  const city = formData.get("city") as string;
  const price = parseFloat(formData.get("price") as string);
  const description = formData.get("description") as string;
  const imagesJson = formData.get("images") as string;
  const images = imagesJson ? JSON.parse(imagesJson) : [];

  const rooms = formData.get("rooms") ? parseInt(formData.get("rooms") as string) : null;
  const floor = formData.get("floor") ? parseInt(formData.get("floor") as string) : null;
  const totalFloors = formData.get("totalFloors") ? parseInt(formData.get("totalFloors") as string) : null;
  const houseType = formData.get("houseType") as string;
  const transitStops = formData.get("transitStops") as string;
  const coordsX = formData.get("coordsX") ? parseFloat(formData.get("coordsX") as string) : null;
  const coordsY = formData.get("coordsY") ? parseFloat(formData.get("coordsY") as string) : null;

  if (!title || !category || !type || !city || isNaN(price) || !description) {
    return { error: "Заполните все поля корректно" };
  }

  try {
    await prisma.ad.create({
      data: {
        title,
        category,
        type,
        city,
        price,
        description,
        rooms,
        floor,
        totalFloors,
        houseType,
        transitStops,
        coordsX,
        coordsY,
        userId: user.id,
        images: {
          create: images.map((img: string) => ({ data: img }))
        }
      },
    });

    revalidatePath("/profile");
    revalidatePath("/");
  } catch (e) {
    console.error(e);
    return { error: "Ошибка при создании объявления" };
  }
}

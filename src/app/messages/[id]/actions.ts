"use server";

import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData): Promise<void> {
  const { user } = await validateRequest();
  if (!user) return;

  const chatId = formData.get("chatId") as string;
  const text = formData.get("text") as string;

  if (!text.trim()) return;

  await prisma.message.create({
    data: {
      chatId,
      senderId: user.id,
      text
    }
  });

  revalidatePath(`/messages/${chatId}`);
}

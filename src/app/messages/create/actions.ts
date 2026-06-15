"use server";

import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { sendEmailNotification } from "@/lib/email";

export async function createChat(formData: FormData) {
  const { user: currentUser } = await validateRequest();
  const adId = formData.get("adId") as string;

  if (!currentUser) return redirect("/login");

  const ad = await prisma.ad.findUnique({
    where: { id: adId },
    include: { user: true }
  });

  if (!ad) return redirect("/");
  if (ad.userId === currentUser.id) return redirect(`/ads/${adId}`);

  // Проверяем, есть ли уже чат между этими пользователями по этому объявлению
  let chat = await prisma.chat.findFirst({
    where: {
      adId: adId,
      users: {
        every: {
          id: { in: [currentUser.id, ad.userId] }
        }
      }
    }
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        adId: adId,
        users: {
          connect: [
            { id: currentUser.id },
            { id: ad.userId }
          ]
        },
        messages: {
          create: {
            senderId: currentUser.id,
            text: "Здравствуйте! Я заинтересован вашим объявлением."
          }
        }
      }
    });

    // Отправка уведомления на почту продавцу
    await sendEmailNotification({
      to: ad.user.email,
      subject: `Новый отклик на объявление: ${ad.title}`,
      text: `Здравствуйте! Пользователь ${currentUser.email} прислал вам новый отклик на объявление "${ad.title}". Посмотреть сообщение можно в личном кабинете nedviga.`
    });
  }

  return redirect(`/messages/${chat.id}`);
}

"use server";

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logout(): Promise<void> {
	const { session } = await validateRequest();
	if (!session) {
		return;
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	(await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return redirect("/login");
}

export async function updateNickname(formData: FormData): Promise<void> {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  if (!name || name.length < 2) return;

  await prisma.user.update({
    where: { id: user.id },
    data: { name },
  });

  revalidatePath("/profile");
}

export async function deleteAd(formData: FormData): Promise<void> {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const adId = formData.get("adId") as string;

  const ad = await prisma.ad.findUnique({
    where: { id: adId }
  });

  if (!ad || ad.userId !== user.id) throw new Error("Unauthorized");

  await prisma.ad.delete({
    where: { id: adId }
  });

  revalidatePath("/profile");
  revalidatePath("/");
}

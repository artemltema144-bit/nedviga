"use server";

import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || email.length < 3 || email.length > 31 || !email.includes("@")) {
    return { error: "Некорректный email" };
  }
  if (typeof password !== "string" || password.length < 6 || password.length > 255) {
    return { error: "Пароль должен быть от 6 символов" };
  }

  const hashedPassword = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  try {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        hashedPassword,
      },
    });

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  } catch (e) {
    return { error: "Пользователь с таким email уже существует" };
  }

  return redirect("/");
}

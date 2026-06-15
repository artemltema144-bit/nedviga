"use server";

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { Session, User } from "lucia";

export const validateRequest = cache(
	async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
		try {
			const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
			if (!sessionId) {
				return {
					user: null,
					session: null
				};
			}

			const result = await lucia.validateSession(sessionId);

			// We skip setting cookies during render to avoid Next.js "headers already sent" or
			// "cannot set cookies during render" errors on production environments like Netlify.
			// Session extension will happen on next Server Action or via a middleware if needed.

			return result;
		} catch (e) {
			console.error("Auth validation error:", e);
			return { user: null, session: null };
		}
	}
);

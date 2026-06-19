import { validateRequest } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { user } = await validateRequest();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { chatId } = await params;

  try {
    // Verify access
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true }
    });

    if (!chat || !chat.users.some(u => u.id === user.id)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: { sender: true }
    });

    return NextResponse.json(messages);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

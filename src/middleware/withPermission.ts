import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hasPermission } from "@/utils/guard";
import { auth } from "@/auth";

export async function withPermission(req: NextRequest, permissionBit: number) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!hasPermission(user.role.permissions, permissionBit)) {
    return NextResponse.json({ error: "Forbidden: You do not have the required permission" }, { status: 403 });
  }

  return NextResponse.next();
}

import prisma from "@/lib/prisma";

export async function GET() {
    const roles = await prisma.role.findMany({ select: { id: true, name: true } });
    return Response.json(roles);
  }
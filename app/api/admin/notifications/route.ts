import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware";
import { createNotification } from "@/lib/notifications";

export const POST = withAuth(async (req: NextRequest) => {
  const { userIds, title, message } = await req.json();
  if (!title || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // if no userIds provided, send to all students
  const targets = userIds?.length
    ? userIds
    : (await prisma.user.findMany({ where: { role: "STUDENT" }, select: { id: true } })).map((u: { id: string }) => u.id);

  await Promise.all(targets.map((id: string) => createNotification(id, title, message)));
  return NextResponse.json({ success: true, sent: targets.length });
}, ["ADMIN"]);

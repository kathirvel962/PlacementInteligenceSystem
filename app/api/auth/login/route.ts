import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password)))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 604800 });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, department, cgpa, backlogs, skills, certifications } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const userRole = role === "ADMIN" ? "ADMIN" : "STUDENT";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: userRole,
        ...(userRole === "STUDENT" && {
          studentProfile: {
            create: {
              department: department || "N/A",
              cgpa: parseFloat(cgpa) || 0,
              backlogs: parseInt(backlogs) || 0,
              skills: skills || "",
              certifications: certifications || "",
            },
          },
        }),
      },
      include: { studentProfile: true },
    });

    await createAuditLog(user.id, "REGISTER", "User", user.id, `${userRole} registered`);

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
    res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 604800 });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

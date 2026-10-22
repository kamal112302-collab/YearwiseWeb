import { createCookieSessionStorage, redirect } from "react-router";
import { db } from "../db.server";
import bcrypt from "bcryptjs";

export var SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-me";
export var adminSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__yearwise_admin_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    maxAge: 604800
  }
});
export async function getAdminSession(request) {
  return adminSessionStorage.getSession(request.headers.get("Cookie"));
}
export function adminFromSession(session) {
  const adminId = session.get("adminId");
  const email = session.get("adminEmail");
  const role = session.get("adminRole");
  if (!adminId || !email || !role) return null;
  return {
    id: adminId,
    email,
    role
  };
}
export async function requireAdmin(request) {
  const session = await getAdminSession(request);
  const fromCookie = adminFromSession(session);
  if (fromCookie) return {
    admin: fromCookie,
    session
  };
  const adminId = session.get("adminId");
  if (!adminId) throw redirect("/admin/login");
  const admin = await db.adminUser.findUnique({
    where: {
      id: adminId
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });
  if (!admin) throw redirect("/admin/login");
  return {
    admin,
    session
  };
}
export async function getAdmin(request) {
  const session = await getAdminSession(request);
  const fromCookie = adminFromSession(session);
  if (fromCookie) return fromCookie;
  const adminId = session.get("adminId");
  if (!adminId) return null;
  return db.adminUser.findUnique({
    where: {
      id: adminId
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });
}
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
export async function createAdminSession(admin, redirectTo = "/admin") {
  const session = await adminSessionStorage.getSession();
  session.set("adminId", admin.id);
  session.set("adminEmail", admin.email);
  session.set("adminRole", admin.role);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await adminSessionStorage.commitSession(session)
    }
  });
}
export async function destroyAdminSession(request) {
  const session = await getAdminSession(request);
  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": await adminSessionStorage.destroySession(session)
    }
  });
}



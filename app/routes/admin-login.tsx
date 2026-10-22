import { isDatabaseAvailable, db } from "../db.server";
import { getAdmin, verifyPassword, createAdminSession } from "../lib/session.server";
import { redirect, useActionData, Form } from "react-router";
import { DatabaseUnavailable } from "../components/admin/DatabaseUnavailable";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function loader$11({
  request
}) {
  if (!isDatabaseAvailable()) return {
    dbAvailable: false
  };
  if (await getAdmin(request)) throw redirect("/admin");
  return {
    dbAvailable: true
  };
}
async function action$8({
  request
}) {
  if (!isDatabaseAvailable()) return {
    error: "Database is not configured."
  };
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return {
    error: "Email and password are required."
  };
  const admin = await db.adminUser.findUnique({
    where: {
      email
    }
  });
  if (!admin || !(await verifyPassword(password, admin.passwordHash))) return {
    error: "Invalid email or password."
  };
  return createAdminSession({
    id: admin.id,
    email: admin.email,
    role: admin.role
  });
}
function AdminLogin({
  loaderData
}) {
  const actionData = useActionData();
  if (!loaderData.dbAvailable) return <div className="flex min-h-dvh items-center justify-center bg-brand-navy p-4"> <DatabaseUnavailable /></div>;
  return <div className="flex min-h-dvh items-center justify-center bg-brand-navy p-4"> <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"> <h1 className="text-center text-2xl font-bold text-brand-navy">Admin login</h1> <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">Yearwise Services</p>{actionData?.error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{actionData.error}</div>} <Form method="post" className="flex flex-col gap-4"> <Input label="Email" name="email" type="email" required autoComplete="email" /> <Input label="Password" name="password" type="password" required autoComplete="current-password" /> <Button type="submit" className="w-full">Sign in</Button></Form></div></div>;
}

export default AdminLogin;
export { action$8 as action, loader$11 as loader };

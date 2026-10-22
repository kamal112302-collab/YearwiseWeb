import { isDatabaseAvailable } from "../db.server";
import { requireAdmin } from "../lib/session.server";
import { useNavigation, Outlet } from "react-router";
import { DatabaseUnavailable } from "../components/admin/DatabaseUnavailable";
import { NavigationProgress } from "../components/NavigationProgress";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { cn } from "../lib/utils";

async function loader$9({
  request
}) {
  if (!isDatabaseAvailable()) return {
    dbAvailable: false,
    admin: null
  };
  const {
    admin
  } = await requireAdmin(request);
  return {
    dbAvailable: true,
    admin: {
      email: admin.email,
      role: admin.role
    }
  };
}
function AdminLayout({
  loaderData
}) {
  const pending = useNavigation().state !== "idle";
  if (!loaderData.dbAvailable) return <div className="flex min-h-dvh items-center justify-center bg-brand-surface p-4"> <DatabaseUnavailable /></div>;
  return <div className="flex min-h-dvh bg-brand-surface"> <NavigationProgress /> <AdminSidebar /> <main className={cn("flex-1 overflow-auto p-4 pt-16 lg:p-8 lg:pt-8", pending && "opacity-80")}> <Outlet /></main></div>;
}

export default AdminLayout;
export { loader$9 as loader };

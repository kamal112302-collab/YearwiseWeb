import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router";
import { db } from "../db.server";
import { asPublicId, mediaUrl } from "../lib/media";
import { presentService } from "../lib/service-record";
import { requireAdmin } from "../lib/session.server";
import { formatCurrency } from "../lib/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const services = await db.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return { services: services.map(presentService) };
}

export default function AdminServices({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { services } = loaderData;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Services</h1>
      <p className="mt-1 text-sm text-muted-foreground">View a service, or open it to edit the copy, price, and photos.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-brand-surface text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Photo</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No services yet.
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const photoId = asPublicId(service.cardImage || service.heroImage);
                  const photo = photoId ? mediaUrl(photoId, 160) : null;
                  return (
                    <tr key={service.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        {photo ? (
                          <img src={photo} alt="" className="h-12 w-16 rounded-lg object-cover" />
                        ) : (
                          <span className="inline-flex h-12 w-16 items-center justify-center rounded-lg bg-brand-surface text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brand-navy">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-brand-navy">{formatCurrency(String(service.startingPrice))}</td>
                      <td className="px-4 py-3">
                        <span className={service.isActive ? "font-medium text-brand-green" : "text-muted-foreground"}>
                          {service.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{service.sortOrder}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/services/${service.id}`}
                            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy px-4 text-sm font-medium text-brand-navy hover:bg-brand-navy hover:text-white"
                          >
                            View
                          </Link>
                          <Link
                            to={`/admin/services/${service.id}/edit`}
                            className="inline-flex min-h-11 items-center rounded-full bg-brand-green px-4 text-sm font-medium text-white hover:opacity-90"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

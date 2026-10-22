import type { LoaderFunctionArgs } from "react-router";
import { data, Link } from "react-router";
import { db } from "../db.server";
import { presentService } from "../lib/service-record";
import { requireAdmin } from "../lib/session.server";
import { formatCurrency } from "../lib/utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const service = await db.service.findUnique({ where: { id: params.id } });
  if (!service) throw data("Not found", { status: 404 });
  return { service: presentService(service) };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-brand-navy">{value || "—"}</dd>
    </div>
  );
}

function Photo({ label, src }: { label: string; src: string | null }) {
  return (
    <figure>
      <figcaption className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</figcaption>
      {src ? (
        <img src={src} alt="" className="mt-2 aspect-[4/3] w-full rounded-2xl object-cover" />
      ) : (
        <p className="mt-2 rounded-2xl bg-brand-surface px-4 py-10 text-center text-sm text-muted-foreground">No image</p>
      )}
    </figure>
  );
}

export default function AdminServiceView({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const { service } = loaderData;

  return (
    <div>
      <Link to="/admin/services" className="text-sm font-medium text-brand-navy underline-offset-2 hover:underline">
        Services
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">{service.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">/{service.slug}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/services/${service.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-brand-navy px-4 text-sm font-medium text-brand-navy hover:bg-brand-navy hover:text-white"
          >
            View on site
          </a>
          <Link
            to={`/admin/services/${service.id}/edit`}
            className="inline-flex min-h-11 items-center rounded-full bg-brand-green px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <dl className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-6">
          <Field label="Short description" value={service.shortDescription ?? ""} />
          <Field label="Description" value={service.description} />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Starting price" value={formatCurrency(String(service.startingPrice))} />
            <Field label="Status" value={service.isActive ? "Active" : "Hidden"} />
            <Field label="Sort order" value={String(service.sortOrder)} />
          </div>
          <Field label="SEO title" value={service.seoTitle ?? ""} />
          <Field label="SEO description" value={service.seoDescription ?? ""} />
        </dl>
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-6">
          <Photo label="Hero image" src={service.heroImage} />
          <Photo label="Card image" src={service.cardImage} />
        </div>
      </div>
    </div>
  );
}

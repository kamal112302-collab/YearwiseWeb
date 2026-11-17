import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useNavigation } from "react-router";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { db } from "../db.server";
import { requireAdmin } from "../lib/session.server";
import { formatCurrency } from "../lib/utils";

const CADENCES = ["weekly", "biweekly", "onetime"] as const;
const CATEGORIES = ["cleanup", "other"] as const;

function parseList(raw: string) {
  return raw
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const [plans, turfPrograms, quoteServices] = await Promise.all([
    db.lawnMowingPlan.findMany({ orderBy: { sortOrder: "asc" } }),
    db.lawnTurfProgram.findMany({ orderBy: { sortOrder: "asc" } }),
    db.lawnQuoteService.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    plans: plans.map((plan) => ({
      id: plan.id,
      label: plan.label,
      price: Number(plan.price),
      cadence: plan.cadence,
      basisNote: plan.basisNote ?? "",
      includes: plan.includes.join("\n"),
      sortOrder: plan.sortOrder,
      isActive: plan.isActive,
    })),
    turfPrograms: turfPrograms.map((program) => ({
      id: program.id,
      name: program.name,
      price: Number(program.price),
      features: program.features.join("\n"),
      sortOrder: program.sortOrder,
      isActive: program.isActive,
    })),
    quoteServices: quoteServices.map((service) => ({
      id: service.id,
      name: service.name,
      category: service.category,
      description: service.description,
      sortOrder: service.sortOrder,
      isActive: service.isActive,
    })),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  if (intent === "create-plan") {
    await db.lawnMowingPlan.create({
      data: {
        label: String(formData.get("label") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        cadence: String(formData.get("cadence") ?? "weekly") as (typeof CADENCES)[number],
        basisNote: String(formData.get("basisNote") ?? "").trim() || null,
        includes: parseList(String(formData.get("includes") ?? "")),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true };
  }

  if (intent === "update-plan") {
    await db.lawnMowingPlan.update({
      where: { id: String(formData.get("id")) },
      data: {
        label: String(formData.get("label") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        cadence: String(formData.get("cadence") ?? "weekly") as (typeof CADENCES)[number],
        basisNote: String(formData.get("basisNote") ?? "").trim() || null,
        includes: parseList(String(formData.get("includes") ?? "")),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isActive: formData.get("isActive") === "on",
      },
    });
    return { ok: true };
  }

  if (intent === "delete-plan") {
    await db.lawnMowingPlan.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true };
  }

  if (intent === "create-turf") {
    await db.lawnTurfProgram.create({
      data: {
        name: String(formData.get("name") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        features: parseList(String(formData.get("features") ?? "")),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true };
  }

  if (intent === "update-turf") {
    await db.lawnTurfProgram.update({
      where: { id: String(formData.get("id")) },
      data: {
        name: String(formData.get("name") ?? "").trim(),
        price: Number(formData.get("price") ?? 0).toFixed(2),
        features: parseList(String(formData.get("features") ?? "")),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isActive: formData.get("isActive") === "on",
      },
    });
    return { ok: true };
  }

  if (intent === "delete-turf") {
    await db.lawnTurfProgram.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true };
  }

  if (intent === "create-quote") {
    await db.lawnQuoteService.create({
      data: {
        name: String(formData.get("name") ?? "").trim(),
        category: String(formData.get("category") ?? "other") as (typeof CATEGORIES)[number],
        description: String(formData.get("description") ?? "").trim(),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
      },
    });
    return { ok: true };
  }

  if (intent === "update-quote") {
    await db.lawnQuoteService.update({
      where: { id: String(formData.get("id")) },
      data: {
        name: String(formData.get("name") ?? "").trim(),
        category: String(formData.get("category") ?? "other") as (typeof CATEGORIES)[number],
        description: String(formData.get("description") ?? "").trim(),
        sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
        isActive: formData.get("isActive") === "on",
      },
    });
    return { ok: true };
  }

  if (intent === "delete-quote") {
    await db.lawnQuoteService.delete({ where: { id: String(formData.get("id")) } });
    return { ok: true };
  }

  return { ok: false };
}

export default function AdminLawnPricing({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  const saving = useNavigation().state !== "idle";
  const { plans, turfPrograms, quoteServices } = loaderData;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Lawn Pricing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mowing plans, turf programs, and quote-only extras. Changes show on the lawn care page.
        </p>
      </div>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-brand-navy">Mowing plans</h2>
        <Form method="post" className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="create-plan" />
          <h3 className="font-semibold text-brand-navy">Add plan</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input label="Label" name="label" placeholder="Weekly" required />
            <Input label="Price (CAD)" name="price" type="number" min="0" step="1" required />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-navy">Cadence</span>
              <select name="cadence" className="min-h-11 rounded-xl border border-border bg-white px-3" defaultValue="weekly">
                {CADENCES.map((cadence) => (
                  <option key={cadence} value={cadence}>
                    {cadence}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" />
          </div>
          <Input label="Basis note" name="basisNote" placeholder="Based on 2,500 sq. ft." />
          <Textarea label="Includes (one per line)" name="includes" rows={4} placeholder={"Lawn mowing\nTrimming"} />
          <Button type="submit" disabled={saving}>
            Add plan
          </Button>
        </Form>

        <div className="flex flex-col gap-4">
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No mowing plans yet.</p>
          ) : (
            plans.map((plan) => (
              <div key={plan.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
                <Form method="post" className="flex flex-col gap-4">
                  <input type="hidden" name="intent" value="update-plan" />
                  <input type="hidden" name="id" value={plan.id} />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Input label="Label" name="label" defaultValue={plan.label} required />
                    <Input label="Price" name="price" type="number" min="0" step="1" defaultValue={String(plan.price)} required />
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-medium text-brand-navy">Cadence</span>
                      <select name="cadence" className="min-h-11 rounded-xl border border-border bg-white px-3" defaultValue={plan.cadence}>
                        {CADENCES.map((cadence) => (
                          <option key={cadence} value={cadence}>
                            {cadence}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(plan.sortOrder)} />
                  </div>
                  <Input label="Basis note" name="basisNote" defaultValue={plan.basisNote} />
                  <Textarea label="Includes (one per line)" name="includes" rows={4} defaultValue={plan.includes} />
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" name="isActive" defaultChecked={plan.isActive} />
                      Active on site
                    </label>
                    <Button type="submit" disabled={saving}>
                      Save
                    </Button>
                    <span className="text-sm text-muted-foreground">{formatCurrency(plan.price)}</span>
                  </div>
                </Form>
                <Form
                  method="post"
                  onSubmit={(event) => {
                    if (!confirm(`Delete ${plan.label}?`)) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="intent" value="delete-plan" />
                  <input type="hidden" name="id" value={plan.id} />
                  <Button type="submit" variant="outline" disabled={saving}>
                    Delete plan
                  </Button>
                </Form>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-brand-navy">Turf care programs</h2>
        <Form method="post" className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="create-turf" />
          <h3 className="font-semibold text-brand-navy">Add program</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Name" name="name" placeholder="Program 1" required />
            <Input label="Price (CAD)" name="price" type="number" min="0" step="1" required />
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" />
          </div>
          <Textarea label="Features (one per line)" name="features" rows={5} required />
          <Button type="submit" disabled={saving}>
            Add program
          </Button>
        </Form>

        <div className="flex flex-col gap-4">
          {turfPrograms.map((program) => (
            <div key={program.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
              <Form method="post" className="flex flex-col gap-4">
                <input type="hidden" name="intent" value="update-turf" />
                <input type="hidden" name="id" value={program.id} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input label="Name" name="name" defaultValue={program.name} required />
                  <Input label="Price" name="price" type="number" min="0" step="1" defaultValue={String(program.price)} required />
                  <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(program.sortOrder)} />
                </div>
                <Textarea label="Features (one per line)" name="features" rows={5} defaultValue={program.features} required />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" name="isActive" defaultChecked={program.isActive} />
                    Active on site
                  </label>
                  <Button type="submit" disabled={saving}>
                    Save
                  </Button>
                  <span className="text-sm text-muted-foreground">{formatCurrency(program.price)}</span>
                </div>
              </Form>
              <Form
                method="post"
                onSubmit={(event) => {
                  if (!confirm(`Delete ${program.name}?`)) event.preventDefault();
                }}
              >
                <input type="hidden" name="intent" value="delete-turf" />
                <input type="hidden" name="id" value={program.id} />
                <Button type="submit" variant="outline" disabled={saving}>
                  Delete program
                </Button>
              </Form>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-brand-navy">Quote services</h2>
        <Form method="post" className="flex flex-col gap-4 rounded-2xl border border-dashed border-border bg-white p-6">
          <input type="hidden" name="intent" value="create-quote" />
          <h3 className="font-semibold text-brand-navy">Add quote service</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Name" name="name" placeholder="Spring cleanup" required />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-brand-navy">Category</span>
              <select name="category" className="min-h-11 rounded-xl border border-border bg-white px-3" defaultValue="cleanup">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" />
          </div>
          <Textarea label="Description" name="description" rows={3} required />
          <Button type="submit" disabled={saving}>
            Add quote service
          </Button>
        </Form>

        <div className="flex flex-col gap-4">
          {quoteServices.map((service) => (
            <div key={service.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
              <Form method="post" className="flex flex-col gap-4">
                <input type="hidden" name="intent" value="update-quote" />
                <input type="hidden" name="id" value={service.id} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input label="Name" name="name" defaultValue={service.name} required />
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-brand-navy">Category</span>
                    <select
                      name="category"
                      className="min-h-11 rounded-xl border border-border bg-white px-3"
                      defaultValue={service.category}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(service.sortOrder)} />
                </div>
                <Textarea label="Description" name="description" rows={3} defaultValue={service.description} required />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" name="isActive" defaultChecked={service.isActive} />
                    Active on site
                  </label>
                  <Button type="submit" disabled={saving}>
                    Save
                  </Button>
                </div>
              </Form>
              <Form
                method="post"
                onSubmit={(event) => {
                  if (!confirm(`Delete ${service.name}?`)) event.preventDefault();
                }}
              >
                <input type="hidden" name="intent" value="delete-quote" />
                <input type="hidden" name="id" value={service.id} />
                <Button type="submit" variant="outline" disabled={saving}>
                  Delete quote service
                </Button>
              </Form>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

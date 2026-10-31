import { db } from "../db.server";
import { Form } from "react-router";
import { Button } from "../components/ui/Button";
import { formatInquiryDetails, type InquiryDetails } from "../lib/inquiry-details";

async function loader() {
  return {
    inquiries: await db.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  };
}

async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  await db.inquiry.update({
    where: { id },
    data: { status: "handled" },
  });
  return { ok: true };
}

function AdminInquiries({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy">Inquiries</h1>
      <div className="mt-8 flex flex-col gap-4">
        {loaderData.inquiries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        ) : null}
        {loaderData.inquiries.map((inquiry) => {
          const detailsLine = formatInquiryDetails(inquiry.details as InquiryDetails | null);
          return (
            <article key={inquiry.id} className="rounded-2xl border border-border bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-brand-navy">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(inquiry.createdAt).toLocaleString("en-CA")} ·{" "}
                    <span className={inquiry.status === "new" ? "font-medium text-brand-green" : ""}>
                      {inquiry.status}
                    </span>
                  </p>
                </div>
                {inquiry.status === "new" ? (
                  <Form method="post">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Mark handled
                    </Button>
                  </Form>
                ) : null}
              </div>
              {(inquiry.service || inquiry.neighbourhood) && (
                <p className="mt-3 text-sm">
                  {inquiry.service ? <span className="font-medium">{inquiry.service}</span> : null}
                  {inquiry.neighbourhood ? (
                    <span className="text-muted-foreground"> · {inquiry.neighbourhood}</span>
                  ) : null}
                </p>
              )}
              {detailsLine ? (
                <p className="mt-2 text-sm text-brand-navy">
                  <span className="font-medium">What they need:</span> {detailsLine}
                </p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-brand-navy">{inquiry.message}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default AdminInquiries;
export { action, loader };

import { db } from "../db.server";
import { Form } from "react-router";
import { Button } from "../components/ui/Button";

async function loader$5({}) {
  return {
    inquiries: await db.inquiry.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 100
    })
  };
}
async function action$4({
  request
}) {
  const formData = await request.formData();
  const id = String(formData.get("id"));
  await db.inquiry.update({
    where: {
      id
    },
    data: {
      status: "handled"
    }
  });
  return {
    ok: true
  };
}
function AdminInquiries({
  loaderData
}) {
  return <div> <h1 className="text-2xl font-bold text-brand-navy">Inquiries</h1> <div className="mt-8 flex flex-col gap-4">{loaderData.inquiries.length === 0 && <p className="text-sm text-muted-foreground">No inquiries yet.</p>}{loaderData.inquiries.map(inquiry => <article key={inquiry.id} className="rounded-2xl border border-border bg-white p-5"> <div className="flex flex-wrap items-start justify-between gap-3"> <div> <p className="font-semibold text-brand-navy">{inquiry.name}</p> <p className="text-sm text-muted-foreground">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p> <p className="text-xs text-muted-foreground mt-1">{new Date(inquiry.createdAt).toLocaleString("en-CA")} ·  <span className={inquiry.status === "new" ? "text-brand-green font-medium" : ""}>{inquiry.status}</span></p></div>{inquiry.status === "new" && <Form method="post"> <input type="hidden" name="id" value={inquiry.id} /> <Button type="submit" size="sm" variant="outline">Mark handled</Button></Form>}</div>{(inquiry.service || inquiry.neighbourhood) && <p className="mt-3 text-sm">{inquiry.service && <span className="font-medium">{inquiry.service}</span>}{inquiry.neighbourhood && <span className="text-muted-foreground"> · {inquiry.neighbourhood}</span>}</p>} <p className="mt-3 text-sm text-brand-navy whitespace-pre-wrap">{inquiry.message}</p></article>)}</div></div>;
}

export default AdminInquiries;
export { action$4 as action, loader$5 as loader };

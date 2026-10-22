import { db } from "../db.server";
import { Form } from "react-router";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

async function loader$6({}) {
  return {
    faqs: await db.faq.findMany({
      orderBy: {
        sortOrder: "asc"
      }
    })
  };
}
async function action$5({
  request
}) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  if (intent === "create") await db.faq.create({
    data: {
      question: String(formData.get("question") ?? ""),
      answer: String(formData.get("answer") ?? ""),
      sortOrder: Number(formData.get("sortOrder") ?? 0)
    }
  });
  if (intent === "update") {
    const id = String(formData.get("id"));
    await db.faq.update({
      where: {
        id
      },
      data: {
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
        sortOrder: Number(formData.get("sortOrder") ?? 0),
        isActive: formData.get("isActive") === "on"
      }
    });
  }
  return {
    ok: true
  };
}
function AdminFaqs({
  loaderData
}) {
  return <div> <h1 className="text-2xl font-bold text-brand-navy">FAQs</h1> <Form method="post" className="mt-8 rounded-2xl border border-dashed border-border bg-white p-6 flex flex-col gap-4"> <input type="hidden" name="intent" value="create" /> <h2 className="font-semibold">Add FAQ</h2> <Input label="Question" name="question" required /> <Textarea label="Answer" name="answer" required rows={3} /> <Input label="Sort order" name="sortOrder" type="number" defaultValue="99" /> <Button type="submit">Add FAQ</Button></Form> <div className="mt-8 flex flex-col gap-6">{loaderData.faqs.map(faq => <Form key={faq.id} method="post" className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-4"> <input type="hidden" name="intent" value="update" /> <input type="hidden" name="id" value={faq.id} /> <Input label="Question" name="question" defaultValue={faq.question} /> <Textarea label="Answer" name="answer" defaultValue={faq.answer} rows={4} /> <Input label="Sort order" name="sortOrder" type="number" defaultValue={String(faq.sortOrder)} /> <label className="flex items-center gap-2 text-sm cursor-pointer"> <input type="checkbox" name="isActive" defaultChecked={faq.isActive} />Active</label> <Button type="submit">Save</Button></Form>)}</div></div>;
}

export default AdminFaqs;
export { action$5 as action, loader$6 as loader };

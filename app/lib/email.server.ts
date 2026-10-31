import { Resend } from "resend";

export var resend = null;
export function getResend() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    resend = new Resend(key);
  }
  return resend;
}
export async function sendInquiryNotificationEmail({
  to,
  name,
  email,
  phone,
  service,
  neighbourhood,
  message,
  detailsLine,
}: {
  to: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  neighbourhood?: string | null;
  message: string;
  detailsLine?: string | null;
}) {
  const client = getResend();
  if (!client) {
    console.log("[email] Resend not configured, inquiry logged:", {
      name,
      email,
      detailsLine,
    });
    return;
  }
  await client.emails.send({
    from: "Yearwise Services <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `New quote request from ${name}${service ? ` — ${service}` : ""}`,
    html: `
      <h2>New quote request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "—"}</p>
      <p><strong>Service:</strong> ${service || "—"}</p>
      <p><strong>Neighbourhood:</strong> ${neighbourhood || "—"}</p>
      ${detailsLine ? `<p><strong>What they need:</strong> ${detailsLine}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });
}

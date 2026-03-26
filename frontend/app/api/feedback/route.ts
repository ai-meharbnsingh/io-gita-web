import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

export async function POST(request: Request) {
  const start = Date.now();
  const body = await request.json();
  const { name, email, message, query } = body;

  if (!message || message.trim().length < 3) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  console.log(JSON.stringify({
    level: "info",
    msg: "feedback_received",
    route: "/api/feedback",
    hasName: !!name,
    hasEmail: !!email,
    msgLength: message.length,
  }));

  // Also save to backend
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch {}
  }

  // Send email via SMTP
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `io-gita feedback${name ? " from " + name : ""}`,
      text: `New feedback on io-gita\n\nFrom: ${name || "Anonymous"}\nEmail: ${email || "Not provided"}\n\nMessage:\n${message}\n\nOriginal query:\n${query || "N/A"}`,
    });

    console.log(JSON.stringify({
      level: "info",
      msg: "feedback_email_sent",
      route: "/api/feedback",
      ms: Date.now() - start,
    }));

    return NextResponse.json({ status: "sent" });
  } catch (e) {
    console.error(JSON.stringify({
      level: "error",
      msg: "feedback_email_failed",
      route: "/api/feedback",
      error: e instanceof Error ? e.message : String(e),
      ms: Date.now() - start,
    }));
    return NextResponse.json({ status: "saved" });
  }
}

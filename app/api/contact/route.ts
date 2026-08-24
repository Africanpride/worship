import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { log } from "@/lib/logger";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, email, group, message, turnstileToken } = body;

		// 1. Verify Turnstile Token
		const verifyUrl =
			"https://challenges.cloudflare.com/turnstile/v0/siteverify";
		const verifyResponse = await fetch(verifyUrl, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
		});

		const verifyData = await verifyResponse.json();
		if (!verifyData.success) {
			return NextResponse.json(
				{ error: "Security check failed" },
				{ status: 400 },
			);
		}

		// 2. Configure Nodemailer
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT) || 587,
			secure: process.env.SMTP_SECURE === "true", // usually false for 587
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS,
			},
		});

		// 3. Prepare Email Content
		const mailOptions = {
			from: `"${name}" <${process.env.SMTP_USER}>`, // From user via our SMTP
			replyTo: email,
			to: "correspondence@thenonstop.org",
			subject: `New Contact Form Submission from ${name}`,
			text: `
        Name: ${name}
        Email: ${email}
        Group/Choir: ${group || "N/A"}
        
        Message:
        ${message}
      `,
			html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #6d28d9; border-bottom: 2px solid #6d28d9; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Group/Choir:</strong> ${group || "<i>Not provided</i>"}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
          <footer style="margin-top: 20px; font-size: 12px; color: #777;">
            Sent from The Non-Stop Series™ Website Contact Form
          </footer>
        </div>
      `,
		};

		// 4. Send Email
		await transporter.sendMail(mailOptions);

		return NextResponse.json({
			success: true,
			message: "Email sent successfully",
		});
	} catch (error) {
		log.error("system", "Contact form submission failed", {
			detail: error instanceof Error ? error.message : String(error),
		});
		return NextResponse.json(
			{ error: "Failed to send message" },
			{ status: 500 },
		);
	}
}

import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

cloudinary.config({ secure: true });

export const runtime = "nodejs";

export async function POST(req: Request) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const form = await req.formData().catch(() => null);
	if (!form)
		return NextResponse.json({ error: "No form data" }, { status: 400 });
	const file = form.get("file") as File | null;
	if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
	if (file.size > 1 * 1024 * 1024)
		return NextResponse.json({ error: "Max 1MB" }, { status: 400 });
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	try {
		const res: { secure_url: string } = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					folder: "worship/avatars",
					resource_type: "image",
					transformation: [
						{ width: 512, height: 512, crop: "fill", gravity: "face" },
						{ quality: "auto", fetch_format: "auto" },
					],
				},
				(err, result) =>
					err ? reject(err) : resolve(result as { secure_url: string }),
			);
			stream.end(buffer);
		});
		return NextResponse.json({ url: res.secure_url });
	} catch (e) {
		return NextResponse.json(
			{ error: e instanceof Error ? e.message : String(e) },
			{ status: 500 },
		);
	}
}

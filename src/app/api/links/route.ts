import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { authenticateApiKey } from "@/lib/api-key";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";

export async function POST(request: Request) {
	const apiKey = await authenticateApiKey(request);

	let userId: string | null = apiKey?.userId ?? null;

	if (!userId) {
		const session = await auth();

		userId = session?.user?.id ?? null;
	}

	if (!userId) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();

		const originalUrl = body.originalUrl;

		if (!originalUrl || typeof originalUrl !== "string") {
			return Response.json({ error: "A URL is required" }, { status: 400 });
		}

		const trimmedUrl = originalUrl.trim();

		if (!trimmedUrl) {
			return Response.json({ error: "A URL is required" }, { status: 400 });
		}

		let parsedUrl: URL;

		try {
			parsedUrl = new URL(trimmedUrl);
		} catch {
			return Response.json({ error: "Invalid URL" }, { status: 400 });
		}

		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return Response.json({ error: "Only HTTP and HTTPS URLs are allowed" }, { status: 400 });
		}

		const existingLink = await prisma.link.findFirst({
			where: {
				originalUrl: trimmedUrl,
				userId: userId,
			},
		});

		if (existingLink) {
			return Response.json({
				id: existingLink.id,
				slug: existingLink.slug,
				originalUrl: existingLink.originalUrl,
				shortUrl: `${new URL(request.url).origin}/${existingLink.slug}`,
				createdAt: existingLink.createdAt,
			});
		}

		const slug = randomBytes(4).toString("base64url");

		const link = await prisma.link.create({
			data: {
				slug,
				originalUrl: trimmedUrl,
				userId: userId,
			},
		});

		return Response.json(
			{
				id: link.id,
				slug: link.slug,
				originalUrl: link.originalUrl,
				shortUrl: `${new URL(request.url).origin}/${link.slug}`,
				createdAt: link.createdAt,
			},
			{ status: 201 },
		);
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database Error Code: ${error.code}`);

			if (error.code === "P2002") {
				return Response.json(
					{
						error: "A duplicate slug was generated. Please try again.",
					},
					{ status: 409 },
				);
			}
		} else {
			console.error("An unexpected error occurred:", error);
		}

		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

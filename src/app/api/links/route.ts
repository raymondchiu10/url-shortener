import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();

		const originalUrl = body.originalUrl;

		if (!originalUrl || typeof originalUrl !== "string") {
			return Response.json({ error: "A URL is required" }, { status: 400 });
		}

		let parsedUrl: URL;

		try {
			parsedUrl = new URL(originalUrl);
		} catch {
			return Response.json({ error: "Invalid URL" }, { status: 400 });
		}

		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
			return Response.json({ error: "Only HTTP and HTTPS URLs are allowed" }, { status: 400 });
		}

		const existingLink = await prisma.link.findFirst({
			where: {
				originalUrl,
				userId: session.user.id,
			},
		});

		if (existingLink) {
			return Response.json({
				slug: existingLink.slug,
				shortUrl: `${new URL(request.url).origin}/${existingLink.slug}`,
			});
		}

		const slug = randomBytes(4).toString("base64url");

		const link = await prisma.link.create({
			data: {
				slug,
				originalUrl,
				userId: session.user.id as string,
			},
		});

		return Response.json({
			id: link.id,
			slug: link.slug,
			shortUrl: `${new URL(request.url).origin}/${link.slug}`,
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database Error Code: ${error.code}`);

			if (error.code === "P2002") {
				return Response.json({ error: "A duplicate slug was generated. Please try again." }, { status: 409 });
			}
		} else {
			console.error("An unexpected error occurred:", error);
		}

		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

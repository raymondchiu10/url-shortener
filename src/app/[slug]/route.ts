import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const link = await prisma.link.findUnique({
		where: {
			slug,
		},
	});

	if (!link) {
		return new Response("Short link not found", {
			status: 404,
		});
	}

	redirect(link.originalUrl);
}

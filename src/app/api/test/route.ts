import { prisma } from "@/lib/prisma";

export async function GET() {
	const links = await prisma.link.findMany();

	return Response.json({
		success: true,
		links,
	});
}

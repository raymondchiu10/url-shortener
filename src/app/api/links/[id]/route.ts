import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await auth();

		if (!session?.user) {
			return Response.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const link = await prisma.link.findUnique({
			where: {
				id,
			},
		});

		if (!link) {
			return Response.json({ error: "Link not found" }, { status: 404 });
		}

		// authorization will go here
	} catch (error) {
		console.error(error);

		return Response.json({ error: "Something went wrong" }, { status: 500 });
	}
}

import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-key";

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();

	const name = body.name;

	if (typeof name !== "string" || !name.trim()) {
		return NextResponse.json({ error: "API key name is required" }, { status: 400 });
	}

	const { rawKey, keyHash } = generateApiKey();

	const apiKey = await prisma.apiKey.create({
		data: {
			name: name.trim(),
			keyHash,
			userId: session.user.id,
		},
	});

	return NextResponse.json(
		{
			id: apiKey.id,
			name: apiKey.name,
			apiKey: rawKey,
			createdAt: apiKey.createdAt,
		},
		{ status: 201 },
	);
}

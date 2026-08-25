import { createHash, randomBytes } from "crypto";

import { prisma } from "@/lib/prisma";

export function generateApiKey() {
	const rawKey = `sk_${randomBytes(32).toString("base64url")}`;

	const keyHash = hashApiKey(rawKey);

	return {
		rawKey,
		keyHash,
	};
}

export function hashApiKey(key: string) {
	return createHash("sha256").update(key).digest("hex");
}

export async function authenticateApiKey(request: Request) {
	const authorization = request.headers.get("authorization");

	if (!authorization?.startsWith("Bearer ")) {
		return null;
	}

	const apiKey = authorization.slice("Bearer ".length).trim();

	if (!apiKey) {
		return null;
	}

	const keyHash = hashApiKey(apiKey);

	const record = await prisma.apiKey.findUnique({
		where: {
			keyHash,
		},
		include: {
			user: true,
		},
	});

	if (!record) {
		return null;
	}

	return record;
}

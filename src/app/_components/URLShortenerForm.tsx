"use client";

import React, { useState } from "react";
import { clsx } from "clsx"; // Import the utility directly

export default function UrlShortenerForm() {
	const [url, setUrl] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [shortUrl, setShortUrl] = useState<string | null>(null);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setShortUrl(null);

		if (!url.trim()) {
			setError("Please paste a destination link");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch("/api/links", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					originalUrl: url,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			setShortUrl(data.shortUrl);
		} catch (error) {
			setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-xl w-full mx-auto p-6 md:p-8 bg-white border border-slate-100 rounded-2xl shadow-sm">
			<h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Shorten a long link</h2>
			<p className="text-sm text-slate-500 mt-1 mb-6">Paste your destination URL to create an optimized alias.</p>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
				<div className="flex-1 flex flex-col gap-1.5">
					<label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
						Destination URL
					</label>

					{/* 1. Dynamic Input Field utilizing clsx */}
					<input
						type="url"
						placeholder="https://example.com"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className={clsx(
							// Base Input Styles (Always applied)
							"w-full h-11 px-4 rounded-xl border bg-slate-50 font-medium text-slate-800 transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2",

							// Conditional States (Applied based on a boolean match)
							{
								"border-slate-200 focus:border-blue-500 focus:ring-blue-500/10": !error,
								"border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10 text-rose-900 placeholder:text-rose-300":
									error,
							},
						)}
					/>
				</div>

				{/* 2. Dynamic Button utilizing clsx */}
				<button
					type="submit"
					disabled={isLoading}
					className={clsx(
						// Base Button Styles
						"h-11 px-6 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]",

						// Simple inline conditionals work too!
						isLoading
							? "bg-blue-500/50 pointer-events-none cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10",
					)}
				>
					{isLoading ? "Shortening..." : "Shorten"}
				</button>
			</form>

			{error && <p className="mt-3 text-sm font-medium text-rose-600">⚠️ {error}</p>}

			{shortUrl && !error && (
				<div className="mt-6 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between gap-4">
					<div className="truncate">
						<p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
							Your Short Link
						</p>
						<p className="text-sm font-medium text-slate-800 truncate mt-0.5">{shortUrl}</p>
					</div>
					<button
						onClick={() => navigator.clipboard.writeText(shortUrl)}
						className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors"
					>
						Copy
					</button>
				</div>
			)}
		</div>
	);
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "URL Shortener - Raymond Chiu",
	description: "Raymond Chiu's URL Shortener for personal projects",
	openGraph: {
		title: "URL Shortener - Raymond Chiu",
		description: "Raymond Chiu's URL Shortener for personal projects",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="min-h-full flex justify-center">{children}</body>
		</html>
	);
}

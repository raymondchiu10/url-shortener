import SignInButton from "@/app/_components/SignInButton";
import URLShortenForm from "@/app/_components/URLShortenerForm";
import { auth } from "../../auth";
import SignOutButton from "@/app/_components/SignOutButton";

export default async function Home() {
	const session = await auth();

	return (
		<div className={"container p-1"}>
			<header className={"flex justify-center"}>
				<h1>URL Shortener</h1>
			</header>

			<main>
				<section>
					<URLShortenForm />
					<div className="container flex justify-center">
						{session ? <SignOutButton /> : <SignInButton />}
					</div>
				</section>
				<pre>{JSON.stringify(session, null, 2)}</pre>
			</main>
		</div>
	);
}

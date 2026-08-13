import { signIn } from "../../../auth";

export default function SignInButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("github", {
					redirectTo: "/",
				});
			}}
		>
			<button className="cursor-pointer" type="submit">
				Sign in with GitHub
			</button>
		</form>
	);
}

import { signOut } from "../../../auth";

export default function SignOutButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signOut({
					redirectTo: "/",
				});
			}}
		>
			<button className="cursor-pointer" type="submit">
				Sign out
			</button>
		</form>
	);
}

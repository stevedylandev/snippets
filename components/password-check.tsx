"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { verify } from "argon2-browser";

interface PasswordCheckProps {
	onPasswordVerified: () => void;
	passwordHash: string;
}

export function PasswordCheck({
	onPasswordVerified,
	passwordHash,
}: PasswordCheckProps) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);

	async function checkPassword() {
		try {
			setIsVerifying(true);
			setError(false);

			console.log("input: ", password);
			console.log("hash: ", passwordHash);

			const verified = await verify({
				pass: password,
				encoded: passwordHash,
			});

			console.log(verified);
			if (verified) {
				onPasswordVerified();
			} else {
				setError(true);
			}
		} catch (err) {
			console.error("Password verification failed:", err);
			setError(true);
		} finally {
			setIsVerifying(false);
		}
	}

	return (
		<Card className="p-6">
			<h2 className="text-lg font-bold mb-4">
				This snippet is password protected
			</h2>
			<div className="space-y-4">
				<Input
					type="password"
					placeholder="Enter password"
					onChange={(e) => setPassword(e.target.value)}
					className={error ? "border-red-500" : ""}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							checkPassword();
						}
					}}
				/>
				{error && <p className="text-red-500 text-sm">Incorrect password</p>}
				<Button onClick={checkPassword} disabled={isVerifying}>
					{isVerifying ? "Verifying..." : "Submit"}
				</Button>
			</div>
		</Card>
	);
}

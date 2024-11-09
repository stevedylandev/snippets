"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

interface PasswordCheckProps {
	onPasswordVerified: (content: string) => void;
	passwordHash: string;
	cid: string;
}

export function PasswordCheck({
	onPasswordVerified,
	passwordHash,
	cid,
}: PasswordCheckProps) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	async function checkPassword() {
		try {
			setIsVerifying(true);
			setError(false);

			const response = await fetch(`/api/content/${cid}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: password,
				}),
			});
			const data = await response.json();

			if (response.ok && data.content) {
				onPasswordVerified(data.content);
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
		<Card className="p-6 mt-24">
			<h2 className="text-lg font-bold mb-4">
				This snip is password protected
			</h2>
			<div className="space-y-4">
				<div className="relative w-full">
					<Input
						type={showPassword ? "text" : "password"}
						placeholder="Enter password"
						onChange={(e) => setPassword(e.target.value)}
						className={`w-full h-8 text-xs pr-10 ${error ? "border-red-500" : ""}`}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								checkPassword();
							}
						}}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? (
							<EyeClosedIcon className="h-4 w-4" />
						) : (
							<EyeOpenIcon className="h-4 w-4" />
						)}
					</button>
				</div>
				{error && <p className="text-red-500 text-sm">Incorrect password</p>}
				<Button
					className="h-8 w-full"
					onClick={checkPassword}
					disabled={isVerifying}
				>
					{isVerifying ? "Verifying..." : "Submit"}
				</Button>
			</div>
		</Card>
	);
}

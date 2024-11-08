// components/protected-content.tsx
"use client";

import { useState } from "react";
import { ReadOnlyEditor } from "./read-only-editor";
import { PasswordCheck } from "./password-check";

interface ProtectedContentProps {
	data: any;
	cid: string;
	futureDate?: Date;
}

export function ProtectedContent({
	data,
	cid,
	futureDate,
}: ProtectedContentProps) {
	const [content, setContent] = useState(data.content);
	const [isVerified, setIsVerified] = useState(!data.passwordHash);

	async function handlePasswordVerified() {
		// Fetch content after password verification
		const response = await fetch(`/api/content/${cid}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				passwordHash: data.passwordHash,
			}),
		});
		const { content } = await response.json();
		setContent(content);
		setIsVerified(true);
	}

	if (!isVerified) {
		return (
			<PasswordCheck
				onPasswordVerified={handlePasswordVerified}
				passwordHash={data.passwordHash}
			/>
		);
	}

	return (
		<ReadOnlyEditor
			content={content}
			name={data.name}
			cid={cid}
			lang={data.lang}
			futureDate={futureDate}
		/>
	);
}

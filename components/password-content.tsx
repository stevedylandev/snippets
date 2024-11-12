// components/protected-content.tsx
"use client";

import { useState } from "react";
import { ReadOnlyEditor } from "./read-only-editor";
import { PasswordCheck } from "./password-check";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";

interface SnippetData {
	content: string;
	name: string;
	lang: LanguageName; // Import from @uiw/codemirror-extensions-langs
	expires: string;
	date: string;
	passwordHash: string;
}

interface ProtectedContentProps {
	data: SnippetData;
	cid: string;
	futureDate?: Date;
	shortUrl?: string;
}

export function ProtectedContent({
	data,
	cid,
	futureDate,
	shortUrl,
}: ProtectedContentProps) {
	const [content, setContent] = useState(data.content);
	const [isVerified, setIsVerified] = useState(!data.passwordHash);

	async function handlePasswordVerified(verifiedContent: string) {
		setContent(verifiedContent);
		setIsVerified(true);
	}

	if (!isVerified) {
		return (
			<PasswordCheck
				onPasswordVerified={handlePasswordVerified}
				passwordHash={data.passwordHash}
				cid={cid}
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
			shortUrl={shortUrl}
		/>
	);
}

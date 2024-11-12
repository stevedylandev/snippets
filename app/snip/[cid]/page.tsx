import { Header } from "@/components/header";
import { ReadOnlyEditor } from "@/components/read-only-editor";
import { type FileListResponse, PinataSDK } from "pinata";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";
import { ProtectedContent } from "@/components/password-content";

interface SnippetData {
	content: string;
	name: string;
	lang: LanguageName;
	expires: string;
	date: string;
	passwordHash: string;
	shortUrl: string;
	cid: string;
}

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_DOMAIN,
});

async function fetchData(hash: string): Promise<SnippetData | Error> {
	try {
		let fileInfo: FileListResponse;
		let cid: string;
		if (hash.startsWith("bafk") || hash.startsWith("Qm")) {
			fileInfo = await pinata.files.list().cid(hash);
			cid = hash;
		} else {
			fileInfo = await pinata.files.list().metadata({
				shortUrl: hash,
			});
			cid = fileInfo.files[0].cid;
		}
		const file = fileInfo.files[0];
		const { data: content, contentType } = await pinata.gateways.get(cid);
		const creationDate = new Date(file.created_at);
		const cutoffDate = new Date("2024-11-07T05:02:00.939309Z");
		if (creationDate < cutoffDate) {
			const jsonContent =
				typeof content === "string" ? JSON.parse(content) : content;

			const res: SnippetData = {
				content: jsonContent.content,
				name: file.name as string,
				lang: jsonContent.lang as LanguageName,
				expires: file.keyvalues.expires || "0",
				date: file.created_at,
				passwordHash: "",
				shortUrl: "",
				cid: cid,
			};
			console.log(res);
			return res;
		}
		const signedUrl = await pinata.gateways.createSignedURL({
			cid: cid,
			expires: 20,
		});
		const contentReq = await fetch(signedUrl);
		const rawContent = await contentReq.text();
		const res: SnippetData = {
			content: rawContent as string,
			name: file.name as string,
			lang: file.keyvalues.lang as LanguageName,
			expires: file.keyvalues.expires || "0",
			date: file.created_at,
			passwordHash: file.keyvalues.passwordHash,
			shortUrl: file.keyvalues.shortUrl,
			cid: cid,
		};
		console.log(res);
		return res;
	} catch (error) {
		console.log(error);
		return error as Error;
	}
}

export default async function Page({ params }: { params: { cid: string } }) {
	const fileHash = params.cid;
	const data = await fetchData(fileHash);
	let hasExpired = false;
	let futureDate: Date | undefined;

	if (data instanceof Error) {
		throw data;
	}

	if (data.expires !== "0") {
		const date = new Date(data.date);
		futureDate = new Date(
			date.getTime() + Number.parseInt(data.expires) * 1000,
		);
		const currentDate = new Date();
		hasExpired = currentDate > futureDate;
		console.log("Has expired:", hasExpired);
	}

	// Don't pass content to client if password protected
	const isPasswordProtected = !!data.passwordHash;
	const clientData = {
		...data,
		content: isPasswordProtected ? "" : data.content,
		passwordHash: data.passwordHash,
	};

	return (
		<main className="flex min-h-screen flex-col items-center sm:justify-start">
			<Header />
			{!hasExpired && !isPasswordProtected && (
				<ReadOnlyEditor
					content={data.content}
					name={data.name}
					cid={data.cid}
					lang={data.lang}
					futureDate={futureDate}
					shortUrl={data.shortUrl}
				/>
			)}
			{!hasExpired && isPasswordProtected && (
				<ProtectedContent
					data={clientData}
					cid={data.cid}
					futureDate={futureDate}
					shortUrl={data.shortUrl}
				/>
			)}
			{hasExpired && (
				<div className="w-full min-h-96 flex flex-col justify-center items-center gap-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 16 16"
						className="h-12 w-12"
					>
						<title>Expired</title>
						<path
							fill="current-color"
							fillRule="evenodd"
							d="M8.175.002a8 8 0 1 0 2.309 15.603a.75.75 0 0 0-.466-1.426a6.5 6.5 0 1 1 3.996-8.646a.75.75 0 0 0 1.388-.569A8 8 0 0 0 8.175.002M8.75 3.75a.75.75 0 0 0-1.5 0v3.94L5.216 9.723a.75.75 0 1 0 1.06 1.06L8.53 8.53l.22-.22zM15 15a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0z"
							clipRule="evenodd"
						/>
					</svg>
					<h3 className="text-2xl font-bold">Snippet Expired</h3>
				</div>
			)}
		</main>
	);
}

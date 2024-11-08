import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ReadOnlyEditor } from "@/components/read-only-editor";
import { PinataSDK } from "pinata";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";

interface SnippetData {
	content: string;
	name: string;
	lang: LanguageName;
	expires: string;
	date: string;
}

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_DOMAIN,
});

async function fetchData(cid: string): Promise<SnippetData | Error> {
	try {
		const fileInfo = await pinata.files.list().cid(cid);
		const { data: content } = await pinata.gateways.get(cid);
		const res: SnippetData = {
			content: content as string,
			name: fileInfo.files[0].name as string,
			lang: fileInfo.files[0].keyvalues.lang as LanguageName,
			expires: fileInfo.files[0].keyvalues.expires,
			date: fileInfo.files[0].created_at,
		};
		console.log(res);
		return res;
	} catch (error) {
		console.log(error);
		return error as Error;
	}
}

export default async function Page({ params }: { params: { cid: string } }) {
	const cid = params.cid;
	const data = await fetchData(cid);
	let hasExpired = false;

	if (data instanceof Error) {
		throw data;
	}

	if (data.expires !== "") {
		const date = new Date(data.date);
		const futureDate = new Date(
			date.getTime() + Number.parseInt(data.expires) * 1000,
		);
		const currentDate = new Date();
		hasExpired = currentDate > futureDate;
		console.log("Has expired:", hasExpired);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center sm:justify-start">
			<Header />
			{!hasExpired && (
				<ReadOnlyEditor
					content={data.content}
					name={data.name}
					cid={cid}
					lang={data.lang}
				/>
			)}
			{hasExpired && (
				<div className="w-full min-h-96 flex flex-col justify-center items-center gap-4">
					<h3>Content has expired</h3>
				</div>
			)}
			<Footer />
		</main>
	);
}

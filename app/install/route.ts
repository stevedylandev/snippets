import { NextResponse } from "next/server";

export async function GET() {
	try {
		const data = await fetch("https://www.snippets.so/script.sh");
		const file = await data.blob();
		const headers = new Headers();
		headers.set("Content-Type", "application/octet-stream");
		headers.set("Content-Disposition", 'attachment; filename="install.sh"');
		return new NextResponse(file, {
			status: 200,
			headers: headers,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error);
	}
}

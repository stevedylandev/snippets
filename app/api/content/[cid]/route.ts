// app/api/content/[cid]/route.ts
import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_DOMAIN,
});

export async function POST(
	request: Request,
	{ params }: { params: { cid: string } },
) {
	try {
		const { passwordHash } = await request.json();
		const { data: content } = await pinata.gateways.get(params.cid);

		// Verify the password hash matches before returning content
		const fileInfo = await pinata.files.list().cid(params.cid);
		const file = fileInfo.files[0];

		if (file.keyvalues.passwordHash === passwordHash) {
			return NextResponse.json({ content });
		}
		return NextResponse.json({ error: "Invalid password" }, { status: 401 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

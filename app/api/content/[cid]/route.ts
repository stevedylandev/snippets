import { NextResponse } from "next/server";
import { PinataSDK } from "pinata";
import * as argon2 from "argon2";
//const argon2 = require("argon2");

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_DOMAIN,
});

export async function POST(
	request: Request,
	{ params }: { params: { cid: string } },
) {
	try {
		const body = await request.json();
		const signedUrl = await pinata.gateways.createSignedURL({
			cid: params.cid,
			expires: 20,
		});
		const contentReq = await fetch(signedUrl);
		const content = await contentReq.text();

		const fileInfo = await pinata.files.list().cid(params.cid);
		const file = fileInfo.files[0];

		// Add logging to debug
		console.log("Received password:", body.password);
		console.log("Stored hash:", file.keyvalues.passwordHash);

		// Ensure both password and hash are strings
		const password = String(body.password);
		const hash = String(file.keyvalues.passwordHash);

		try {
			const isValid = await argon2.verify(hash, password);
			if (isValid) {
				return NextResponse.json({ content });
			}
		} catch (verifyError) {
			console.error("Verification error:", verifyError);
		}

		return NextResponse.json({ error: "Invalid password" }, { status: 401 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

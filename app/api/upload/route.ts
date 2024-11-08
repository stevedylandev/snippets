"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PinataSDK, type UploadResponse } from "pinata";

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const file = new File([body.content], body.name, { type: "text/plain" });
		const res: UploadResponse = await pinata.upload
			.file(file)
			.addMetadata({
				name: body.name,
				keyvalues: {
					lang: body.lang,
					private: body.isPrivate,
					expires: body.expires,
				},
			})
			.group(body.isPrivate === "true" ? "" : process.env.GROUP_ID!);
		return NextResponse.json({
			IpfsHash: res.cid,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error);
	}
}

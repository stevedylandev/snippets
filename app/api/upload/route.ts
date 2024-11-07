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
		const res: UploadResponse = await pinata.upload
			.json({
				content: body.content,
				name: body.name,
				lang: body.lang,
			})
			.addMetadata({
				name: body.name,
			})
			.group(process.env.GROUP_ID!);
		return NextResponse.json({
			IpfsHash: res.cid,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error);
	}
}

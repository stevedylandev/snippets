"use server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PinataSDK, type UploadResponse } from "pinata";
const argon2 = require("argon2");
import { nanoid } from "nanoid";

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const file = new File([body.content], body.name, { type: "text/plain" });
		let passwordHash = "";
		if (body.password) {
			passwordHash = await argon2.hash(body.password);
		}
		const res: UploadResponse = await pinata.upload
			.file(file)
			.addMetadata({
				name: body.name,
				keyvalues: {
					lang: body.lang,
					private: body.isPrivate,
					expires: body.expires,
					passwordHash: passwordHash,
				},
			})
			.group(body.isPrivate === "true" ? "" : process.env.GROUP_ID || "");

		const updated = await pinata.files.update({
			id: res.id,
			keyvalues: {
				shortUrl: nanoid(10),
			},
		});
		return NextResponse.json({
			IpfsHash: res.cid,
			shortUrl: updated.keyvalues.shortUrl,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(error);
	}
}

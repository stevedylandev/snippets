import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);
    const data = JSON.stringify({
      pinataContent: {
        data: body.data,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });
    const req = await fetch(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: data,
    });
    const res: any = await req.json();
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

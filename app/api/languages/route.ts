import { NextResponse } from "next/server";
import { languages } from "@/lib/languages";

export async function GET() {
  try {
    return NextResponse.json(languages);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}

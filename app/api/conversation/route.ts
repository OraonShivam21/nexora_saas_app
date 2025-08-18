import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!client.apiKey)
      return new NextResponse("OpenAI API Key not configured", { status: 500 });

    if (!messages)
      return new NextResponse("Messages are required", { status: 400 });

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    console.log("response", response);
    return NextResponse.json(response);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
